import type { Holding, CategoryId } from './types';

// ─── Monthly return multipliers (6-month cycle) ───
const MULTIPLIERS = [1.0, 0.6, -0.8, 1.2, -1.5, 0.9];

// ─── Base monthly volatility (%) per category ───
const BASE_VOL: Record<CategoryId, number> = {
  liquid: 0, // fixed +0.5%
  'short-debt': 0.6,
  hybrid: 1.5,
  index: 2.5,
  equity: 3.0,
};

// ─── Scenario beta per category ───
export const SCENARIO_BETA: Record<CategoryId, number> = {
  liquid: 0,
  'short-debt': 0.1,
  hybrid: 0.4,
  index: 1.0,
  equity: 1.1,
};

/**
 * Apply one month of illustrative returns to all holdings.
 * Returns new holdings array (immutable).
 */
export function applyMonthlyReturns(holdings: Holding[], monthIndex: number): Holding[] {
  const multiplier = MULTIPLIERS[monthIndex % 6];

  return holdings.map(h => {
    let returnPct: number;
    if (h.categoryId === 'liquid') {
      returnPct = 0.5; // fixed +0.5% per month
    } else {
      returnPct = BASE_VOL[h.categoryId] * multiplier;
    }

    const newValue = Math.round(h.value * (1 + returnPct / 100));
    return { ...h, value: newValue };
  });
}

/**
 * Compute scenario impact on holdings.
 * Returns per-holding before/after values.
 */
export function computeScenario(
  holdings: Holding[],
  changePct: number, // positive number, e.g. 20
  isFall: boolean,
): { holdingId: string; categoryId: CategoryId; before: number; after: number }[] {
  const sign = isFall ? -1 : 1;

  return holdings.map(h => {
    const beta = SCENARIO_BETA[h.categoryId];
    const impact = h.value * beta * (changePct / 100) * sign;
    return {
      holdingId: h.id,
      categoryId: h.categoryId,
      before: h.value,
      after: Math.round(h.value + impact),
    };
  });
}

/**
 * Get illustrative monthly return % for a category at a given month.
 */
export function getMonthlyReturnPct(categoryId: CategoryId, monthIndex: number): number {
  if (categoryId === 'liquid') return 0.5;
  return BASE_VOL[categoryId] * MULTIPLIERS[monthIndex % 6];
}

/**
 * Generate a unique holding ID.
 */
export function generateHoldingId(): string {
  return `h_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
