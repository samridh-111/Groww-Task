import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../state/AppState';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../lib/content';

export default function BeforeInvestLessonPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useAppState();

  const loc = (location.state || {}) as { targetCategory?: string; defaultAmount?: number; bucketId?: string };
  const targetCategory = loc.targetCategory || 'liquid';

  const [cardIndex, setCardIndex] = useState(0);
  const [fallPct, setFallPct] = useState(20);

  const initialVal = 10000;
  const currentVal = Math.round(initialVal * (1 - fallPct / 100));

  const cards = [
    {
      title: 'Markets move in continuous cycles',
      body: 'Every investment that has the potential to compound also experiences short-term dips. Volatility is not a design flaw; it is the natural engine that creates returns over time.',
    },
    {
      title: 'Experience a market fall interactively',
      body: 'Adjust the slider below to see how a portfolio responds to price changes. Notice how numbers fluctuate without forcing you to sell.',
      interactive: true,
    },
    {
      title: 'A drop in price is not a realized loss',
      body: 'Paper fluctuations become permanent losses only if you panic and sell. Patience through cycles is the single greatest superpower of young investors.',
    },
  ];

  const handleFinish = () => {
    dispatch({ type: 'COMPLETE_LESSON', payload: 'market-fall' });
    navigate('/invest/review', {
      state: {
        categoryId: targetCategory,
        defaultAmount: loc.defaultAmount,
        bucketId: loc.bucketId,
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 min-h-screen bg-bg">
      <div className="space-y-6">
        {/* Navigation & Header */}
        <header className="flex items-center justify-between border-b border-hairline pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent-dark block mb-1">
              Prep for first-timers
            </span>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-ink">
              Before you begin
            </h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs font-semibold text-muted hover:text-ink px-3 py-1.5 rounded-lg border border-hairline bg-surface transition-colors cursor-pointer"
          >
            Back
          </button>
        </header>

        {/* Progress bar */}
        <div className="flex gap-2">
          {cards.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                idx <= cardIndex ? 'bg-accent' : 'bg-hairline'
              }`}
            />
          ))}
        </div>

        {/* Content slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={cardIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div>
              <span className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-2">
                Concept 0{cardIndex + 1} of 0{cards.length}
              </span>
              <h2 className="font-heading font-bold text-xl text-ink mb-3 leading-snug">
                {cards[cardIndex].title}
              </h2>
              <p className="text-sm text-ink leading-relaxed">
                {cards[cardIndex].body}
              </p>
            </div>

            {cards[cardIndex].interactive && (
              <div className="p-4 rounded-xl border border-hairline bg-surface space-y-4">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-muted font-medium">Hypothetical drop</span>
                  <span className="font-mono font-bold text-caution tabular-nums">−{fallPct}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={40}
                  value={fallPct}
                  onChange={e => setFallPct(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full accent-[#00D09C] cursor-pointer bg-hairline"
                />
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg border border-hairline bg-surface-subtle">
                    <span className="text-[10px] text-muted block mb-0.5">Initial invested</span>
                    <span className="font-mono font-bold text-sm text-ink tabular-nums">
                      {formatCurrency(initialVal)}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-hairline bg-surface-subtle">
                    <span className="text-[10px] text-muted block mb-0.5">Paper value during dip</span>
                    <span className="font-mono font-bold text-sm text-caution tabular-nums">
                      {formatCurrency(currentVal)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pt-6">
        {cardIndex < cards.length - 1 ? (
          <Button
            fullWidth
            size="md"
            onClick={() => setCardIndex(prev => prev + 1)}
          >
            Next concept
          </Button>
        ) : (
          <Button fullWidth size="md" onClick={handleFinish}>
            I understand, continue to review
          </Button>
        )}
      </div>
    </div>
  );
}
