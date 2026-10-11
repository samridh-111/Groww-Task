import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppState } from '../state/AppState';
import { Button } from '../components/ui/Button';
import { DisclaimerStrip } from '../components/ui/DisclaimerStrip';
import { formatCurrency } from '../lib/content';
import { generateHoldingId } from '../lib/simulation';
import type { CategoryId } from '../lib/types';

export default function ConfirmedInvestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useAppState();

  const loc = (location.state || {}) as {
    categoryId?: CategoryId;
    amount?: number;
    bucketId?: string;
    goalLabel?: string;
  };

  const categoryId: CategoryId = loc.categoryId || 'liquid';
  const amount = loc.amount || 1000;
  const bucketId = loc.bucketId || 'default';
  const goalLabel = loc.goalLabel || 'your goal';
  const wasFirst = state.holdings.length === 0;

  const hasAdded = useRef(false);

  useEffect(() => {
    if (!hasAdded.current) {
      hasAdded.current = true;
      const key = `holding:${categoryId}:${amount}:${bucketId}:${state.monthIndex}:${state.holdings.length}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
      dispatch({
        type: 'ADD_HOLDING',
        payload: {
          id: generateHoldingId(),
          categoryId,
          bucketId,
          invested: amount,
          value: amount,
          createdMonth: state.monthIndex,
        },
      });
      dispatch({ type: 'SET_ONBOARDING_COMPLETE', payload: true });
      dispatch({ type: 'SET_CONTRIBUTED_THIS_MONTH', payload: true });
    }
  }, [categoryId, amount, bucketId, state.monthIndex, dispatch]);

  return (
    <div className="flex-1 flex flex-col justify-between px-6 pt-12 pb-6 min-h-screen bg-bg">
      <div className="space-y-6">
        {/* Success Header */}
        <div className="text-center pt-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="inline-block text-[11px] font-bold uppercase tracking-wider text-accent-dark px-3 py-1 rounded-md bg-accent-light mb-3"
          >
            Simulated Order Placed
          </motion.div>

          <p className="font-heading font-extrabold text-4xl text-ink tabular-nums my-1">
            {formatCurrency(amount)}
          </p>

          <p className="text-xs text-muted mt-2">
            {wasFirst
              ? `Your very first step toward ${goalLabel}.`
              : `Allocated toward ${goalLabel}.`}
          </p>
        </div>

        {/* Prototype explanation */}
        <div className="border border-hairline rounded-xl p-4 bg-surface space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
            What happens next in this prototype
          </span>
          <div className="divide-y divide-hairline text-xs text-muted">
            <div className="py-2 flex items-start justify-between gap-4">
              <span>Simulated portfolio</span>
              <span className="text-ink font-medium text-right">Holding visible on dashboard</span>
            </div>
            <div className="py-2 flex items-start justify-between gap-4">
              <span>Time progression</span>
              <span className="text-ink font-medium text-right">Advance months in Demo Controls</span>
            </div>
            <div className="py-2 flex items-start justify-between gap-4">
              <span>Market testing</span>
              <span className="text-ink font-medium text-right">Simulate ±20% market swings</span>
            </div>
          </div>
        </div>

        <DisclaimerStrip />
      </div>

      <div className="pt-6 pb-2 space-y-2 safe-bottom">
        <Button fullWidth size="lg" onClick={() => navigate('/home')}>
          Go to Dashboard
        </Button>
        <Button
          fullWidth
          size="md"
          variant="secondary"
          onClick={() => navigate('/scenario')}
        >
          Try market scenario
        </Button>
      </div>
    </div>
  );
}
