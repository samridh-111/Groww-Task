import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppState, useAvailableAmount } from '../state/AppState';
import { Button } from '../components/ui/Button';
import { AmountStepper } from '../components/ui/NumberInput';
import { DisclaimerStrip } from '../components/ui/DisclaimerStrip';
import { ErrorState } from '../components/ui/ErrorState';
import { CATEGORIES, getCategoryById, formatCurrency } from '../lib/content';
import { computePlan } from '../lib/planEngine';
import type { CategoryId } from '../lib/types';

export default function ReviewInvestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useAppState();
  const availableAmount = useAvailableAmount();

  const loc = (location.state || {}) as {
    categoryId?: CategoryId;
    defaultAmount?: number;
    bucketId?: string;
  };

  const plan = computePlan(state);
  const matchingBucket =
    plan.buckets.find(b => b.id === loc.bucketId) ||
    plan.buckets.find(b => b.categoryId === (loc.categoryId || 'liquid') && b.id !== 'flexible') ||
    plan.buckets.find(b => b.categoryId === (loc.categoryId || 'liquid'));

  const categoryId: CategoryId = loc.categoryId || matchingBucket?.categoryId || 'liquid';
  const category = getCategoryById(categoryId) || CATEGORIES[0];

  const bucketAmount = matchingBucket?.amount || 1000;
  const initialDefaultAmt = loc.defaultAmount || bucketAmount;
  const maxAmount = Math.max(100, availableAmount || 100);

  const [amount, setAmount] = useState(Math.max(100, Math.min(maxAmount, initialDefaultAmt)));
  const [acceptedSimulation, setAcceptedSimulation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorState, setErrorState] = useState(false);

  const goalName = matchingBucket?.label || 'your plan';

  const handleContinue = () => {
    if (!acceptedSimulation) return;
    setIsProcessing(true);
    setErrorState(false);

    setTimeout(() => {
      setIsProcessing(false);
      if (state.demo.failNextConfirm) {
        dispatch({ type: 'TOGGLE_FAIL_NEXT_CONFIRM' });
        setErrorState(true);
      } else {
        navigate('/invest/confirmed', {
          state: {
            categoryId,
            amount,
            bucketId: matchingBucket ? matchingBucket.id : 'default',
            goalLabel: goalName,
          },
        });
      }
    }, 1200);
  };

  if (errorState) {
    return (
      <div className="flex-1 flex flex-col justify-center px-6 min-h-screen bg-bg">
        <ErrorState
          title="Simulation failed to confirm"
          message="Demo simulated error condition triggered. No state was altered."
          onRetry={() => setErrorState(false)}
          retryLabel="Try again"
        />
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-screen text-center bg-bg">
        <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin mb-4" />
        <h2 className="font-heading font-bold text-2xl tracking-tight text-ink mb-1.5">
          Simulating contribution
        </h2>
        <p className="text-xs text-muted max-w-[280px]">
          Confirming order simulation and updating prototype portfolio...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-6 min-h-screen bg-bg">
      <div className="space-y-6">
        {/* Navigation & Header */}
        <header className="flex items-center justify-between border-b border-hairline pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
              Order Preview
            </span>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-ink">
              Review Contribution
            </h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs font-semibold text-muted hover:text-ink px-3 py-1.5 rounded-lg border border-hairline bg-surface transition-colors cursor-pointer"
          >
            Back
          </button>
        </header>

        {/* Target summary */}
        <div className="border border-hairline rounded-xl p-4 bg-surface space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-1">
                Target Allocation
              </span>
              <h2 className="font-heading font-bold text-lg text-ink">{category.name}</h2>
              <span className="text-xs text-muted">Serves: {goalName}</span>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-surface-subtle border border-hairline text-ink">
              Monthly SIP
            </span>
          </div>

          <div className="pt-3 border-t border-hairline">
            <span className="text-xs font-medium text-muted block mb-3">Adjust simulated amount</span>
            <AmountStepper
              value={amount}
              onChange={setAmount}
              min={100}
              max={maxAmount}
              step={500}
              quickChips={[500, 1000, 2500, 5000].filter(a => a <= maxAmount)}
            />
          </div>
        </div>

        {/* Summary breakdown table */}
        <div className="border border-hairline rounded-xl divide-y divide-hairline bg-surface overflow-hidden">
          <div className="flex justify-between p-3 text-xs">
            <span className="text-muted">Available monthly buffer</span>
            <span className="font-mono font-medium text-ink tabular-nums">{formatCurrency(availableAmount)}</span>
          </div>
          <div className="flex justify-between p-3 text-xs">
            <span className="text-muted">Simulated contribution</span>
            <span className="font-mono font-bold text-accent-dark tabular-nums">{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between p-3 text-xs font-semibold bg-surface-subtle">
            <span className="text-ink">Remaining buffer</span>
            <span className="font-mono text-ink tabular-nums">{formatCurrency(Math.max(0, availableAmount - amount))}</span>
          </div>
        </div>

        {/* Simulation consent checkbox */}
        <label className="flex items-start gap-3 p-3.5 rounded-xl border border-hairline bg-surface cursor-pointer select-none">
          <input
            type="checkbox"
            checked={acceptedSimulation}
            onChange={e => setAcceptedSimulation(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded accent-[#00D09C] cursor-pointer"
          />
          <span className="text-xs text-muted leading-relaxed">
            I understand this is a <strong className="text-ink">prototype simulation</strong>. No real payment, bank deduction, or financial order will occur.
          </span>
        </label>

        <DisclaimerStrip />
      </div>

      <div className="pt-6 pb-2 safe-bottom">
        <Button
          fullWidth
          size="lg"
          disabled={!acceptedSimulation || amount <= 0}
          onClick={handleContinue}
        >
          Confirm simulated investment
        </Button>
      </div>
    </div>
  );
}
