import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { OnboardingShell } from '../../components/layout/OnboardingShell';
import { NumberInput } from '../../components/ui/NumberInput';
import { Button } from '../../components/ui/Button';
import { useAppState } from '../../state/AppState';
import { formatCurrency } from '../../lib/content';
import type { EmergencyBuffer } from '../../lib/types';

const BUFFER_OPTIONS = [
  { id: 'none' as EmergencyBuffer, label: 'None yet', desc: 'We\'ll prioritize this first' },
  { id: 'some' as EmergencyBuffer, label: '1–2 months', desc: 'Partially covered' },
  { id: 'solid' as EmergencyBuffer, label: '3+ months', desc: 'Well covered' },
];

export default function ExpensesPage() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState(state.monthlyExpenses || 0);
  const [buffer, setBuffer] = useState<EmergencyBuffer>(state.emergencyBuffer);

  const available = Math.max(0, state.monthlyIncome - expenses);
  const expensesExceedIncome =
    expenses > state.monthlyIncome && expenses > 0 && state.monthlyIncome > 0;

  const handleContinue = () => {
    dispatch({ type: 'SET_MONTHLY_EXPENSES', payload: expenses });
    dispatch({ type: 'SET_EMERGENCY_BUFFER', payload: buffer });
    navigate('/onboarding/goals');
  };

  return (
    <OnboardingShell step={3} totalSteps={6}>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="font-bold text-[22px] leading-[1.2] tracking-[-0.02em] text-ink mb-1.5">
            About how much do you spend each month?
          </h2>
          <p className="text-[13px] text-muted mb-7 leading-relaxed">
            Include rent, food, transport, bills, and daily essentials.
          </p>

          <NumberInput
            id="expenses-input"
            value={expenses}
            onChange={setExpenses}
            min={0}
            max={10000000}
            className="mb-5"
          />

          {/* Warning — inline, not a card */}
          {expensesExceedIncome && (
            <p className="text-[12px] text-caution font-semibold mb-4">
              Your expenses exceed your income. You can still continue.
            </p>
          )}

          {/* Live available amount — accent highlight, clean */}
          {state.monthlyIncome > 0 && (
            <motion.div
              className="flex items-center justify-between py-3.5 px-4 rounded-[var(--radius-card)] bg-accent-light mb-7"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-accent-deeper mb-0.5">
                  Available for your plan
                </p>
                <p className="font-bold text-[24px] text-ink tabular-nums leading-none">
                  {formatCurrency(available)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-muted">Monthly income</p>
                <p className="text-[13px] font-semibold text-ink tabular-nums">
                  {formatCurrency(state.monthlyIncome)}
                </p>
              </div>
            </motion.div>
          )}

          {/* Emergency savings — compact list */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted mb-3">
              Do you have emergency savings?
            </p>
            <div className="space-y-2">
              {BUFFER_OPTIONS.map(({ id, label, desc }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setBuffer(id)}
                  className={`option-row w-full text-left ${buffer === id ? 'selected' : ''}`}
                  aria-pressed={buffer === id}
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-[14px] text-ink block">{label}</span>
                    <span className="text-[12px] text-muted">{desc}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                      buffer === id ? 'bg-accent border-accent' : 'border-hairline'
                    }`}
                  >
                    {buffer === id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 py-4 bg-bg mt-6 safe-bottom">
          <Button
            fullWidth
            size="lg"
            disabled={expenses < 0 || isNaN(expenses)}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}
