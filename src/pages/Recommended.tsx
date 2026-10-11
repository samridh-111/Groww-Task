import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppState } from '../state/AppState';
import { Button } from '../components/ui/Button';
import { RiskMeter } from '../components/ui/RiskMeter';
import { DisclaimerStrip } from '../components/ui/DisclaimerStrip';
import { BottomNav } from '../components/layout/BottomNav';
import { CATEGORIES, getCategoryById, formatCurrency } from '../lib/content';
import { computePlan, whyCategoryFits } from '../lib/planEngine';
import type { CategoryId, PlanBucket } from '../lib/types';

export default function RecommendedPage() {
  const { state } = useAppState();
  const navigate = useNavigate();
  const plan = computePlan(state);

  const recs: { categoryId: CategoryId; bucket: PlanBucket; bullets: string[] }[] = [];
  const added = new Set<CategoryId>();

  const ordered = [...plan.buckets].sort((a, b) => {
    if (state.emergencyBuffer !== 'solid') {
      if (a.id === 'emergency') return -1;
      if (b.id === 'emergency') return 1;
    }
    return 0;
  });

  for (const bucket of ordered) {
    if (bucket.id === 'flexible') continue;
    if (recs.length >= 4) break;
    if (added.has(bucket.categoryId)) continue;
    added.add(bucket.categoryId);
    recs.push({
      categoryId: bucket.categoryId,
      bucket,
      bullets: whyCategoryFits(state, bucket.categoryId, bucket),
    });
  }

  if (recs.length === 0) {
    const liquid = plan.buckets.find(b => b.categoryId === 'liquid') || plan.buckets[0];
    if (liquid) {
      recs.push({
        categoryId: liquid.categoryId,
        bucket: liquid,
        bullets: whyCategoryFits(state, liquid.categoryId, liquid),
      });
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen bg-bg">
      <div className="flex-1 px-6 pt-6 pb-24 flex flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 mb-7">
          <button
            onClick={() => navigate('/plan')}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-hairline hover:bg-surface-subtle transition-colors cursor-pointer"
            aria-label="Back to plan"
          >
            <svg className="w-4 h-4 text-ink" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <h1 className="font-bold text-[18px] tracking-tight text-ink">Built for your plan</h1>
            <p className="text-[12px] text-muted">Curated to match your timeline and risk profile</p>
          </div>
        </header>

        {/* Recommendation cards */}
        <div className="space-y-5 mb-6">
          {recs.map((rec, index) => {
            const catInfo = getCategoryById(rec.categoryId) || CATEGORIES[0];
            return (
              <motion.div
                key={rec.categoryId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07, duration: 0.25 }}
                className="border border-hairline bg-surface rounded-[var(--radius-card)] overflow-hidden"
              >
                {/* Top section — allocation header */}
                <div className="px-4 pt-4 pb-3 border-b border-hairline-subtle">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-accent-deeper bg-accent-light px-1.5 py-0.5 rounded">
                        #{index + 1}
                      </span>
                      <h2 className="font-bold text-[17px] text-ink mt-1.5">{catInfo.name}</h2>
                      <p className="text-[12px] text-muted mt-0.5">Serves: {rec.bucket.label}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-muted">Monthly allocation</p>
                      <p className="font-bold text-[18px] text-ink tabular-nums">{formatCurrency(rec.bucket.amount)}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <RiskMeter dots={catInfo.riskDots} label={catInfo.riskLabel} />
                  </div>
                </div>

                {/* Why it fits — clean list */}
                <div className="px-4 py-3">
                  <p className="section-label mb-2">Why it fits</p>
                  <ul className="space-y-1.5">
                    {rec.bullets.map(b => (
                      <li key={b} className="text-[12px] text-ink-secondary flex items-start gap-2 leading-snug">
                        <span className="text-accent font-bold mt-0.5 shrink-0">—</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="px-4 pb-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/explore/${rec.categoryId}`)}
                    className="flex-1 text-[12px]"
                  >
                    Learn more
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate('/invest/review', {
                        state: {
                          categoryId: rec.categoryId,
                          defaultAmount: rec.bucket.amount,
                          bucketId: rec.bucket.id,
                        },
                      })
                    }
                    className="flex-1 text-[12px]"
                  >
                    Start contribution
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <DisclaimerStrip className="mb-4" />
      </div>
      <BottomNav />
    </div>
  );
}
