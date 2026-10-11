import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../state/AppState';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { CountUp } from '../components/ui/CountUp';
import { BottomNav } from '../components/layout/BottomNav';
import { formatCurrency, getCategoryById } from '../lib/content';
import { computePlan, getNextContributionBucket } from '../lib/planEngine';

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  const { state } = useAppState();
  const navigate = useNavigate();
  const [showHoldings, setShowHoldings] = useState(false);

  const plan = computePlan(state);

  const totalInvested = state.holdings.reduce((s, h) => s + h.invested, 0);
  const totalValue = state.holdings.reduce((s, h) => s + h.value, 0);
  const totalDiff = totalValue - totalInvested;
  const totalDiffPct = totalInvested > 0 ? (totalDiff / totalInvested) * 100 : 0;

  const emergencyBucket = plan.buckets.find(b => b.id === 'emergency');
  const emergencyInvested = state.holdings
    .filter(h => h.bucketId === 'emergency')
    .reduce((s, h) => s + h.invested, 0);
  const emergencyMilestone = emergencyBucket?.milestone || 0;
  const emergencyPct =
    emergencyMilestone > 0 ? Math.min(100, Math.round((emergencyInvested / emergencyMilestone) * 100)) : 100;

  const nextBucket = getNextContributionBucket(plan, state.holdings);

  let nextStepTitle = 'Try a market scenario';
  let nextStepSub = 'See how a ±20% market swing feels';
  let nextStepAction = () => navigate('/scenario');

  if (emergencyBucket && emergencyPct < 100) {
    nextStepTitle = 'Build emergency buffer';
    nextStepSub = `${formatCurrency(emergencyInvested)} of ${formatCurrency(emergencyMilestone)} target`;
    nextStepAction = () =>
      navigate('/invest/review', {
        state: {
          categoryId: emergencyBucket.categoryId,
          defaultAmount: emergencyBucket.amount,
          bucketId: emergencyBucket.id,
        },
      });
  } else if (!state.contributedThisMonth) {
    nextStepTitle = "Make this month's contribution";
    nextStepSub = `Suggested: ${nextBucket?.label || 'Core investment'}`;
    nextStepAction = () =>
      navigate('/invest/review', {
        state: {
          categoryId: nextBucket?.categoryId || 'liquid',
          defaultAmount: nextBucket?.amount,
          bucketId: nextBucket?.id,
        },
      });
  }

  const greeting = getTimeGreeting();
  const displayName = state.name.trim() ? `, ${state.name.trim()}` : '';

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen bg-bg">
      <div className="flex-1 px-6 pt-8 pb-24">
        {/* Top Header */}
        <header className="flex items-start justify-between mb-7">
          <div>
            <p className="section-label mb-1">{greeting}{displayName}</p>
            <h1 className="font-bold text-[20px] tracking-tight text-ink">
              Dashboard
            </h1>
          </div>
          <button
            onClick={() => navigate('/plan')}
            className="text-[12px] font-semibold text-muted hover:text-ink transition-colors cursor-pointer mt-1 border border-hairline px-3 py-1.5 rounded-full"
          >
            View plan
          </button>
        </header>

        {/* Portfolio section */}
        {state.holdings.length === 0 ? (
          /* Empty state — open, no card */
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-7"
          >
            <p className="section-label mb-2">Simulated portfolio</p>
            <p className="font-bold text-[28px] text-ink mb-1 tracking-tight">
              ₹0
            </p>
            <p className="text-[13px] text-muted leading-relaxed mb-4">
              You have {formatCurrency(plan.available)}/mo planned. Start your first simulated contribution to track growth.
            </p>
            <Button
              size="sm"
              onClick={() => navigate('/invest/recommended')}
            >
              See investments for this plan
            </Button>
          </motion.div>
        ) : (
          /* Portfolio with holdings */
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-7"
          >
            <div className="flex items-start justify-between mb-1">
              <p className="section-label">Simulated portfolio value</p>
              <span className="text-[11px] font-semibold text-muted">Month {state.monthIndex + 1}</span>
            </div>
            <div className="font-bold text-[38px] tracking-tight text-ink tabular-nums leading-none mb-2">
              <CountUp value={totalValue} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-[12px] font-bold px-2 py-0.5 rounded-md tabular-nums ${
                  totalDiff >= 0
                    ? 'bg-accent-light text-accent-deeper'
                    : 'bg-caution-light text-caution'
                }`}
              >
                {totalDiff >= 0 ? '+' : ''}
                {formatCurrency(totalDiff)} ({totalDiffPct.toFixed(1)}%)
              </span>
              <span className="text-[12px] text-muted">
                Invested: {formatCurrency(totalInvested)}
              </span>
            </div>

            {/* Holdings accordion */}
            <button
              type="button"
              onClick={() => setShowHoldings(!showHoldings)}
              className="text-[12px] font-semibold text-muted flex items-center gap-1.5 cursor-pointer hover:text-ink transition-colors"
              aria-expanded={showHoldings}
            >
              {showHoldings ? 'Hide' : 'View'} {state.holdings.length} holding{state.holdings.length > 1 ? 's' : ''}
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${showHoldings ? 'rotate-180' : ''}`}
                viewBox="0 0 14 14"
                fill="none"
              >
                <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <AnimatePresence>
              {showHoldings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-3"
                >
                  <div className="bg-surface rounded-[var(--radius-card)] border border-hairline overflow-hidden">
                    {state.holdings.map((h, i) => {
                      const cat = getCategoryById(h.categoryId);
                      const gain = h.value - h.invested;
                      return (
                        <div
                          key={h.id}
                          className={`px-4 py-3 flex justify-between items-center ${
                            i < state.holdings.length - 1 ? 'border-b border-hairline-subtle' : ''
                          }`}
                        >
                          <div>
                            <span className="font-semibold text-[13px] text-ink block">{cat?.name || h.categoryId}</span>
                            <span className="text-[11px] text-muted">{h.bucketId}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[13px] text-ink block tabular-nums">{formatCurrency(h.value)}</span>
                            <span
                              className={`text-[11px] font-semibold tabular-nums ${
                                gain >= 0 ? 'text-accent-dark' : 'text-caution'
                              }`}
                            >
                              {gain >= 0 ? '+' : ''}{formatCurrency(gain)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Next action — clean row, not a card */}
        <div className="border-t border-hairline pt-5 mb-5">
          <p className="section-label mb-2.5">Recommended next step</p>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-[14px] text-ink truncate">{nextStepTitle}</p>
              <p className="text-[12px] text-muted truncate mt-0.5">{nextStepSub}</p>
            </div>
            <Button size="sm" onClick={nextStepAction} className="shrink-0">
              Go
            </Button>
          </div>
        </div>

        {/* Emergency fund progress */}
        {emergencyBucket && (
          <div className="mb-5">
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-[13px] font-semibold text-ink">Emergency Cushion</p>
              <span className="text-[12px] font-bold text-ink tabular-nums">{emergencyPct}%</span>
            </div>
            <ProgressBar value={emergencyPct} color="bg-accent" height={4} />
            <div className="flex justify-between text-[11px] text-muted mt-1.5">
              <span>Saved: {formatCurrency(emergencyInvested)}</span>
              <span>Target: {formatCurrency(emergencyMilestone)}</span>
            </div>
          </div>
        )}

        {/* Quick links — horizontal, not 2-col cards */}
        <div className="border-t border-hairline pt-5">
          <p className="section-label mb-3">Explore</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/scenario')}
              className="flex-1 bg-surface border border-hairline rounded-[var(--radius-card)] p-3.5 text-left hover:border-accent/40 transition-colors cursor-pointer"
            >
              <p className="font-semibold text-[13px] text-ink mb-0.5">Market Simulator</p>
              <p className="text-[11px] text-muted">Test a ±20% move</p>
            </button>
            <button
              onClick={() => navigate('/learn')}
              className="flex-1 bg-surface border border-hairline rounded-[var(--radius-card)] p-3.5 text-left hover:border-accent/40 transition-colors cursor-pointer"
            >
              <p className="font-semibold text-[13px] text-ink mb-0.5">Learn Investing</p>
              <p className="text-[11px] text-muted">Bite-sized modules</p>
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
