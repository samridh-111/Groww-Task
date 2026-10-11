import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={ref}
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-2xl z-50 max-h-[85vh] overflow-y-auto border-t border-hairline shadow-lg"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-hairline rounded-full" />
            </div>
            {title && (
              <div className="flex items-center justify-between px-6 py-3 border-b border-hairline">
                <h3 className="font-heading font-semibold text-base text-ink">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-xs font-semibold text-muted hover:text-ink px-2.5 py-1 rounded border border-hairline bg-surface cursor-pointer"
                  aria-label="Close"
                >
                  Close
                </button>
              </div>
            )}
            <div className="px-6 py-4 safe-bottom">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
