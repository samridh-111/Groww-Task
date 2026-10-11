import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingShell } from '../../components/layout/OnboardingShell';
import { NumberInput } from '../../components/ui/NumberInput';
import { Button } from '../../components/ui/Button';
import { useAppState } from '../../state/AppState';

const PRESETS = [15000, 30000, 50000, 80000];

export default function IncomePage() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const [income, setIncome] = useState(state.monthlyIncome || 0);
  const [irregular, setIrregular] = useState(state.incomeMode === 'irregular');

  const isValid = income >= 1000 && income <= 10000000;
  const error =
    income > 0 && income < 1000
      ? 'Minimum amount is ₹1,000'
      : income > 10000000
      ? 'Amount exceeds ₹1,00,00,000 limit'
      : '';

  const handleContinue = () => {
    dispatch({ type: 'SET_MONTHLY_INCOME', payload: income });
    dispatch({ type: 'SET_INCOME_MODE', payload: irregular ? 'irregular' : 'fixed' });
    navigate('/onboarding/expenses');
  };

  return (
    <OnboardingShell step={2} totalSteps={6}>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="font-bold text-[22px] leading-[1.2] tracking-[-0.02em] text-ink mb-1.5">
            {irregular
              ? 'In a typical month, how much comes in?'
              : "What's your monthly income?"}
          </h2>
          <p className="text-[13px] text-muted mb-7 leading-relaxed">
            Take-home salary, stipend, or average earnings. You can update this anytime.
          </p>

          {/* Number input — visually primary */}
          <NumberInput
            id="income-input"
            value={income}
            onChange={setIncome}
            min={1000}
            max={10000000}
            error={error}
            className="mb-5"
          />

          {/* Quick preset amounts */}
          <div className="flex flex-wrap gap-2 mb-7">
            {PRESETS.map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setIncome(amt)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer tabular-nums border ${
                  income === amt
                    ? 'bg-accent text-white border-accent'
                    : 'bg-surface border-hairline text-ink-secondary hover:border-accent/50'
                }`}
              >
                ₹{new Intl.NumberFormat('en-IN').format(amt)}
              </button>
            ))}
          </div>

          {/* Irregular income toggle — inline, not a card */}
          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <div className="mt-0.5 relative shrink-0">
              <input
                type="checkbox"
                checked={irregular}
                onChange={e => {
                  setIrregular(e.target.checked);
                  dispatch({
                    type: 'SET_INCOME_MODE',
                    payload: e.target.checked ? 'irregular' : 'fixed',
                  });
                }}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                  irregular ? 'bg-accent border-accent' : 'border-hairline bg-surface'
                }`}
              >
                {irregular && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
            <div>
              <span className="text-[14px] font-semibold text-ink block">
                My income varies month-to-month
              </span>
              <p className="text-[12px] text-muted mt-0.5 leading-relaxed">
                We'll build a larger flexible cushion so you're never locked in during lean months.
              </p>
            </div>
          </label>
        </div>

        <div className="sticky bottom-0 py-4 bg-bg mt-6 safe-bottom">
          <Button fullWidth size="lg" disabled={!isValid} onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}
