import type { CategoryInfo } from './types';

// ─── Investment Categories ───
export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'liquid',
    name: 'Liquid fund',
    riskLabel: 'Low',
    riskDots: 1,
    bestFor: 'Money you may need within about a year',
    whatIs: 'Holds very short-term, high-quality debt instruments. Your money stays relatively accessible.',
    fitsWhen: 'You need a place to park money you might use soon — like an emergency fund or short-term savings.',
    howRisky: 'Among the least volatile options available. Returns are modest and may not always keep up with inflation.',
    howLong: 'Suitable for holding periods of a few days to about a year.',
    whatCouldGoWrong: 'Returns are modest and may not beat inflation over time. This is not a bank deposit and is not guaranteed.',
    illustrativeFall: 'Close to 0–1%',
  },
  {
    id: 'short-debt',
    name: 'Short-term debt fund',
    riskLabel: 'Low–Moderate',
    riskDots: 2,
    bestFor: 'Money you plan to use in 1–3 years',
    whatIs: 'Lends to companies and the government for short periods, typically 1–3 years. Aims for steady, moderate returns.',
    fitsWhen: 'You have a goal 1–3 years away and want something calmer than shares but potentially better than a savings account.',
    howRisky: 'Generally steadier than share-based options, but not without movement. Interest-rate changes can cause small dips.',
    howLong: 'Works well for 1–3 year time horizons.',
    whatCouldGoWrong: 'Interest-rate changes can cause small dips in value. In rare cases, a borrower may fail to repay.',
    illustrativeFall: 'About 2–4%',
  },
  {
    id: 'hybrid',
    name: 'Balanced (hybrid) fund',
    riskLabel: 'Moderate',
    riskDots: 3,
    bestFor: 'Medium-term goals, 3–5 years',
    whatIs: 'A mix of shares and debt held together in one fund. The debt portion aims to cushion some of the ups and downs of shares.',
    fitsWhen: 'You want some growth potential but prefer a smoother ride than a pure share-based option.',
    howRisky: 'Moderate. It still falls when shares fall — just usually less than a pure equity option.',
    howLong: 'Generally suited for 3–5 years or longer.',
    whatCouldGoWrong: 'Still falls when shares fall, just usually less. Neither the debt nor the equity portion is guaranteed.',
    illustrativeFall: 'About 8–12% in a rough stretch',
  },
  {
    id: 'index',
    name: 'Broad-market index fund',
    riskLabel: 'Moderate–High',
    riskDots: 4,
    bestFor: 'Long-term goals, 5+ years',
    whatIs: 'Tracks a large basket of companies — for example, the Nifty 50 — at a low cost. You own a small piece of many companies at once.',
    fitsWhen: 'You have a long time horizon (5+ years) and can stay patient through market ups and downs.',
    howRisky: 'Values can move significantly in any given month or year. Over longer periods, broad markets have historically recovered, though this is never guaranteed.',
    howLong: 'Generally suited for 5 years or more.',
    whatCouldGoWrong: 'It falls with the market, sometimes for extended periods. Past performance does not predict future results.',
    illustrativeFall: '20% or more in a bad stretch',
  },
  {
    id: 'equity',
    name: 'Diversified equity fund',
    riskLabel: 'Moderate–High',
    riskDots: 4,
    bestFor: 'Long-term goals, 5+ years',
    whatIs: 'A fund manager picks shares across different sectors and company sizes. Aims to grow your money over the long term.',
    fitsWhen: 'You want exposure to shares and are comfortable with a fund manager making investment decisions on your behalf.',
    howRisky: 'Similar volatility to an index fund. The manager may outperform or underperform the broad market.',
    howLong: 'Generally suited for 5 years or more.',
    whatCouldGoWrong: 'Falls with the market and the manager can underperform an index. Costs are typically higher than index funds.',
    illustrativeFall: '20% or more in a bad stretch',
  },
];

export function getCategoryById(id: string): CategoryInfo | undefined {
  return CATEGORIES.find(c => c.id === id);
}

// ─── Goal Display Info ───
export const GOAL_INFO: Record<string, { label: string; icon: string; description: string }> = {
  emergency: { label: 'Emergency fund', icon: 'Shield', description: 'A buffer for unexpected expenses' },
  travel: { label: 'Travel', icon: 'Plane', description: 'For trips and experiences' },
  education: { label: 'Education', icon: 'GraduationCap', description: 'For courses or higher studies' },
  car: { label: 'First car', icon: 'Car', description: 'Towards your own vehicle' },
  wealth: { label: 'Long-term wealth', icon: 'TrendingUp', description: 'Building wealth over time' },
  starting: { label: 'Just getting started', icon: 'Sprout', description: 'No specific goal yet, and that is fine' },
};

// ─── Lessons ───
export interface LessonCard {
  title: string;
  body: string;
  interaction?: 'fall-slider' | 'emergency-compare' | 'investing-vs-trading' | 'tap-reveal' | 'stack-visual';
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  cards: LessonCard[];
}

export const LESSONS: Lesson[] = [
  {
    id: 'market-fall',
    title: 'What happens when the market falls?',
    description: 'Understanding market ups and downs',
    cards: [
      {
        title: 'Markets move up and down',
        body: 'Every investment that has the potential to grow also has the potential to fall in value. This is normal — it happens to every investor.',
      },
      {
        title: 'See it for yourself',
        body: 'Drag the slider to see what a fall looks like.',
        interaction: 'fall-slider',
      },
      {
        title: 'A fall is not always a loss',
        body: 'A fall is a change in value. It becomes a loss you keep only if you sell. What matters is what you hold and when you need the money.',
      },
    ],
  },
  {
    id: 'emergency-fund',
    title: 'Why an emergency fund comes first',
    description: 'How a buffer protects your plan',
    cards: [
      {
        title: 'Life has surprises',
        body: 'A sudden expense — a medical bill, a repair, a job change — can happen to anyone. Without a buffer, you might have to sell investments at a bad time.',
      },
      {
        title: 'With and without a buffer',
        body: 'See what happens when a surprise Rs 15,000 expense hits your plan.',
        interaction: 'emergency-compare',
      },
      {
        title: 'Build your buffer first',
        body: 'An emergency fund is not exciting, but it gives your other investments the time they need. Most people aim for 3–6 months of expenses.',
      },
    ],
  },
  {
    id: 'investing-vs-trading',
    title: 'Investing vs trading',
    description: 'Two very different approaches',
    cards: [
      {
        title: 'Not the same thing',
        body: 'People often use "investing" and "trading" as if they mean the same thing. They do not.',
      },
      {
        title: 'Compare them',
        body: 'See how investing and trading differ in approach, time, and decisions.',
        interaction: 'investing-vs-trading',
      },
      {
        title: 'This prototype focuses on investing',
        body: 'Goal-based investing means deciding where your money should go based on when you need it and how much risk fits your situation. This prototype does not include trading features.',
      },
    ],
  },
  {
    id: 'what-is-index',
    title: 'What is an index fund?',
    description: 'A simple way to own many companies',
    cards: [
      {
        title: 'A basket of companies',
        body: 'An index fund tracks a group of companies — for example, the 50 largest listed companies in India. When you invest, you own a tiny piece of each one.',
      },
      {
        title: 'See inside the basket',
        body: 'Tap to reveal what an index fund holds.',
        interaction: 'tap-reveal',
      },
      {
        title: 'Low cost, broad exposure',
        body: 'Because an index fund follows a set list instead of relying on a manager to pick shares, its costs tend to be lower. It is not guaranteed to grow, but it gives you exposure to the broad market.',
      },
    ],
  },
  {
    id: 'starting-small',
    title: 'Why starting small is fine',
    description: 'Small amounts add up over time',
    cards: [
      {
        title: 'You do not need a lot to begin',
        body: 'Many people wait because they feel they do not have "enough" to invest. But starting with a small, regular amount can make a meaningful difference over time.',
      },
      {
        title: 'Rs 500 per month, over 5 years',
        body: 'See how small, consistent contributions can accumulate.',
        interaction: 'stack-visual',
      },
      {
        title: 'Consistency matters more than size',
        body: 'The habit of investing regularly — even small amounts — matters more than waiting for the "right" moment or the "right" amount. You can always increase later.',
      },
    ],
  },
];

// ─── Scenario Responses ───
export function getScenarioHorizonText(horizon: string, isFall: boolean): string {
  if (isFall) {
    switch (horizon) {
      case '6m':
        return 'A fall matters more here, because there is little time to recover. This is why money you need soon is kept in calmer options.';
      case '2y':
        return 'There may not be enough time to fully recover. Check your money is in the right place for when you need it.';
      case '7y':
        return 'A longer timeline gives more room to ride out ups and downs. It is never guaranteed.';
      default:
        return '';
    }
  }
  return 'A quick rise does not tell you what comes next. Staying with your plan matters more than chasing a rise.';
}

export function getScenarioActionResponse(action: string, horizon: string, isFall: boolean): string {
  if (isFall) {
    switch (action) {
      case 'sell':
        if (horizon === '6m') return 'If you need this money soon, moving to a calmer option could make sense. Selling is not always wrong — it depends on your timeline.';
        if (horizon === '2y') return 'Selling locks in the fall. With two years, there may be time to recover, but there is no certainty. Consider whether the money is in the right category for your timeline.';
        return 'With a longer timeline, selling after a fall means locking in the drop. Markets have historically recovered over time, but this is never guaranteed. Consider your comfort level.';
      case 'wait':
        if (horizon === '6m') return 'Waiting is reasonable if you can be flexible about when you need the money. If the date is fixed, consider whether calmer options suit you better.';
        if (horizon === '2y') return 'Waiting gives some time for recovery, though it is not certain. Keep an eye on whether your money matches your timeline.';
        return 'With time on your side, waiting through ups and downs is a common approach. It is never guaranteed to work out, but history suggests patience can help.';
      case 'add':
        if (horizon === '6m') return 'Adding more to something you need soon means more money exposed to short-term movement. Make sure you are comfortable with that.';
        if (horizon === '2y') return 'Adding during a fall can mean buying at lower prices, but there is no guarantee prices will recover in your timeframe.';
        return 'Adding during a fall is a common long-term strategy, but it requires comfort with further potential drops. Never invest money you cannot afford to keep invested.';
      case 'unsure':
        return 'That is completely normal. Most investors feel uncertain during market movements. The important thing is to check whether your money matches your timeline and comfort level.';
      default:
        return '';
    }
  }
  // Rally responses
  switch (action) {
    case 'sell':
      return 'Taking some gains can feel satisfying, but timing the market consistently is extremely difficult. Consider whether selling aligns with your original goal and timeline.';
    case 'wait':
      return 'Staying with your plan regardless of short-term movements is often a reasonable approach. Remember, your plan is based on your goals, not market timing.';
    case 'add':
      return 'Adding during a rise means buying at higher prices. This is fine if your timeline is long, but be careful not to invest only because prices have gone up.';
    case 'unsure':
      return 'That is reasonable. A rise can feel exciting, but it does not change your underlying goals or timeline. Focus on your plan rather than the market movement.';
    default:
      return '';
  }
}

// ─── Currency Formatter ───
export function formatCurrency(amount: number): string {
  return `Rs ${new Intl.NumberFormat('en-IN').format(Math.round(amount))}`;
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 100000) {
    return `Rs ${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `Rs ${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
}
