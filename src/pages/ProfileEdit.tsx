import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../state/AppState';
import { Button } from '../components/ui/Button';
import { NumberInput } from '../components/ui/NumberInput';
import { Chip } from '../components/ui/Chip';
import { Toast } from '../components/ui/Toast';
import { computePlan } from '../lib/planEngine';
import { formatCurrency, GOAL_INFO } from '../lib/content';
import type { EmergencyBuffer, GoalId, GoalTimeline, RiskPreference } from '../lib/types';

const GOAL_IDS: GoalId[] = ['emergency', 'travel', 'education', 'car', 'wealth', 'starting'];
const TIMELINE_OPTIONS: { id: GoalTimeline; label: string }[] = [
  { id: '<1', label: '<1 yr' },
  { id: '1-3', label: '1–3 yrs' },
  { id: '3-5', label: '3–5 yrs' },
  { id: '5+', label: '5+ yrs' },
];

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();

  const [name, setName] = useState(state.name);
  const [income, setIncome] = useState(state.monthlyIncome);
  const [expenses, setExpenses] = useState(state.monthlyExpenses);
  const [buffer, setBuffer] = useState<EmergencyBuffer>(state.emergencyBuffer);
  const [goals, setGoals] = useState<GoalId[]>(state.goals);
  const [timelines, setTimelines] = useState<Record<GoalId, GoalTimeline>>({ ...state.goalTimelines });
  const [risk, setRisk] = useState<RiskPreference>(state.riskPreference || 'steady');

  const [delta, setDelta] = useState<{ label: string; before: number; after: number }[]>([]);
  const [toast, setToast] = useState('');
  const [showToast, setShowToast] = useState(false);

  const incomeError = income < 1000 ? 'Minimum income is ₹1,000' : income > 10000000 ? 'Exceeds limit' : '';
  const expenseError = expenses < 0 ? 'Cannot be negative' : '';
  const valid = !incomeError && !expenseError && goals.length > 0;

  const toggleGoal = (id: GoalId) => {
    setGoals(prev => (prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]));
  };

  const handleSave = () => {
    const oldPlan = computePlan(state);

    dispatch({ type: 'SET_NAME', payload: name.trim() });
    dispatch({ type: 'SET_MONTHLY_INCOME', payload: income });
    dispatch({ type: 'SET_MONTHLY_EXPENSES', payload: expenses });
    dispatch({ type: 'SET_EMERGENCY_BUFFER', payload: buffer });
    dispatch({ type: 'SET_RISK_PREFERENCE', payload: risk });
    dispatch({ type: 'SET_GOALS', payload: goals });

    for (const g of goals) {
      const t = timelines[g] || (g === 'wealth' || g === 'starting' ? '5+' : '1-3');
      dispatch({ type: 'SET_GOAL_TIMELINE', payload: { goalId: g, timeline: g === 'emergency' ? '<1' : t } });
    }
    dispatch({ type: 'COMPUTE_PLAN' });

    const updated = {
      ...state,
      name: name.trim(),
      monthlyIncome: income,
      monthlyExpenses: expenses,
      emergencyBuffer: buffer,
      riskPreference: risk,
      goals,
      goalTimelines: { ...timelines },
    };
    const newPlan = computePlan(updated);

    const labels = new Set([
      ...oldPlan.buckets.map(b => b.label),
      ...newPlan.buckets.map(b => b.label),
    ]);
    const changes: { label: string; before: number; after: number }[] = [];
    for (const label of labels) {
      const before = oldPlan.buckets.filter(b => b.label === label).reduce((s, b) => s + b.amount, 0);
      const after = newPlan.buckets.filter(b => b.label === label).reduce((s, b) => s + b.amount, 0);
      if (before !== after) changes.push({ label, before, after });
    }
    setDelta(changes);
    setToast('Your plan has been updated successfully');
    setShowToast(true);
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-6 min-h-screen bg-bg">
      <Toast message={toast} visible={showToast} onDone={() => setShowToast(false)} />

      <div className="space-y-6">
        {/* Navigation & Header */}
        <header className="flex items-center justify-between border-b border-hairline pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
              Configuration
            </span>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-ink">
              Edit Financial Profile
            </h1>
          </div>
          <button
            onClick={() => navigate('/you')}
            className="text-xs font-semibold text-muted hover:text-ink px-3 py-1.5 rounded-lg border border-hairline bg-surface transition-colors cursor-pointer"
          >
            Back
          </button>
        </header>

        {/* Name input */}
        <div>
          <label htmlFor="edit-name" className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
            Name
          </label>
          <input
            id="edit-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-surface border border-hairline rounded-lg text-sm text-ink focus:outline-none focus:border-accent transition-all"
          />
        </div>

        {/* Incomes & Expenses */}
        <div className="space-y-4">
          <NumberInput
            id="edit-income"
            label="Monthly income"
            value={income}
            onChange={setIncome}
            min={1000}
            max={10000000}
            error={incomeError || undefined}
          />

          <NumberInput
            id="edit-expenses"
            label="Monthly expenses"
            value={expenses}
            onChange={setExpenses}
            min={0}
            max={10000000}
            error={expenseError || undefined}
          />
        </div>

        {/* Emergency buffer */}
        <div className="space-y-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-muted">
            Emergency Buffer Status
          </span>
          <div className="flex flex-wrap gap-2">
            {(['none', 'some', 'solid'] as EmergencyBuffer[]).map(b => (
              <Chip key={b} selected={buffer === b} onClick={() => setBuffer(b)}>
                {b === 'none' ? 'None' : b === 'some' ? '1–2 Months' : '3+ Months'}
              </Chip>
            ))}
          </div>
        </div>

        {/* Investment Goals */}
        <div className="space-y-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-muted">
            Investment Goals
          </span>
          <div className="flex flex-wrap gap-2">
            {GOAL_IDS.map(id => (
              <Chip key={id} selected={goals.includes(id)} onClick={() => toggleGoal(id)}>
                {GOAL_INFO[id].label}
              </Chip>
            ))}
          </div>
        </div>

        {/* Timelines */}
        {goals
          .filter(g => g !== 'emergency')
          .map(g => (
            <div key={g} className="p-3 rounded-lg border border-hairline bg-surface space-y-2">
              <span className="text-xs font-semibold text-ink block">{GOAL_INFO[g].label} Timeline</span>
              <div className="flex flex-wrap gap-1.5">
                {TIMELINE_OPTIONS.map(opt => (
                  <Chip
                    key={opt.id}
                    size="sm"
                    selected={timelines[g] === opt.id}
                    onClick={() => setTimelines(prev => ({ ...prev, [g]: opt.id }))}
                  >
                    {opt.label}
                  </Chip>
                ))}
              </div>
            </div>
          ))}

        {/* Risk Level */}
        <div className="space-y-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-muted">
            Risk Comfort Level
          </span>
          <div className="grid grid-cols-4 gap-2">
            {(['cautious', 'steady', 'balanced', 'growth'] as RiskPreference[]).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRisk(r)}
                className={`py-2 px-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  risk === r
                    ? 'bg-ink text-white font-bold'
                    : 'bg-surface border border-hairline text-muted hover:text-ink'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Recalculated Plan Impact */}
        {delta.length > 0 && (
          <div className="border border-hairline rounded-xl p-4 bg-surface space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
              Recalculated Plan Impact
            </span>
            <div className="divide-y divide-hairline">
              {delta.map(row => (
                <div key={row.label} className="flex justify-between py-1.5 text-xs">
                  <span className="text-muted">{row.label}</span>
                  <span className="font-mono font-bold text-ink tabular-nums">
                    {formatCurrency(row.before)} → {formatCurrency(row.after)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 pb-2 space-y-2.5 safe-bottom">
        <Button fullWidth size="lg" disabled={!valid} onClick={handleSave}>
          Save changes
        </Button>
        {delta.length > 0 && (
          <Button fullWidth size="md" variant="secondary" onClick={() => navigate('/plan')}>
            View updated plan
          </Button>
        )}
      </div>
    </div>
  );
}
