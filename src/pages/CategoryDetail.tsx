import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppState } from '../state/AppState';
import { Button } from '../components/ui/Button';
import { RiskMeter } from '../components/ui/RiskMeter';
import { DisclaimerStrip } from '../components/ui/DisclaimerStrip';
import { getCategoryById } from '../lib/content';
import { computePlan } from '../lib/planEngine';

export default function CategoryDetailPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { state } = useAppState();

  const category = getCategoryById(categoryId || '');

  if (!category) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen text-center bg-bg">
        <h2 className="font-heading font-bold text-xl mb-4 text-ink">Category not found</h2>
        <Button onClick={() => navigate('/explore')}>Back to Explore</Button>
      </div>
    );
  }

  const plan = computePlan(state);
  const matchingBucket = plan.buckets.find(b => b.categoryId === category.id);
  const defaultAmount = matchingBucket ? matchingBucket.amount : 1000;

  const handleInvest = () => {
    const payload = { categoryId: category.id, defaultAmount, bucketId: matchingBucket?.id };
    if (state.experience === 'first-time' && !state.lessonsCompleted.includes('market-fall')) {
      navigate('/learn/before-you-invest', {
        state: { targetCategory: category.id, defaultAmount, bucketId: matchingBucket?.id },
      });
    } else {
      navigate('/invest/review', { state: payload });
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-6 min-h-screen bg-bg">
      <div className="space-y-6">
        {/* Navigation & Header */}
        <header className="flex items-center justify-between border-b border-hairline pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
              Asset Class Analysis
            </span>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-ink">
              {category.name}
            </h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs font-semibold text-muted hover:text-ink px-3 py-1.5 rounded-lg border border-hairline bg-surface transition-colors cursor-pointer"
          >
            Back
          </button>
        </header>

        {/* Overview & Fit */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
              Overview
            </h2>
            <p className="text-sm text-ink leading-relaxed">
              {category.whatIs}
            </p>
          </div>

          <div className="border-t border-hairline pt-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
              Why it fits this portfolio
            </h2>
            <p className="text-sm text-ink leading-relaxed">
              {category.fitsWhen}
            </p>
          </div>
        </div>

        {/* Risk & Volatility Section */}
        <div className="border border-hairline rounded-xl p-4 bg-surface space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-ink">Risk Profile</h2>
            <RiskMeter dots={category.riskDots} label={category.riskLabel} />
          </div>
          <p className="text-xs text-muted leading-relaxed">{category.howRisky}</p>

          <div className="pt-2 border-t border-hairline space-y-1.5">
            <div className="flex justify-between items-baseline text-xs">
              <span className="text-muted">Historical worst drop:</span>
              <span className="font-mono font-bold text-caution tabular-nums">{category.illustrativeFall}</span>
            </div>
            <div className="w-full bg-hairline h-1.5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-caution rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${category.riskDots * 24}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <p className="text-[10px] text-muted font-medium">Illustrative reference · past movements do not predict future returns</p>
          </div>
        </div>

        {/* Time Horizon & Suitability */}
        <div className="border-t border-hairline pt-4 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-1">
            Recommended Horizon
          </h2>
          <p className="text-xs text-ink leading-relaxed">{category.howLong}</p>
          <div className="inline-block px-2.5 py-1 rounded-md bg-surface border border-hairline text-xs font-medium text-ink">
            Best suited for: {category.bestFor}
          </div>
        </div>

        {/* Downside Considerations */}
        <div className="p-3.5 rounded-xl border border-hairline bg-surface-subtle space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-caution block">
            Downside Considerations
          </span>
          <p className="text-xs text-ink leading-relaxed">{category.whatCouldGoWrong}</p>
        </div>

        <DisclaimerStrip />
      </div>

      <div className="pt-6 pb-2 safe-bottom">
        <Button fullWidth size="lg" onClick={handleInvest}>
          Start simulated investment
        </Button>
      </div>
    </div>
  );
}
