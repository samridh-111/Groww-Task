import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../state/AppState';
import { DisclaimerStrip } from '../components/ui/DisclaimerStrip';
import { BottomNav } from '../components/layout/BottomNav';
import { formatCurrency, getScenarioHorizonText, getScenarioActionResponse, getCategoryById } from '../lib/content';
import { computeScenario } from '../lib/simulation';
import { computePlan } from '../lib/planEngine';
import type { Holding } from '../lib/types';

export default function ScenarioPage() {
  const navigate = useNavigate();
  const { state } = useAppState();

  const [isFall, setIsFall] = useState(true);
  const [changePct, setChangePct] = useState(20);
  const [horizon, setHorizon] = useState<'6m' | '2y' | '7y'>('2y');
  const [userChoice, setUserChoice] = useState<'sell' | 'wait' | 'add' | null>(null);

  const plan = computePlan(state);
  const fallback: Holding[] =
    plan.buckets.length > 0
      ? plan.buckets
          .filter(b => b.id !== 'flexible')
          .slice(0, 3)
          .map((b, i) => ({
            id: `sim_${i}`,
            categoryId: b.categoryId,
            bucketId: b.id,
            invested: b.amount,
            value: b.amount,
            createdMonth: 0,
          }))
      : [
          { id: 'sim_1', categoryId: 'liquid', bucketId: 'b1', invested: 4000, value: 4000, createdMonth: 0 },
        ];

  const holdingsToUse: Holding[] = state.holdings.length > 0 ? state.holdings : fallback;
  const totalBefore = holdingsToUse.reduce((s, h) => s + h.value, 0);
  const scenarioResults = computeScenario(holdingsToUse, changePct, isFall);
  const totalAfter = scenarioResults.reduce((s, r) => s + r.after, 0);
  const diff = totalAfter - totalBefore;

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen bg-bg">
      <div className="flex-1 px-6 pt-6 pb-28 space-y-6">
        {/* Navigation & Header */}
        <header className="flex items-center justify-between border-b border-hairline pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
              Simulation Lab
            </span>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-ink">
              Market Scenario
            </h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs font-semibold text-muted hover:text-ink px-3 py-1.5 rounded-lg border border-hairline bg-surface transition-colors cursor-pointer"
          >
            Back
          </button>
        </header>

        {/* Fall vs. Rally Mode Selector */}
        <div className="grid grid-cols-2 p-1 bg-surface-subtle border border-hairline rounded-xl">
          <button
            type="button"
            onClick={() => {
              setIsFall(true);
              setUserChoice(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              isFall
                ? 'bg-caution text-white shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            Market Dip (−{changePct}%)
          </button>
          <button
            type="button"
            onClick={() => {
              setIsFall(false);
              setUserChoice(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              !isFall
                ? 'bg-accent text-white shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            Market Rally (+{changePct}%)
          </button>
        </div>

        {/* Magnitude Slider */}
        <div className="space-y-2 py-2 border-b border-hairline">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-medium text-muted">Simulated Magnitude</span>
            <span className={`font-mono text-sm font-bold ${isFall ? 'text-caution' : 'text-accent-dark'}`}>
              {isFall ? '−' : '+'}{changePct}%
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            step={5}
            value={changePct}
            onChange={e => {
              setChangePct(Number(e.target.value));
              setUserChoice(null);
            }}
            className={`w-full h-1.5 rounded-full cursor-pointer bg-hairline ${
              isFall ? 'accent-[#EB5757]' : 'accent-[#00D09C]'
            }`}
          />
          <div className="flex justify-between text-[10px] text-muted font-medium">
            <span>5% (Mild)</span>
            <span>20% (Typical)</span>
            <span>50% (Severe)</span>
          </div>
        </div>

        {/* Portfolio Impact Summary */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
            Impact Projection
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-hairline bg-surface">
              <span className="text-[11px] text-muted block mb-0.5">Current Value</span>
              <span className="font-heading font-bold text-lg text-ink tabular-nums">
                {formatCurrency(totalBefore)}
              </span>
            </div>
            <div className="p-3.5 rounded-xl border border-hairline bg-surface">
              <span className="text-[11px] text-muted block mb-0.5">Projected Value</span>
              <span className={`font-heading font-bold text-lg tabular-nums ${isFall ? 'text-caution' : 'text-accent-dark'}`}>
                {formatCurrency(totalAfter)}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs px-1 py-1 font-semibold text-muted">
            <span>Net Change</span>
            <span className={`font-mono font-bold ${diff >= 0 ? 'text-accent-dark' : 'text-caution'}`}>
              {diff >= 0 ? '+' : ''}{formatCurrency(diff)} ({isFall ? '−' : '+'}{changePct}%)
            </span>
          </div>
        </div>

        {/* Breakdown by Category List */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
            Holdings Distribution
          </span>
          <div className="border border-hairline rounded-xl divide-y divide-hairline bg-surface overflow-hidden">
            {scenarioResults.map((r, i) => {
              const cat = getCategoryById(r.categoryId);
              return (
                <div key={i} className="flex justify-between items-center p-3 text-xs">
                  <span className="font-medium text-ink">{cat?.name || r.categoryId}</span>
                  <span className="font-mono text-muted tabular-nums">
                    {formatCurrency(r.before)} → <strong className="text-ink">{formatCurrency(r.after)}</strong>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Horizon selector */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-ink block">
            How time horizon changes perspective:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '6m', label: '6 Months' },
              { id: '2y', label: '2 Years' },
              { id: '7y', label: '7+ Years' },
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setHorizon(opt.id as '6m' | '2y' | '7y')}
                className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  horizon === opt.id
                    ? 'bg-ink text-white'
                    : 'bg-surface border border-hairline text-muted hover:text-ink'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted leading-relaxed">
            {getScenarioHorizonText(horizon, isFall)}
          </p>
        </div>

        {/* Action Reflection Prompt */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold text-ink block">
            If this happened right now, what would you do?
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'sell', label: 'Sell & stop' },
              { id: 'wait', label: 'Wait & hold' },
              { id: 'add', label: 'Invest more' },
            ].map(choice => (
              <button
                key={choice.id}
                type="button"
                onClick={() => setUserChoice(choice.id as 'sell' | 'wait' | 'add')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all text-center cursor-pointer ${
                  userChoice === choice.id
                    ? 'bg-ink text-white'
                    : 'bg-surface border border-hairline text-ink hover:bg-surface-subtle'
                }`}
              >
                {choice.label}
              </button>
            ))}
          </div>
          {userChoice && (
            <div className="p-3.5 rounded-xl border border-hairline bg-surface-subtle text-xs text-ink leading-relaxed">
              {getScenarioActionResponse(userChoice, horizon, isFall)}
            </div>
          )}
        </div>

        <DisclaimerStrip />
      </div>
      <BottomNav />
    </div>
  );
}
