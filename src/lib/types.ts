// ─── Goal IDs ───
export type GoalId = 'emergency' | 'travel' | 'education' | 'car' | 'wealth' | 'starting';

// ─── Category IDs ───
export type CategoryId = 'liquid' | 'short-debt' | 'hybrid' | 'index' | 'equity';

// ─── User Types ───
export type UserType = 'student' | 'first-job' | 'freelancer' | 'professional';
export type IncomeMode = 'fixed' | 'irregular';
export type EmergencyBuffer = 'none' | 'some' | 'solid';
export type RiskPreference = 'cautious' | 'steady' | 'balanced' | 'growth';
export type GoalTimeline = '<1' | '1-3' | '3-5' | '5+';

// ─── Plan ───
export interface PlanBucket {
  id: string;
  label: string;
  amount: number;
  categoryId: CategoryId;
  goalId?: GoalId;
  purpose: string;
  milestone: number;
}

export interface PlanReason {
  headline: string;
  explanation: string;
}

export interface Plan {
  status: 'ok' | 'not-yet';
  available: number;
  flexible: number;
  emergency: number;
  emergencyTarget: number;
  buckets: PlanBucket[];
  reasons: PlanReason[];
  mismatchNote: string | null;
}

// ─── Holdings ───
export interface Holding {
  id: string;
  categoryId: CategoryId;
  bucketId: string;
  invested: number;
  value: number;
  createdMonth: number;
}

// ─── App State ───
export interface AppState {
  name: string;
  experience: 'first-time' | 'experienced';
  userType: UserType | null;
  incomeMode: IncomeMode;
  monthlyIncome: number;
  monthlyExpenses: number;
  emergencyBuffer: EmergencyBuffer;
  goals: GoalId[];
  goalTimelines: Record<GoalId, GoalTimeline>;
  riskPreference: RiskPreference | null;
  plan: Plan | null;
  holdings: Holding[];
  monthIndex: number;
  contributedThisMonth: boolean;
  lessonsCompleted: string[];
  onboardingComplete: boolean;
  demo: { failNextConfirm: boolean };
}

// ─── Actions ───
export type AppAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_EXPERIENCE'; payload: 'first-time' | 'experienced' }
  | { type: 'SET_USER_TYPE'; payload: UserType }
  | { type: 'SET_INCOME_MODE'; payload: IncomeMode }
  | { type: 'SET_MONTHLY_INCOME'; payload: number }
  | { type: 'SET_MONTHLY_EXPENSES'; payload: number }
  | { type: 'SET_EMERGENCY_BUFFER'; payload: EmergencyBuffer }
  | { type: 'SET_GOALS'; payload: GoalId[] }
  | { type: 'SET_GOAL_TIMELINE'; payload: { goalId: GoalId; timeline: GoalTimeline } }
  | { type: 'SET_RISK_PREFERENCE'; payload: RiskPreference }
  | { type: 'COMPUTE_PLAN' }
  | { type: 'ADD_HOLDING'; payload: Holding }
  | { type: 'SET_ONBOARDING_COMPLETE'; payload: boolean }
  | { type: 'COMPLETE_LESSON'; payload: string }
  | { type: 'JUMP_MONTH' }
  | { type: 'SET_CONTRIBUTED_THIS_MONTH'; payload: boolean }
  | { type: 'TOGGLE_FAIL_NEXT_CONFIRM' }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'RESET' };

// ─── Category Info ───
export interface CategoryInfo {
  id: CategoryId;
  name: string;
  riskLabel: string;
  riskDots: number;
  bestFor: string;
  whatIs: string;
  fitsWhen: string;
  howRisky: string;
  howLong: string;
  whatCouldGoWrong: string;
  illustrativeFall: string;
}
