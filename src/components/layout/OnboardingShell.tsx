import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SegmentedProgress } from '../ui/ProgressBar';
import { motion } from 'framer-motion';

interface OnboardingShellProps {
  step: number;
  totalSteps: number;
  children: React.ReactNode;
  onBack?: () => void;
  showProgress?: boolean;
}

export function OnboardingShell({
  step,
  totalSteps,
  children,
  onBack,
  showProgress = true,
}: OnboardingShellProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg">
      {/* Sticky Clean Header with Progress */}
      <div className="sticky top-0 bg-bg/95 backdrop-blur-md z-30 px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handleBack}
            className="px-2.5 py-1 rounded-md text-xs font-semibold text-muted hover:text-ink hover:bg-surface border border-hairline/60 transition-colors cursor-pointer select-none"
            aria-label="Go back"
          >
            Back
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
              <span className="text-white text-[11px] font-extrabold leading-none">G</span>
            </div>
            <span className="font-heading font-bold text-sm tracking-tight text-ink">
              Groww
            </span>
          </div>
          <div className="text-xs font-semibold text-muted tracking-wide tabular-nums">
            {step} / {totalSteps}
          </div>
        </div>

        {showProgress && (
          <SegmentedProgress current={step} total={totalSteps} />
        )}
      </div>

      {/* Content */}
      <motion.div
        className="flex-1 px-6 py-4 flex flex-col"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
