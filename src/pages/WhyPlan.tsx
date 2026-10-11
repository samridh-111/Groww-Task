import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../state/AppState';
import { Button } from '../components/ui/Button';
import { DisclaimerStrip } from '../components/ui/DisclaimerStrip';
import { BottomNav } from '../components/layout/BottomNav';
import { computePlan } from '../lib/planEngine';
import { formatCurrency } from '../lib/content';

export default function WhyPlanPage() {
  const { state } = useAppState();
  const navigate = useNavigate();
  const [showMath, setShowMath] = useState(false);

  const plan = computePlan(state);
  const irregular = state.incomeMode === 'irregular' || state.userType === 'freelancer';

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen bg-bg">
      <div className="flex-1 px-6 pt-6 pb-24 flex flex-col">
        {/* Back header — minimal */}
        <header className="flex items-center gap-3 mb-7">
          <button
            onClick={() => navigate('/plan')}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-hairline hover:bg-surface-subtle transition-colors cursor-pointer text-ink"
            aria-label="Back to plan"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <h1 className="font-bold text-[18px] tracking-tight text-ink">Why this plan?</h1>
            <p className="text-[12px] text-muted">Transparent financial logic</p>
          </div>
        </header>

        {/* Reason list — editorial typography, no cards */}
        <ol className="space-y-5 mb-7">
          {plan.reasons.map((reason, idx) => (
            <motion.li
              key={reason.headline}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="flex items-start gap-4"
            >
              <span className="font-bold text-[11px] text-ghost tabular-nums pt-0.5 w-5 shrink-0">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div>
                <h2 className="font-semibold text-[14px] text-ink mb-1 leading-snug">
                  {reason.headline}
                </h2>
                <p className="text-[13px] text-ink-secondary leading-relaxed">
                  {reason.explanation}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>

        <div className="border-t border-hairline mb-7" />

        {/* Math breakdown — expandable */}
        <div className="mb-7">
          <button
            type="button"
            onClick={() => setShowMath(!showMath)}
            className="flex items-center justify-between w-full cursor-pointer"
            aria-expanded={showMath}
          >
            <span className="font-semibold text-[14px] text-ink">Show the exact math</span>
            <svg
              className={`w-4 h-4 text-muted transition-transform duration-200 ${showMath ? 'rotate-180' : ''}`}
              viewBox="0 0 16 16"
              fill="none"
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <AnimatePresence>
            {showMath && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-2 text-[13px]">
                  <div className="data-row">
                    <span className="text-muted">Monthly Income</span>
                    <span className="font-semibold text-ink tabular-nums">{formatCurrency(state.monthlyIncome)}</span>
                  </div>
                  <div className="data-row">
                    <span className="text-muted">Monthly Expenses</span>
                    <span className="font-semibold text-ink tabular-nums">− {formatCurrency(state.monthlyExpenses)}</span>
                  </div>
                  <div className="data-row">
                    <span className="font-semibold text-ink">Available for Plan</span>
                    <span className="font-bold text-accent-darker tabular-nums">{formatCurrency(plan.available)}</span>
                  </div>

                  <div className="pt-3 space-y-1.5">
                    <p className="text-[12px] text-ink-secondary leading-relaxed">
                      <strong className="text-ink">Flexible cushion:</strong> {irregular ? '20%' : '10%'} ({formatCurrency(plan.flexible)}) ensures you stay resilient during uncertain months.
                    </p>
                    {state.emergencyBuffer !== 'solid' && (
                      <p className="text-[12px] text-ink-secondary leading-relaxed">
                        <strong className="text-ink">Emergency priority:</strong> {state.emergencyBuffer === 'none' ? (irregular ? '45%' : '40%') : '20%'} guided toward safe liquid savings until {formatCurrency(plan.emergencyTarget)} is accumulated.
                      </p>
                    )}
                    <p className="text-[12px] text-ink-secondary leading-relaxed">
                      <strong className="text-ink">Goal matching:</strong> Remaining surplus distributed across your target goals using time-horizon suited mutual funds.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DisclaimerStrip className="mb-5" />

        <div className="mt-auto safe-bottom">
          <Button fullWidth size="lg" onClick={() => navigate('/invest/recommended')}>
            See recommended investments
          </Button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
