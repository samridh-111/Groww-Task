import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppState } from '../state/AppState';
import { EmptyState } from '../components/ui/EmptyState';
import { BottomNav } from '../components/layout/BottomNav';
import { LESSONS } from '../lib/content';

export default function LearnPage() {
  const navigate = useNavigate();
  const { state } = useAppState();

  const completedCount = state.lessonsCompleted.length;
  const totalLessons = LESSONS.length;
  const pct = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen bg-bg">
      <div className="flex-1 px-6 pt-8 pb-24">
        {/* Header */}
        <header className="mb-6">
          <h1 className="font-bold text-[20px] tracking-tight text-ink mb-1">
            Learn Investing
          </h1>
          <p className="text-[13px] text-muted">
            Core mental models for first-time investors
          </p>
        </header>

        {/* Progress — inline, not in a card */}
        <div className="flex items-center justify-between mb-1.5">
          <p className="section-label">Progress</p>
          <span className="text-[12px] font-bold text-ink tabular-nums">
            {completedCount}/{totalLessons} lessons
          </span>
        </div>
        <div className="h-1.5 w-full bg-hairline rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Lesson list */}
        <p className="section-label mb-3">Modules</p>
        {LESSONS.length > 0 ? (
          <div className="bg-surface border border-hairline rounded-[var(--radius-card)] overflow-hidden">
            {LESSONS.map((lesson, index) => {
              const isCompleted = state.lessonsCompleted.includes(lesson.id);
              return (
                <motion.button
                  key={lesson.id}
                  onClick={() => navigate(`/learn/${lesson.id}`)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className={`w-full px-4 py-3.5 flex items-center gap-3.5 text-left hover:bg-surface-subtle transition-colors cursor-pointer ${
                    index < LESSONS.length - 1 ? 'border-b border-hairline-subtle' : ''
                  }`}
                >
                  {/* Step indicator */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[12px] shrink-0 ${
                      isCompleted
                        ? 'bg-accent text-white'
                        : 'bg-surface-subtle text-muted'
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      String(index + 1).padStart(2, '0')
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[14px] text-ink truncate">{lesson.title}</p>
                    <p className="text-[12px] text-muted truncate mt-0.5">{lesson.description}</p>
                  </div>
                  <svg className="w-4 h-4 text-ghost shrink-0" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No lessons yet" description="Check back soon." />
        )}
      </div>
      <BottomNav />
    </div>
  );
}
