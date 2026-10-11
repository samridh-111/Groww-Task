import type {
  AppState,
  Plan,
  PlanBucket,
  PlanReason,
  CategoryId,
  GoalId,
  GoalTimeline,
  RiskPreference,
  Holding,
} from './types';
import { formatCurrency } from './content';

/**
 * Deterministic plan engine. Pure function, no side effects.
 */
export function computePlan(state: AppState): Plan {
  const income = state.monthlyIncome;
  const expenses = state.monthlyExpenses;
  const available = Math.max(0, income - expenses);

  // Step 2: not-yet
  if (available < 500) {
    return {
      status: 'not-yet',
      available,
      flexible: 0,
      emergency: 0,
      emergencyTarget: 0,
      buckets: [],
      reasons: [],
      mismatchNote: null,
    };
  }

  const irregular = state.incomeMode === 'irregular' || state.userType === 'freelancer';
  const roundTo = available < 5000 ? 50 : 100;
  const round = (n: number) => Math.round(n / roundTo) * roundTo;

  // Step 4: flexible
  const flexibleRaw = available * (irregular ? 0.20 : 0.10);
  let flexible = round(flexibleRaw);

  // Step 5: emergency
  const emergencyShareMap = { none: irregular ? 0.45 : 0.40, some: 0.20, solid: 0 };
  const emergencyShare = emergencyShareMap[state.emergencyBuffer];
  const emergencyRaw = available * emergencyShare;
  const emergency = round(emergencyRaw);
  const emergencyTarget = (irregular ? 6 : 3) * expenses;

  // Step 6: remaining
  const remaining = available - flexible - emergency;

  // Step 7: horizon groups
  const nonEmergencyGoals = state.goals.filter(g => g !== 'emergency');
  const goalTimelines = state.goalTimelines;

  type HorizonGroup = 'short' | 'medium' | 'long';
  const horizonMap: Record<GoalTimeline, HorizonGroup> = {
    '<1': 'short',
    '1-3': 'short',
    '3-5': 'medium',
    '5+': 'long',
  };

  const groups: Record<HorizonGroup, GoalId[]> = { short: [], medium: [], long: [] };

  if (nonEmergencyGoals.length === 0) {
    // Treat as one long group
    groups.long.push('wealth' as GoalId);
  } else {
    for (const goalId of nonEmergencyGoals) {
      const timeline = goalTimelines[goalId];
      if (timeline) {
        groups[horizonMap[timeline]].push(goalId);
      }
    }
  }

  const weights: Record<HorizonGroup, number> = { short: 2, medium: 2, long: 3 };
  const presentGroups = (['short', 'medium', 'long'] as HorizonGroup[]).filter(g => groups[g].length > 0);
  const totalWeight = presentGroups.reduce((sum, g) => sum + weights[g], 0);

  const groupAmounts: Record<HorizonGroup, number> = { short: 0, medium: 0, long: 0 };
  for (const g of presentGroups) {
    groupAmounts[g] = round((remaining * weights[g]) / totalWeight);
  }

  // Step 8: rounding - flexible absorbs difference
  const sumOthers = emergency + Object.values(groupAmounts).reduce((s, v) => s + v, 0);
  flexible = available - sumOthers;

  // Step 9: category mapping
  const buckets: PlanBucket[] = [];
  const riskPref = state.riskPreference || 'balanced';

  // Emergency bucket
  if (emergency > 0) {
    buckets.push({
      id: 'emergency',
      label: 'Emergency fund',
      amount: emergency,
      categoryId: 'liquid',
      goalId: 'emergency',
      purpose: 'A buffer for unexpected expenses',
      milestone: emergencyTarget,
    });
  }

  // Short group
  if (groups.short.length > 0) {
    const shortLess1 = groups.short.filter(g => goalTimelines[g] === '<1');
    const short13 = groups.short.filter(g => goalTimelines[g] === '1-3');
    const total = groupAmounts.short;

    if (shortLess1.length > 0 && short13.length > 0) {
      const perGoalLess1 = round(total * (shortLess1.length / groups.short.length));
      const perGoal13 = total - perGoalLess1;

      for (const g of shortLess1) {
        const amt = round(perGoalLess1 / shortLess1.length);
        buckets.push({
          id: `short-${g}`,
          label: goalLabel(g),
          amount: amt,
          categoryId: 'liquid',
          goalId: g,
          purpose: `For your ${goalLabel(g).toLowerCase()} goal`,
          milestone: amt * 12,
        });
      }
      for (const g of short13) {
        const amt = round(perGoal13 / short13.length);
        buckets.push({
          id: `short-${g}`,
          label: goalLabel(g),
          amount: amt,
          categoryId: 'short-debt',
          goalId: g,
          purpose: `For your ${goalLabel(g).toLowerCase()} goal`,
          milestone: amt * 12,
        });
      }
    } else if (shortLess1.length > 0) {
      for (const g of shortLess1) {
        const amt = round(total / shortLess1.length);
        buckets.push({
          id: `short-${g}`,
          label: goalLabel(g),
          amount: amt,
          categoryId: 'liquid',
          goalId: g,
          purpose: `For your ${goalLabel(g).toLowerCase()} goal`,
          milestone: amt * 12,
        });
      }
    } else {
      for (const g of short13) {
        const amt = round(total / short13.length);
        buckets.push({
          id: `short-${g}`,
          label: goalLabel(g),
          amount: amt,
          categoryId: 'short-debt',
          goalId: g,
          purpose: `For your ${goalLabel(g).toLowerCase()} goal`,
          milestone: amt * 12,
        });
      }
    }
  }

  // Medium group
  if (groups.medium.length > 0) {
    for (const g of groups.medium) {
      const amt = round(groupAmounts.medium / groups.medium.length);
      buckets.push({
        id: `medium-${g}`,
        label: goalLabel(g),
        amount: amt,
        categoryId: 'hybrid',
        goalId: g,
        purpose: `For your ${goalLabel(g).toLowerCase()} goal`,
        milestone: amt * 12,
      });
    }
  }

  // Long group
  if (groups.long.length > 0) {
    const longCategories = getLongCategories(riskPref);
    for (const g of groups.long) {
      const goalAmt = round(groupAmounts.long / groups.long.length);
      for (const { categoryId, share } of longCategories) {
        const amt = round(goalAmt * share);
        if (amt > 0) {
          buckets.push({
            id: `long-${g}-${categoryId}`,
            label: goalLabel(g),
            amount: amt,
            categoryId,
            goalId: g,
            purpose: `For your ${goalLabel(g).toLowerCase()} goal`,
            milestone: amt * 12,
          });
        }
      }
    }
  }

  // Fix rounding: adjust flexible to make everything sum to available
  const bucketSum = buckets.reduce((s, b) => s + b.amount, 0);
  flexible = available - bucketSum;

  // Add flexible bucket
  buckets.push({
    id: 'flexible',
    label: 'Flexible',
    amount: flexible,
    categoryId: 'liquid',
    purpose: 'Kept flexible for months that look different',
    milestone: flexible * 12,
  });

  // Step 11: reasons
  const reasons = generateReasons(state, flexible, riskPref, groups, irregular);

  const mismatchNote = getMismatchNote(riskPref, goalTimelines, nonEmergencyGoals);

  return {
    status: 'ok',
    available,
    flexible,
    emergency,
    emergencyTarget,
    buckets,
    reasons,
    mismatchNote,
  };
}

function getLongCategories(riskPref: RiskPreference): { categoryId: CategoryId; share: number }[] {
  switch (riskPref) {
    case 'cautious': return [{ categoryId: 'hybrid', share: 1.0 }];
    case 'steady': return [{ categoryId: 'hybrid', share: 0.5 }, { categoryId: 'index', share: 0.5 }];
    case 'balanced': return [{ categoryId: 'index', share: 1.0 }];
    case 'growth': return [{ categoryId: 'index', share: 0.7 }, { categoryId: 'equity', share: 0.3 }];
  }
}

function goalLabel(goalId: GoalId | string): string {
  const labels: Record<string, string> = {
    emergency: 'Emergency fund',
    travel: 'Travel',
    education: 'Education',
    car: 'First car',
    wealth: 'Long-term wealth',
    starting: 'Getting started',
  };
  return labels[goalId] || goalId;
}

function generateReasons(
  state: AppState,
  flexible: number,
  riskPref: RiskPreference,
  groups: Record<string, GoalId[]>,
  irregular: boolean,
): PlanReason[] {
  const reasons: PlanReason[] = [];

  if (state.emergencyBuffer === 'none' || state.emergencyBuffer === 'some') {
    reasons.push({
      headline: 'Emergency comes first',
      explanation:
        "You don't have a full emergency buffer yet, so we're building one before taking on more risk.",
    });
  }

  if (groups.long.length > 0) {
    reasons.push({
      headline: 'Longer goals can wait through movement',
      explanation:
        'Your long-term goal is 5+ years away, which gives investments more time to move through ups and downs. This is never guaranteed.',
    });
  }

  if (irregular) {
    reasons.push({
      headline: 'More kept flexible',
      explanation: `We're keeping ${formatCurrency(flexible)} flexible, because your income can vary.`,
    });
  } else {
    reasons.push({
      headline: 'A little kept flexible',
      explanation: `We're keeping ${formatCurrency(flexible)} flexible, because not every month looks the same.`,
    });
  }

  if (riskPref === 'balanced' || riskPref === 'growth') {
    const hasShortGoal = state.goals.some(g => {
      if (g === 'emergency') return false;
      const t = state.goalTimelines[g];
      return t === '<1' || t === '1-3';
    });
    if (hasShortGoal) {
      reasons.push({
        headline: 'Calm options for money you need soon',
        explanation:
          "You told us you'd stay calm in a fall. That's useful. But money you need within 3 years has little time to recover, so it stays in calmer options.",
      });
    }
  }

  if (riskPref === 'cautious' && state.goals.some(g => state.goalTimelines[g] === '5+')) {
    reasons.push({
      headline: 'Starting gently',
      explanation:
        "Your timeline could handle more ups and downs, but we're starting gently. You can change this any time.",
    });
  }

  reasons.push({
    headline: 'You can change anything',
    explanation: 'This is an illustration, not a prediction or advice. Change any number and the plan updates.',
  });

  return reasons;
}

export function getNextContributionBucket(plan: Plan, holdings: Holding[]): PlanBucket | null {
  if (plan.status !== 'ok' || plan.buckets.length === 0) return null;

  const progress = (bucket: PlanBucket) => {
    const invested = holdings.filter(h => h.bucketId === bucket.id).reduce((s, h) => s + h.invested, 0);
    return bucket.milestone > 0 ? invested / bucket.milestone : 1;
  };

  const emergency = plan.buckets.find(b => b.id === 'emergency');
  if (emergency && progress(emergency) < 1) return emergency;

  const ranked = plan.buckets
    .filter(b => b.id !== 'flexible')
    .sort((a, b) => progress(a) - progress(b));

  return ranked[0] || plan.buckets.find(b => b.id === 'flexible') || plan.buckets[0];
}

export function whyCategoryFits(
  state: AppState,
  categoryId: CategoryId,
  bucket: PlanBucket,
): string[] {
  const bullets: string[] = [];
  const timeline = bucket.goalId ? state.goalTimelines[bucket.goalId] : undefined;
  const irregular = state.incomeMode === 'irregular' || state.userType === 'freelancer';

  if (categoryId === 'liquid') {
    if (bucket.id === 'emergency' || bucket.goalId === 'emergency') {
      bullets.push('Matches money you may need without notice.');
    } else {
      bullets.push('Keeps short-horizon money easy to reach.');
    }
    if (state.emergencyBuffer !== 'solid') {
      bullets.push('Your buffer is still being built, so calm access comes first.');
    }
    bullets.push(irregular ? 'Useful when income can vary from month to month.' : 'A steady place for money you might spend this year.');
  } else if (categoryId === 'short-debt') {
    bullets.push(`Lined up with your ${bucket.label.toLowerCase()} timeline${timeline === '1-3' ? ' of 1–3 years' : ''}.`);
    bullets.push('Calmer than share-based options, with modest movement.');
    if (state.riskPreference === 'balanced' || state.riskPreference === 'growth') {
      bullets.push('Even if you can stay calm in a fall, money needed soon stays here.');
    } else {
      bullets.push('Fits a preference for smaller ups and downs.');
    }
  } else if (categoryId === 'hybrid') {
    bullets.push(`A mixed approach for your ${bucket.label.toLowerCase()} goal.`);
    if (state.riskPreference === 'cautious' || state.riskPreference === 'steady') {
      bullets.push('Starts more gently than a pure share-based option.');
    } else {
      bullets.push('Debt in the mix aims to soften some of the movement.');
    }
    bullets.push('Still moves when markets move. That is never guaranteed either way.');
  } else if (categoryId === 'index') {
    bullets.push(`Fits a longer horizon for ${bucket.label.toLowerCase()}.`);
    bullets.push('Owns a small piece of many companies at once, at a lower typical cost.');
    if (state.riskPreference === 'growth' || state.riskPreference === 'balanced') {
      bullets.push('You said you can stay with a plan through ups and downs.');
    } else {
      bullets.push('Values can fall for stretches. Time is the main cushion, not a promise.');
    }
  } else {
    bullets.push(`A growth-leaning option for ${bucket.label.toLowerCase()} over a long stretch.`);
    bullets.push('A manager picks shares; results can trail or lead a broad index.');
    bullets.push('Falls with the market. Only for money you can leave invested.');
  }

  return bullets.slice(0, 3);
}

function getMismatchNote(
  riskPref: RiskPreference,
  goalTimelines: Record<GoalId, string>,
  nonEmergencyGoals: GoalId[],
): string | null {
  if ((riskPref === 'balanced' || riskPref === 'growth')) {
    const hasShortGoal = nonEmergencyGoals.some(g => {
      const t = goalTimelines[g];
      return t === '<1' || t === '1-3';
    });
    if (hasShortGoal) {
      return 'You told us you\'d stay calm in a fall. That\'s useful. But money you need within 3 years has little time to recover, so it stays in calmer options.';
    }
  }
  return null;
}

// ─── Worked Example Assertions (dev only) ───
export function runPlanAssertions() {
  if (import.meta.env.PROD) return;

  const baseState: AppState = {
    name: '',
    experience: 'first-time',
    userType: 'first-job',
    incomeMode: 'fixed',
    monthlyIncome: 0,
    monthlyExpenses: 0,
    emergencyBuffer: 'none',
    goals: [],
    goalTimelines: {} as Record<GoalId, any>,
    riskPreference: 'balanced',
    plan: null,
    holdings: [],
    monthIndex: 0,
    contributedThisMonth: false,
    lessonsCompleted: [],
    onboardingComplete: false,
    demo: { failNextConfirm: false },
  };

  // Example A: Fixed income 30k, expenses 20k, buffer none, emergency + travel(1-3) + wealth(5+), risk balanced
  const stateA: AppState = {
    ...baseState,
    monthlyIncome: 30000,
    monthlyExpenses: 20000,
    emergencyBuffer: 'none',
    goals: ['emergency', 'travel', 'wealth'],
    goalTimelines: { emergency: '<1', travel: '1-3', wealth: '5+' } as any,
    riskPreference: 'balanced',
  };
  const planA = computePlan(stateA);
  console.assert(planA.available === 10000, `A: available should be 10000, got ${planA.available}`);
  const aBuckets = planA.buckets.filter(b => b.id !== 'flexible');
  const emergencyA = aBuckets.find(b => b.id === 'emergency');
  const travelA = aBuckets.find(b => b.goalId === 'travel');
  const wealthA = aBuckets.find(b => b.goalId === 'wealth');
  console.assert(emergencyA?.amount === 4000, `A: emergency should be 4000, got ${emergencyA?.amount}`);
  console.assert(travelA?.amount === 2000, `A: travel should be 2000, got ${travelA?.amount}`);
  console.assert(wealthA?.amount === 3000, `A: wealth should be 3000, got ${wealthA?.amount}`);
  const sumA = planA.buckets.reduce((s, b) => s + b.amount, 0);
  console.assert(sumA === 10000, `A: sum should be 10000, got ${sumA}`);

  // Example B: Freelancer, irregular, income 25k, expenses 18k, buffer none, wealth only
  const stateB: AppState = {
    ...baseState,
    userType: 'freelancer',
    incomeMode: 'irregular',
    monthlyIncome: 25000,
    monthlyExpenses: 18000,
    emergencyBuffer: 'none',
    goals: ['wealth'],
    goalTimelines: { wealth: '5+' } as any,
    riskPreference: 'balanced',
  };
  const planB = computePlan(stateB);
  console.assert(planB.available === 7000, `B: available should be 7000, got ${planB.available}`);
  const sumB = planB.buckets.reduce((s, b) => s + b.amount, 0);
  console.assert(sumB === 7000, `B: sum should be 7000, got ${sumB}`);

  // Example C: income 18k, expenses 17.8k -> not-yet
  const stateC: AppState = {
    ...baseState,
    monthlyIncome: 18000,
    monthlyExpenses: 17800,
    goals: ['emergency'],
    goalTimelines: {} as any,
  };
  const planC = computePlan(stateC);
  console.assert(planC.status === 'not-yet', `C: should be not-yet, got ${planC.status}`);
  console.assert(planC.available === 200, `C: available should be 200, got ${planC.available}`);

  console.log('✓ Plan engine assertions passed');
}
