import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../state/AppState';
import { Button } from '../components/ui/Button';
import { DisclaimerStrip } from '../components/ui/DisclaimerStrip';
import { LESSONS, formatCurrency } from '../lib/content';

export default function LessonDetailPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { dispatch } = useAppState();

  const lesson = LESSONS.find(l => l.id === lessonId);
  const [cardIndex, setCardIndex] = useState(0);

  // Interactive states
  const [fallPct, setFallPct] = useState(20);
  const [compareTab, setCompareTab] = useState<'with' | 'without'>('without');
  const [basketRevealed, setBasketRevealed] = useState(false);

  if (!lesson) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-bg min-h-screen">
        <h2 className="font-heading font-bold text-xl mb-4 text-ink">Lesson not found</h2>
        <Button onClick={() => navigate('/learn')}>Back to Learn</Button>
      </div>
    );
  }

  const handleFinish = () => {
    dispatch({ type: 'COMPLETE_LESSON', payload: lesson.id });
    navigate('/learn');
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 min-h-screen bg-bg">
      <div className="space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-hairline pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-accent-dark font-bold block mb-1">
              Lesson
            </span>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-ink">
              {lesson.title}
            </h1>
          </div>
          <button
            onClick={() => navigate('/learn')}
            className="text-xs font-semibold text-muted hover:text-ink px-3 py-1.5 rounded-lg border border-hairline bg-surface transition-colors cursor-pointer"
          >
            Back
          </button>
        </header>

        {/* Progress indicators */}
        <div className="flex gap-2">
          {lesson.cards.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                idx <= cardIndex ? 'bg-accent' : 'bg-hairline'
              }`}
            />
          ))}
        </div>

        {/* Content */}
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
                Concept 0{cardIndex + 1} of 0{lesson.cards.length}
              </span>
              <h2 className="font-heading font-bold text-xl text-ink mb-3 leading-snug">
                {lesson.cards[cardIndex].title}
              </h2>
              <p className="text-sm text-ink leading-relaxed">
                {lesson.cards[cardIndex].body}
              </p>
            </div>

            {/* Interactive Module for Lesson 1 */}
            {lesson.id === 'market-fall' && cardIndex === 1 && (
              <div className="p-4 rounded-xl border border-hairline bg-surface space-y-4">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-muted font-medium">Simulated market move</span>
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
                    <span className="text-[10px] text-muted block mb-0.5">Invested</span>
                    <span className="font-mono font-bold text-sm text-ink tabular-nums">₹10,000</span>
                  </div>
                  <div className="p-3 rounded-lg border border-hairline bg-surface-subtle">
                    <span className="text-[10px] text-muted block mb-0.5">Temporary Value</span>
                    <span className="font-mono font-bold text-sm text-caution tabular-nums">
                      {formatCurrency(Math.round(10000 * (1 - fallPct / 100)))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive for Emergency buffer comparison */}
            {lesson.id === 'why-buffer-first' && cardIndex === 1 && (
              <div className="p-4 rounded-xl border border-hairline bg-surface space-y-3">
                <div className="grid grid-cols-2 p-1 bg-surface-subtle border border-hairline rounded-lg">
                  <button
                    type="button"
                    onClick={() => setCompareTab('without')}
                    className={`py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      compareTab === 'without'
                        ? 'bg-ink text-white'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    Without Buffer
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompareTab('with')}
                    className={`py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      compareTab === 'with'
                        ? 'bg-accent text-white'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    With Buffer
                  </button>
                </div>
                <p className="text-xs text-ink leading-relaxed">
                  {compareTab === 'without'
                    ? 'When a surprise expense arrives, you are forced to break your investments at an unfavorable price.'
                    : 'Your emergency cash absorbs the surprise smoothly. Your long-term investments stay untouched.'}
                </p>
              </div>
            )}

            {/* Interactive for Index diversification */}
            {lesson.id === 'what-is-an-index' && cardIndex === 1 && (
              <div className="p-4 rounded-xl border border-hairline bg-surface space-y-3">
                <p className="text-xs text-muted">
                  An index fund holds India's top 50 companies automatically.
                </p>
                <Button
                  size="sm"
                  variant={basketRevealed ? 'secondary' : 'primary'}
                  onClick={() => setBasketRevealed(!basketRevealed)}
                >
                  {basketRevealed ? 'Hide Top Companies' : 'Inspect Top Holdings'}
                </Button>
                {basketRevealed && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {['Reliance', 'HDFC Bank', 'TCS', 'Infosys', 'ICICI Bank', 'ITC', 'L&T', 'Bharti Airtel'].map(c => (
                      <span key={c} className="px-2.5 py-1 rounded-md bg-surface-subtle text-[11px] font-semibold text-ink border border-hairline">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <DisclaimerStrip />
      </div>

      <div className="pt-6">
        {cardIndex < lesson.cards.length - 1 ? (
          <Button
            fullWidth
            size="md"
            onClick={() => setCardIndex(prev => prev + 1)}
          >
            Next concept
          </Button>
        ) : (
          <Button fullWidth size="md" onClick={handleFinish}>
            Complete lesson
          </Button>
        )}
      </div>
    </div>
  );
}
