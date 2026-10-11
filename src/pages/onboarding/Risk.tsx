import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { OnboardingShell } from '../../components/layout/OnboardingShell';
import { Button } from '../../components/ui/Button';
import { useAppState } from '../../state/AppState';
import type { RiskPreference } from '../../lib/types';

const OPTIONS: {
  id: RiskPreference;
  label: string;
  sub: string;
  letter: string;
}[] = [
  {
    id: 'cautious',
    letter: 'A',
    label: "I'd sell immediately",
    sub: 'Protect remaining capital from further drop',
  },
  {
    id: 'steady',
    letter: 'B',
    label: "I'd wait and watch",
    sub: 'Avoid impulsive decisions and observe',
  },
  {
    id: 'balanced',
    letter: 'C',
    label: "I'd stay invested",
    sub: 'Stick to my long-term financial plan',
  },
  {
    id: 'growth',
    letter: 'D',
    label: "I'd invest more",
    sub: 'View price dips as an opportunity to average down',
  },
];

export default function RiskPage() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<RiskPreference | null>(state.riskPreference);

  const handleSelect = (pref: RiskPreference) => {
    setSelected(pref);
  };

  const handleContinue = () => {
    if (!selected) return;
    dispatch({ type: 'SET_RISK_PREFERENCE', payload: selected });
    dispatch({ type: 'COMPUTE_PLAN' });
    navigate('/onboarding/calculating');
  };

  return (
    <OnboardingShell step={6} totalSteps={6}>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Market scenario — clean accent surface, not a card-in-a-card */}
          <div className="bg-accent-light rounded-[var(--radius-card)] p-4 mb-7">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-accent-deeper">
                Hypothetical Scenario
              </p>
              <span className="text-[11px] font-bold text-caution bg-caution-light px-2 py-0.5 rounded-full">
                −20% drop
              </span>
            </div>
            <p className="font-bold text-[16px] text-ink leading-[1.35] mb-1.5">
              Your ₹10,000 investment temporarily drops to ₹8,000 during a market correction.
            </p>
            <p className="text-[12px] text-ink-secondary">
              Markets move in cycles. What would you instinctively do?
            </p>
          </div>

          {/* Options — compact list */}
          <div className="space-y-2.5">
            {OPTIONS.map(({ id, label, sub, letter }, i) => {
              const isSelected = selected === id;
              return (
                <motion.button
                  key={id}
                  type="button"
                  onClick={() => handleSelect(id)}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  className={`option-row w-full text-left ${isSelected ? 'selected' : ''}`}
                  aria-pressed={isSelected}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[13px] shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-accent text-white'
                        : 'bg-surface-subtle text-muted'
                    }`}
                  >
                    {letter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-[14px] text-ink block leading-snug">
                      {label}
                    </span>
                    <span className="text-[12px] text-muted leading-normal">{sub}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                      isSelected ? 'bg-accent border-accent' : 'border-hairline'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Reassurance — inline, not another card */}
          {selected && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[12px] text-ink-secondary mt-4 leading-relaxed"
            >
              No wrong answer. We'll balance equity vs. debt allocations to keep you comfortable through volatility.
            </motion.p>
          )}
        </div>

        <div className="sticky bottom-0 py-4 bg-bg mt-6 safe-bottom">
          <Button fullWidth size="lg" disabled={!selected} onClick={handleContinue}>
            Calculate my plan
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}
