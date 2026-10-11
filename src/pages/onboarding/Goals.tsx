import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { OnboardingShell } from '../../components/layout/OnboardingShell';
import { Button } from '../../components/ui/Button';
import { FinanceIcon } from '../../components/ui/FinanceIcon';
import { useAppState } from '../../state/AppState';
import type { GoalId } from '../../lib/types';

const GOALS: {
  id: GoalId;
  label: string;
  iconName: 'emergency' | 'travel' | 'education' | 'car' | 'wealth' | 'starting';
  description: string;
}[] = [
  {
    id: 'emergency',
    label: 'Emergency cushion',
    iconName: 'emergency',
    description: '3–6 months of expenses, always liquid',
  },
  {
    id: 'travel',
    label: 'Travel & lifestyle',
    iconName: 'travel',
    description: 'Trips, gadgets, experiences',
  },
  {
    id: 'education',
    label: 'Higher education',
    iconName: 'education',
    description: 'Masters, certifications, courses',
  },
  {
    id: 'car',
    label: 'First vehicle',
    iconName: 'car',
    description: 'Car or two-wheeler down payment',
  },
  {
    id: 'wealth',
    label: 'Long-term wealth',
    iconName: 'wealth',
    description: 'Compounding over 5+ years',
  },
  {
    id: 'starting',
    label: 'Just getting started',
    iconName: 'starting',
    description: 'Build the investing habit first',
  },
];

export default function GoalsPage() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<GoalId[]>(state.goals.length > 0 ? state.goals : []);

  const toggleGoal = (goalId: GoalId) => {
    setSelected(prev =>
      prev.includes(goalId) ? prev.filter(g => g !== goalId) : [...prev, goalId]
    );
  };

  const handleContinue = () => {
    dispatch({ type: 'SET_GOALS', payload: selected });

    if (selected.includes('wealth')) {
      dispatch({ type: 'SET_GOAL_TIMELINE', payload: { goalId: 'wealth', timeline: '5+' } });
    }
    if (selected.includes('starting')) {
      dispatch({ type: 'SET_GOAL_TIMELINE', payload: { goalId: 'starting', timeline: '5+' } });
    }

    const needsTimeline = selected.filter(g => g !== 'emergency');
    if (needsTimeline.length === 0) {
      navigate('/onboarding/risk');
    } else {
      navigate('/onboarding/timeline');
    }
  };

  return (
    <OnboardingShell step={4} totalSteps={6}>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="font-bold text-[22px] leading-[1.2] tracking-[-0.02em] text-ink mb-1.5">
            What are you investing for?
          </h2>
          <p className="text-[13px] text-muted mb-6 leading-relaxed">
            Choose as many as you like. We'll balance contributions across them.
          </p>

          <div className="space-y-2">
            {GOALS.map(({ id, label, iconName, description }, i) => {
              const isSelected = selected.includes(id);
              return (
                <motion.button
                  key={id}
                  type="button"
                  onClick={() => toggleGoal(id)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
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
                    <span className="font-semibold text-[14px] text-ink block">{label}</span>
                    <span className="text-[12px] text-muted">{description}</span>
                  </div>
                  {/* Checkbox indicator */}
                  <div
                    className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all ${
                      isSelected ? 'bg-accent border-accent' : 'border-hairline'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="sticky bottom-0 py-4 bg-bg mt-6 safe-bottom">
          <Button fullWidth size="lg" disabled={selected.length === 0} onClick={handleContinue}>
            Continue
            {selected.length > 0 && (
              <span className="ml-2 text-white/70 font-normal text-[13px]">
                {selected.length} selected
              </span>
            )}
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}
