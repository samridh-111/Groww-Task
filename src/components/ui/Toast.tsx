import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onDone: () => void;
  duration?: number;
}

export function Toast({ message, visible, onDone, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onDone, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-ink text-white px-5 py-3 rounded-[14px] shadow-lg text-sm font-medium max-w-[90vw]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          role="alert"
          aria-live="polite"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
