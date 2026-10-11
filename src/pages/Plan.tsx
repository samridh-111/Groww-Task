import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppState, useAvailableAmount } from '../state/AppState';
import { Button } from '../components/ui/Button';
import { DisclaimerStrip } from '../components/ui/DisclaimerStrip';
import { CountUp } from '../components/ui/CountUp';
import { SkeletonCard } from '../components/ui/Skeleton';
import { BottomNav } from '../components/layout/BottomNav';
import { getCategoryById, formatCurrency } from '../lib/content';
import { computePlan } from '../lib/planEngine';

const BUCKET_COLORS: Record<string, string> = {
  liquid: '#3B82F6',
  'short-debt': '#F59E0B',
  hybrid: '#8B5CF6',
  index: '#00D09C',
  equity: '#10B981',
  flexible: '#94A3B8',
};

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function PlanPage() {
  const { state } = useAppState();
  const navigate = useNavigate();
  const availableAmount = useAvailableAmount();
  const [ready, setReady] = useState(false);

  const plan = computePlan(state);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, []);

  if (!ready) {
    return (
      <div className="flex-1 px-6 py-10 space-y-4 min-h-screen bg-bg" aria-busy="true">
        <div className="h-6 w-32 bg-hairline rounded skeleton mb-6" />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (plan.status === 'not-yet' || availableAmount < 500) {
    return (
      <div className="flex-1 flex flex-col justify-between min-h-screen bg-bg">
        <div className="flex-1 flex flex-col px-6 py-10">
          <div className="flex-1 flex flex-col justify-center">
            <p className="section-label mb-3">Monthly money plan</p>
            <h1 className="font-bold text-[26px] leading-[1.2] tracking-tight mb-4 text-ink">
              Not yet — and that's completely okay.
            </h1>
            <p className="text-ink-secondary text-[14px] leading-[1.65] max-w-[320px] mb-6">
              Right now your expenses take up most of your income. Investing under tight margins causes stress. Focus on learning first — your plan is ready when there's room.
            </p>
            {/* Numbers inline, no card */}
            <div className="space-y-2 mb-8">
              <div className="data-row">
                <span className="text-[13px] text-muted">Monthly Income</span>
                <span className="font-semibold text-[13px] text-ink tabular-nums">{formatCurrency(state.monthlyIncome)}</span>
              </div>
              <div className="data-row">
                <span className="text-[13px] text-muted">Monthly Expenses</span>
                <span className="font-semibold text-[13px] text-ink tabular-nums">{formatCurrency(state.monthlyExpenses)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 safe-bottom">
            <Button fullWidth size="lg" onClick={() => navigate('/learn')}>
              Start learning
            </Button>
            <Button fullWidth size="lg" variant="secondary" onClick={() => navigate('/onboarding/income')}>
              Edit my numbers
            </Button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const greeting = getTimeGreeting();
  const displayName = state.name.trim() ? `, ${state.name.trim()}` : '';

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen bg-bg">
      <div className="flex-1 px-6 pt-8 pb-24 flex flex-col">
        {/* Header — compact, no big title */}
        <motion.header
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-8 flex items-start justify-between"
        >
          <div>
            <p className="section-label mb-1">{greeting}{displayName}</p>
            <h1 className="font-bold text-[20px] tracking-tight text-ink leading-tight">
              Monthly money plan
            </h1>
          </div>
          <button
            onClick={() => navigate('/plan/why')}
            className="text-[12px] font-semibold text-muted hover:text-ink transition-colors cursor-pointer mt-1"
            aria-label="Why this plan?"
          >
            Why this?
          </button>
        </motion.header>

        {/* Hero amount — open, editorial */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-7"
        >
          <p className="section-label mb-2">Available to allocate monthly</p>
          <div className="amount-hero tabular-nums mb-1">
            <CountUp value={plan.available} />
          </div>
          <p className="text-[13px] text-muted">
            After {formatCurrency(state.monthlyExpenses)} in monthly essentials
          </p>
        </motion.div>

        {/* Allocation bar — full width visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-7"
        >
          <div className="h-2 w-full rounded-full overflow-hidden flex gap-0.5 mb-3">
            {plan.buckets.map(bucket => {
              const pct = plan.available > 0 ? (bucket.amount / plan.available) * 100 : 0;
              const color = BUCKET_COLORS[bucket.categoryId] || '#00D09C';
              return (
                <motion.div
                  key={bucket.id}
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                />
              );
            })}
          </div>
          {/* Legend — inline horizontal dots */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {plan.buckets.map(b => (
              <div key={b.id} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: BUCKET_COLORS[b.categoryId] || '#00D09C' }}
                />
                <span className="text-[11px] font-medium text-muted">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Breakdown — tabular list, not individual cards */}
        <section aria-label="Monthly breakdown">
          <p className="section-label mb-3">Where your money goes</p>
          <div className="bg-surface rounded-[var(--radius-card)] border border-hairline overflow-hidden mb-6">
            {plan.buckets.map((bucket, index) => {
              const pct = plan.available > 0 ? Math.round((bucket.amount / plan.available) * 100) : 0;
              const color = BUCKET_COLORS[bucket.categoryId] || '#00D09C';
              const cat = getCategoryById(bucket.categoryId);

              return (
                <motion.div
                  key={bucket.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 + index * 0.04 }}
                  className={`px-4 py-3.5 flex items-center justify-between gap-3 ${
                    index < plan.buckets.length - 1 ? 'border-b border-hairline-subtle' : ''
                  }`}
                >
                  {/* Color dot + label */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-[13px] text-ink truncate">{bucket.label}</p>
                      {cat && (
                        <p className="text-[11px] text-muted truncate">{cat.name}</p>
                      )}
                    </div>
                  </div>
                  {/* Amount + pct */}
                  <div className="text-right shrink-0">
                    <p className="font-bold text-[14px] text-ink tabular-nums">
                      <CountUp value={bucket.amount} duration={400} />
                    </p>
                    <p className="text-[11px] text-muted">{pct}%</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <DisclaimerStrip className="mb-6" />

        {/* CTAs */}
        <motion.div
          className="mt-auto space-y-2.5 safe-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.2 }}
        >
          <Button
            fullWidth
            size="lg"
            onClick={() => navigate('/invest/recommended')}
          >
            See investments for this plan
            <svg className="ml-2 w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
          <Button
            fullWidth
            size="md"
            variant="secondary"
            onClick={() => navigate('/plan/why')}
          >
            Understand the math
          </Button>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
