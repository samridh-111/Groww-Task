import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppState } from '../../state/AppState';

const STEPS = [
  'Analyzing cash flows & buffers',
  'Matching timelines with asset classes',
  'Balancing risk comfort vs. growth',
  'Generating personalized monthly plan',
];

export default function CalculatingPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const timers = STEPS.map((_, index) => {
      return setTimeout(() => {
        setCompletedSteps(prev => [...prev, index]);
      }, (index + 1) * 550);
    });

    const finalTimer = setTimeout(() => {
      dispatch({ type: 'SET_ONBOARDING_COMPLETE', payload: true });
      navigate('/plan', { replace: true });
    }, STEPS.length * 550 + 350);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finalTimer);
    };
  }, [navigate, dispatch, state.plan?.status]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-screen bg-bg">
      <div className="w-full max-w-[340px] space-y-8 text-center">
        {/* Brand Emblem */}
        <div className="relative inline-flex items-center justify-center">
          <motion.div
            className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center">
              <span className="text-white text-base font-extrabold leading-none">G</span>
            </div>
          </motion.div>
        </div>

        <div>
          <h2 className="font-heading font-bold text-2xl tracking-tight text-ink">
            Calculating your plan
          </h2>
          <p className="text-xs text-muted mt-1">
            Applying transparent financial rules tailored for you
          </p>
        </div>

        {/* Step checklist */}
        <div className="space-y-3 text-left border border-hairline rounded-xl p-4 bg-surface">
          {STEPS.map((stepText, index) => {
            const isDone = completedSteps.includes(index);
            const isCurrent =
              !isDone && (index === 0 || completedSteps.includes(index - 1));

            return (
              <div key={stepText} className="flex items-center justify-between text-xs">
                <span
                  className={`transition-colors ${
                    isDone
                      ? 'font-medium text-ink'
                      : isCurrent
                      ? 'font-semibold text-accent-dark'
                      : 'text-muted'
                  }`}
                >
                  {stepText}
                </span>
                <span className="text-[10px] font-mono font-bold">
                  {isDone ? (
                    <span className="text-accent-dark">DONE</span>
                  ) : isCurrent ? (
                    <span className="text-accent">...</span>
                  ) : (
                    <span className="text-muted/60">0{index + 1}</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
