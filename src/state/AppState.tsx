import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import type { AppState, AppAction, GoalId, GoalTimeline } from '../lib/types';
import { computePlan } from '../lib/planEngine';
import { applyMonthlyReturns } from '../lib/simulation';
import { Toast } from '../components/ui/Toast';

const STORAGE_KEY = 'groww-proto-v1';

const initialState: AppState = {
  name: '',
  experience: 'first-time',
  userType: null,
  incomeMode: 'fixed',
  monthlyIncome: 0,
  monthlyExpenses: 0,
  emergencyBuffer: 'none',
  goals: [],
  goalTimelines: {} as Record<GoalId, GoalTimeline>,
  riskPreference: null,
  plan: null,
  holdings: [],
  monthIndex: 0,
  contributedThisMonth: false,
  lessonsCompleted: [],
  onboardingComplete: false,
  demo: { failNextConfirm: false },
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_EXPERIENCE':
      return { ...state, experience: action.payload };
    case 'SET_USER_TYPE': {
      const incomeMode = action.payload === 'freelancer' ? 'irregular' as const : state.incomeMode;
      return { ...state, userType: action.payload, incomeMode };
    }
    case 'SET_INCOME_MODE':
      return { ...state, incomeMode: action.payload };
    case 'SET_MONTHLY_INCOME':
      return { ...state, monthlyIncome: action.payload };
    case 'SET_MONTHLY_EXPENSES':
      return { ...state, monthlyExpenses: action.payload };
    case 'SET_EMERGENCY_BUFFER':
      return { ...state, emergencyBuffer: action.payload };
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    case 'SET_GOAL_TIMELINE': {
      const goalTimelines = { ...state.goalTimelines, [action.payload.goalId]: action.payload.timeline };
      return { ...state, goalTimelines };
    }
    case 'SET_RISK_PREFERENCE':
      return { ...state, riskPreference: action.payload };
    case 'COMPUTE_PLAN': {
      const plan = computePlan(state);
      return { ...state, plan };
    }
    case 'ADD_HOLDING':
      return { ...state, holdings: [...state.holdings, action.payload] };
    case 'SET_ONBOARDING_COMPLETE':
      return { ...state, onboardingComplete: action.payload };
    case 'COMPLETE_LESSON':
      if (state.lessonsCompleted.includes(action.payload)) return state;
      return { ...state, lessonsCompleted: [...state.lessonsCompleted, action.payload] };
    case 'JUMP_MONTH': {
      const newMonth = state.monthIndex + 1;
      const updatedHoldings = applyMonthlyReturns(state.holdings, state.monthIndex);
      return { ...state, monthIndex: newMonth, holdings: updatedHoldings, contributedThisMonth: false };
    }
    case 'SET_CONTRIBUTED_THIS_MONTH':
      return { ...state, contributedThisMonth: action.payload };
    case 'TOGGLE_FAIL_NEXT_CONFIRM':
      return { ...state, demo: { ...state.demo, failNextConfirm: !state.demo.failNextConfirm } };
    case 'LOAD_STATE':
      return { ...action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

function markStorageReset() {
  try {
    sessionStorage.setItem('groww-storage-reset', '1');
  } catch {
    /* ignore */
  }
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || typeof parsed.monthlyIncome !== 'number') {
      markStorageReset();
      localStorage.removeItem(STORAGE_KEY);
      return initialState;
    }
    return { ...initialState, ...parsed };
  } catch {
    markStorageReset();
    localStorage.removeItem(STORAGE_KEY);
    return initialState;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);
  const [resetToast, setResetToast] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('groww-storage-reset')) {
        sessionStorage.removeItem('groww-storage-reset');
        setResetToast(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to persist state', e);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
      <Toast
        message="Saved data was unreadable, so we started fresh."
        visible={resetToast}
        onDone={() => setResetToast(false)}
      />
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used within AppProvider');
  return context;
}

export function useAvailableAmount(): number {
  const { state } = useAppState();
  return Math.max(0, state.monthlyIncome - state.monthlyExpenses);
}

export { initialState };
