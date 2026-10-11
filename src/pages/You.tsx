import { useNavigate } from 'react-router-dom';
import { useAppState } from '../state/AppState';
import { DisclaimerStrip } from '../components/ui/DisclaimerStrip';
import { BottomNav } from '../components/layout/BottomNav';
import { formatCurrency } from '../lib/content';

const RISK_WORDS: Record<string, string> = {
  cautious: 'Cautious — prioritizes capital safety',
  steady: 'Steady — small fluctuations tolerated',
  balanced: 'Balanced — long-term resilience',
  growth: 'Growth — open to higher volatility',
};

const SITUATION: Record<string, string> = {
  student: 'Student',
  'first-job': 'First job',
  freelancer: 'Freelancer',
  professional: 'Working professional',
};

export default function YouPage() {
  const navigate = useNavigate();
  const { state } = useAppState();
  const initials = (state.name.trim() || 'You')[0].toUpperCase();

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen bg-bg">
      <div className="flex-1 px-6 pt-8 pb-24">
        {/* Profile header — open, not in a card */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-bold text-lg shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-bold text-[18px] text-ink">
                {state.name.trim() || 'Your Profile'}
              </p>
              <p className="text-[13px] text-muted">
                {state.userType ? SITUATION[state.userType] : 'Not specified'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/you/profile')}
              className="ml-auto text-[12px] font-semibold text-accent cursor-pointer hover:text-accent-dark transition-colors"
            >
              Edit
            </button>
          </div>

          {/* Financial summary — compact table, no nested card */}
          <div className="border-t border-hairline-subtle">
            <div className="data-row">
              <span className="text-[13px] text-muted">Monthly income</span>
              <span className="font-semibold text-[13px] text-ink tabular-nums">{formatCurrency(state.monthlyIncome)}</span>
            </div>
            <div className="data-row">
              <span className="text-[13px] text-muted">Monthly expenses</span>
              <span className="font-semibold text-[13px] text-ink tabular-nums">{formatCurrency(state.monthlyExpenses)}</span>
            </div>
            <div className="data-row">
              <span className="text-[13px] text-muted">Risk profile</span>
              <span className="font-semibold text-[13px] text-ink text-right max-w-[180px]">
                {state.riskPreference ? RISK_WORDS[state.riskPreference] : 'Not set'}
              </span>
            </div>
          </div>
        </header>

        {/* Action menu — simple list */}
        <p className="section-label mb-3">Actions</p>
        <div className="bg-surface border border-hairline rounded-[var(--radius-card)] overflow-hidden mb-5">
          <button
            onClick={() => navigate('/plan')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-surface-subtle transition-colors cursor-pointer border-b border-hairline-subtle"
          >
            <div>
              <p className="font-semibold text-[14px] text-ink">Review Money Plan</p>
              <p className="text-[12px] text-muted mt-0.5">Monthly allocation breakdown</p>
            </div>
            <svg className="w-4 h-4 text-ghost shrink-0" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={() => navigate('/you/demo')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            <div>
              <p className="font-semibold text-[14px] text-ink">Demo Controls</p>
              <p className="text-[12px] text-muted mt-0.5">Quick switcher, month jumper, reset</p>
            </div>
            <svg className="w-4 h-4 text-ghost shrink-0" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* About — minimal, no decorative card */}
        <p className="section-label mb-2">About</p>
        <p className="text-[12px] text-muted leading-relaxed mb-3">
          Groww Gen Z prototype — designed for a product challenge submission. Simulated environment; no bank account integration or real capital is used.
        </p>
        <DisclaimerStrip />
      </div>
      <BottomNav />
    </div>
  );
}
