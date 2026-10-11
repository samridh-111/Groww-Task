import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingShell } from '../../components/layout/OnboardingShell';
import { Button } from '../../components/ui/Button';
import { FinanceIcon } from '../../components/ui/FinanceIcon';
import { useAppState } from '../../state/AppState';
import { GOAL_INFO } from '../../lib/content';
import type { GoalId, GoalTimeline } from '../../lib/types';

const TIMELINE_OPTIONS: { id: GoalTimeline; label: string; sub: string }[] = [
  { id: '<1', label: '< 1 yr', sub: 'Short term' },
  { id: '1-3', label: '1–3 yrs', sub: 'Medium' },
  { id: '3-5', label: '3–5 yrs', sub: 'Growth' },
  { id: '5+', label: '5+ yrs', sub: 'Long term' },
];

export default function TimelinePage() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();

  const goalsNeedingTimeline = state.goals.filter(g => g !== 'emergency');

  const [timelines, setTimelines] = useState<Record<GoalId, GoalTimeline>>(() => {
    const defaults: Record<string, GoalTimeline> = {};
    for (const g of goalsNeedingTimeline) {
      defaults[g] = state.goalTimelines[g] || (g === 'wealth' || g === 'starting' ? '5+' : '1-3');
    }
    return defaults as Record<GoalId, GoalTimeline>;
  });

  const allSet = goalsNeedingTimeline.every(g => timelines[g]);

  const handleContinue = () => {
    for (const goalId of goalsNeedingTimeline) {
      dispatch({
        type: 'SET_GOAL_TIMELINE',
        payload: { goalId: goalId as GoalId, timeline: timelines[goalId as GoalId] },
      });
    }
    navigate('/onboarding/risk');
  };

  return (
    <OnboardingShell step={5} totalSteps={6}>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="font-bold text-[22px] leading-[1.2] tracking-[-0.02em] text-ink mb-1.5">
            When might you need this money?
          </h2>
          <p className="text-[13px] text-muted mb-7 leading-relaxed">
            Short-term goals use safer funds. Longer timelines can leverage equity growth.
          </p>

          <div className="space-y-5">
            {goalsNeedingTimeline.map(goalId => {
              const info = GOAL_INFO[goalId];
              return (
                <div key={goalId}>
                  {/* Goal label */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-6 h-6 rounded-md bg-surface-subtle border border-hairline flex items-center justify-center shrink-0">
                      <FinanceIcon
                        name={goalId as any}
                        size={14}
                        className="text-muted"
                      />
                    </div>
                    <span className="font-semibold text-[14px] text-ink">
                      {info?.label || goalId}
                    </span>
                  </div>
                  {/* Timeline selector */}
                  <div className="grid grid-cols-4 gap-2">
                    {TIMELINE_OPTIONS.map(({ id, label, sub }) => {
                      const isSelected = timelines[goalId as GoalId] === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() =>
                            setTimelines(prev => ({ ...prev, [goalId]: id }))
                          }
                          className={`flex flex-col items-center justify-center py-3 px-1.5 rounded-xl transition-all cursor-pointer select-none text-center border ${
                            isSelected
                              ? 'bg-accent-light border-accent text-accent-dark'
                              : 'bg-surface border-hairline text-ink-secondary hover:border-accent/30'
                          }`}
                        >
                          <span className="text-[12px] font-bold leading-tight">{label}</span>
                          <span className="text-[10px] text-muted leading-tight mt-0.5">{sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="sticky bottom-0 py-4 bg-bg mt-6 safe-bottom">
          <Button fullWidth size="lg" disabled={!allSet} onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}
