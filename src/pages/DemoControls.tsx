import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../state/AppState';
import { Button } from '../components/ui/Button';
import { BottomSheet } from '../components/ui/BottomSheet';
import { Toast } from '../components/ui/Toast';
import { DisclaimerStrip } from '../components/ui/DisclaimerStrip';
import { computePlan } from '../lib/planEngine';
import type { AppState, GoalId } from '../lib/types';

export default function DemoControlsPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleReset = () => {
    localStorage.removeItem('groww-proto-v1');
    sessionStorage.removeItem('groww-disclaimer-seen');
    dispatch({ type: 'RESET' });
    setShowResetConfirm(false);
    navigate('/welcome', { replace: true });
  };

  const handleJumpMonth = () => {
    dispatch({ type: 'JUMP_MONTH' });
    setToastMessage(`Advanced to Month ${state.monthIndex + 2}. Holdings recalculated with returns.`);
    setShowToast(true);
  };

  const loadPersona = (personaType: 'student' | 'first-job' | 'freelancer') => {
    let personaState: Partial<AppState> = {};

    if (personaType === 'student') {
      personaState = {
        name: 'Aarav (Student)',
        experience: 'first-time',
        userType: 'student',
        incomeMode: 'irregular',
        monthlyIncome: 8000,
        monthlyExpenses: 5500,
        emergencyBuffer: 'none',
        goals: ['travel', 'wealth'],
        goalTimelines: { travel: '1-3', wealth: '5+' } as Record<GoalId, any>,
        riskPreference: 'steady',
        holdings: [],
        monthIndex: 0,
        contributedThisMonth: false,
        onboardingComplete: false,
      };
    } else if (personaType === 'first-job') {
      personaState = {
        name: 'Priya (First Job)',
        experience: 'first-time',
        userType: 'first-job',
        incomeMode: 'fixed',
        monthlyIncome: 30000,
        monthlyExpenses: 20000,
        emergencyBuffer: 'none',
        goals: ['emergency', 'travel', 'wealth'],
        goalTimelines: { emergency: '<1', travel: '1-3', wealth: '5+' } as Record<GoalId, any>,
        riskPreference: 'balanced',
        holdings: [],
        monthIndex: 0,
        contributedThisMonth: false,
        onboardingComplete: false,
      };
    } else if (personaType === 'freelancer') {
      personaState = {
        name: 'Rohan (Freelancer)',
        experience: 'first-time',
        userType: 'freelancer',
        incomeMode: 'irregular',
        monthlyIncome: 25000,
        monthlyExpenses: 18000,
        emergencyBuffer: 'none',
        goals: ['wealth'],
        goalTimelines: { wealth: '5+' } as Record<GoalId, any>,
        riskPreference: 'cautious',
        holdings: [],
        monthIndex: 0,
        contributedThisMonth: false,
        onboardingComplete: false,
      };
    }

    const fullState: AppState = {
      ...state,
      ...personaState,
    };
    fullState.plan = computePlan(fullState);

    dispatch({ type: 'LOAD_STATE', payload: fullState });
    setToastMessage(`Switched to ${personaState.name} profile`);
    setShowToast(true);
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-6 min-h-screen bg-bg">
      <Toast message={toastMessage} visible={showToast} onDone={() => setShowToast(false)} />

      <div className="space-y-6">
        {/* Navigation & Header */}
        <header className="flex items-center justify-between border-b border-hairline pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
              Sandbox
            </span>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-ink">
              Demo Controls
            </h1>
          </div>
          <button
            onClick={() => navigate('/you')}
            className="text-xs font-semibold text-muted hover:text-ink px-3 py-1.5 rounded-lg border border-hairline bg-surface transition-colors cursor-pointer"
          >
            Back
          </button>
        </header>

        {/* Personas */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
            Test Personas
          </span>
          <div className="border border-hairline rounded-xl divide-y divide-hairline bg-surface overflow-hidden">
            {[
              {
                id: 'student',
                name: 'Aarav (Student)',
                desc: '₹8k income, ₹5.5k expenses · Irregular · Student',
              },
              {
                id: 'first-job',
                name: 'Priya (First Job)',
                desc: '₹30k income, ₹20k expenses · Fixed · First job',
              },
              {
                id: 'freelancer',
                name: 'Rohan (Freelancer)',
                desc: '₹25k income, ₹18k expenses · Irregular income',
              },
            ].map(p => (
              <div
                key={p.id}
                className="p-3.5 flex justify-between items-center text-xs hover:bg-surface-subtle transition-colors"
              >
                <div>
                  <span className="font-bold text-ink block">{p.name}</span>
                  <span className="text-muted text-[11px] mt-0.5">{p.desc}</span>
                </div>
                <button
                  type="button"
                  onClick={() => loadPersona(p.id as any)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-accent-dark border border-accent/40 bg-accent-light/50 hover:bg-accent-light cursor-pointer"
                >
                  Load
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Time Advance */}
        <div className="border border-hairline rounded-xl p-4 bg-surface space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-ink block">
                Simulate Future Month
              </span>
              <span className="text-[11px] text-muted block mt-0.5">
                Current: <strong className="text-ink">Month {state.monthIndex + 1}</strong>
              </span>
            </div>
            <Button size="sm" onClick={handleJumpMonth}>
              +1 Month
            </Button>
          </div>
          <p className="text-[11px] text-muted leading-relaxed">
            Advances timeline by 1 month to calculate simulated compounding returns and allow fresh contributions.
          </p>
        </div>

        {/* Simulate Order Failure */}
        <div className="border border-hairline rounded-xl p-4 bg-surface flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-ink block">
              Simulate Order Failure
            </span>
            <span className="text-[11px] text-muted block mt-0.5">
              Next investment triggers simulated error screen
            </span>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: 'TOGGLE_FAIL_NEXT_CONFIRM' })}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
              state.demo.failNextConfirm ? 'bg-caution' : 'bg-hairline'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                state.demo.failNextConfirm ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Reset State */}
        <div className="border border-hairline rounded-xl p-4 bg-surface space-y-3">
          <div>
            <span className="text-xs font-bold text-caution block">
              Reset Prototype Data
            </span>
            <span className="text-[11px] text-muted block mt-0.5">
              Clears localStorage and restarts onboarding
            </span>
          </div>
          <Button
            size="sm"
            variant="caution"
            onClick={() => setShowResetConfirm(true)}
          >
            Reset Everything
          </Button>
        </div>

        <DisclaimerStrip />
      </div>

      <BottomSheet
        open={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Reset prototype state?"
      >
        <div className="space-y-4 pt-1">
          <p className="text-xs text-muted leading-relaxed">
            This will wipe your simulated portfolio, onboarding profile, and local storage, returning to the Welcome screen.
          </p>
          <div className="flex gap-2.5">
            <Button
              fullWidth
              variant="secondary"
              onClick={() => setShowResetConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="caution"
              onClick={handleReset}
            >
              Confirm reset
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
