import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { OnboardingShell } from '../../components/layout/OnboardingShell';
import { Button } from '../../components/ui/Button';
import { FinanceIcon } from '../../components/ui/FinanceIcon';
import { useAppState } from '../../state/AppState';
import type { UserType } from '../../lib/types';

const USER_TYPES: {
  id: UserType;
  label: string;
  desc: string;
  iconName: 'student' | 'first-job' | 'freelancer' | 'professional';
}[] = [
  {
    id: 'student',
    label: 'Student',
    desc: 'Pocket money or stipend',
    iconName: 'student',
  },
  {
    id: 'first-job',
    label: 'First job',
    desc: 'Recently started earning',
    iconName: 'first-job',
  },
  {
    id: 'freelancer',
    label: 'Freelancer',
    desc: 'Variable monthly income',
    iconName: 'freelancer',
  },
  {
    id: 'professional',
    label: 'Professional',
    desc: 'Steady monthly salary',
    iconName: 'professional',
  },
];

export default function SituationPage() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const [name, setName] = useState(state.name);
  const [selected, setSelected] = useState<UserType | null>(state.userType);

  const handleSelect = (type: UserType) => {
    setSelected(type);
  };

  const handleContinue = () => {
    if (!selected) return;
    dispatch({ type: 'SET_NAME', payload: name.trim() });
    dispatch({ type: 'SET_USER_TYPE', payload: selected });
    navigate('/onboarding/income');
  };

  return (
    <OnboardingShell step={1} totalSteps={6} onBack={() => navigate('/welcome')}>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Name field */}
          <div className="mb-7">
            <label
              htmlFor="name-input"
              className="block text-[11px] font-bold uppercase tracking-[0.08em] text-muted mb-2.5"
            >
              What should we call you?
            </label>
            <input
              id="name-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-4 py-3.5 bg-surface border border-hairline rounded-[var(--radius-card)] text-[15px] text-ink placeholder:text-ghost focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Question */}
          <h2 className="font-bold text-[22px] leading-[1.2] tracking-[-0.02em] text-ink mb-1.5">
            What's your situation?
          </h2>
          <p className="text-[13px] text-muted mb-6 leading-relaxed">
            We adapt your emergency buffer to your employment type.
          </p>

          {/* Situation options — compact list with finance vector icons */}
          <div className="space-y-2.5">
            {USER_TYPES.map(({ id, label, desc, iconName }, i) => {
              const isSelected = selected === id;
              return (
                <motion.button
                  key={id}
                  type="button"
                  onClick={() => handleSelect(id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  className={`option-row w-full text-left flex items-center gap-3.5 ${
                    isSelected ? 'selected' : ''
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="w-9 h-9 rounded-lg bg-surface-subtle border border-hairline flex items-center justify-center shrink-0">
                    <FinanceIcon
                      name={iconName}
                      size={18}
                      className={isSelected ? 'text-accent-dark' : 'text-muted'}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm text-ink block">{label}</span>
                    <span className="text-[12px] text-muted">{desc}</span>
                  </div>
                  {/* Selection indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-accent border-accent'
                        : 'border-hairline'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="sticky bottom-0 py-4 bg-bg mt-6 safe-bottom">
          <Button fullWidth size="lg" disabled={!selected} onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}
