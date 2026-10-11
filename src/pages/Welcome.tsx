import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { BottomSheet } from '../components/ui/BottomSheet';
import { useAppState } from '../state/AppState';

export default function WelcomePage() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    if (state.onboardingComplete) {
      navigate('/home', { replace: true });
    }
  }, [state.onboardingComplete, navigate]);

  useEffect(() => {
    const seen = sessionStorage.getItem('groww-disclaimer-seen');
    if (!seen) {
      const timer = setTimeout(() => setShowDisclaimer(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleStart = () => {
    dispatch({ type: 'SET_EXPERIENCE', payload: 'first-time' });
    navigate('/onboarding/situation');
  };

  const handleExperienced = () => {
    dispatch({ type: 'SET_EXPERIENCE', payload: 'experienced' });
    navigate('/onboarding/situation');
  };

  const closeDisclaimer = () => {
    setShowDisclaimer(false);
    sessionStorage.setItem('groww-disclaimer-seen', 'true');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-surface">
      {/* Brand header */}
      <div className="flex items-center justify-between px-6 pt-12">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
            <span className="text-white text-sm font-extrabold leading-none">G</span>
          </div>
          <span className="font-bold text-[15px] tracking-tight text-ink">Groww</span>
        </div>
        <span className="text-[11px] font-semibold text-muted border border-hairline px-2.5 py-1 rounded-full">
          Gen Z Edition
        </span>
      </div>

      {/* Hero messaging */}
      <motion.div
        className="flex-1 flex flex-col justify-center px-6 pb-4 pt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Eyebrow */}
        <motion.p
          className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted mb-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          Built for 20–26 year olds
        </motion.p>

        {/* Hero headline — editorial, not oversized */}
        <motion.h1
          className="font-bold text-[30px] leading-[1.15] tracking-[-0.025em] text-ink mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
        >
          Your first investment<br />
          doesn't have to feel<br />
          <span className="text-accent">complicated.</span>
        </motion.h1>

        <motion.p
          className="text-ink-secondary text-[14px] leading-[1.6] max-w-[300px] mb-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          Tell us your situation. We'll generate a transparent, personalised monthly money plan.
        </motion.p>

        {/* Inline stats — no cards */}
        <motion.div
          className="flex items-center gap-6 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <div>
            <p className="text-[22px] font-bold text-ink leading-none tabular-nums">~2 min</p>
            <p className="text-[11px] text-muted mt-0.5">to build your plan</p>
          </div>
          <div className="w-px h-8 bg-hairline" />
          <div>
            <p className="text-[22px] font-bold text-ink leading-none">₀</p>
            <p className="text-[11px] text-muted mt-0.5">real money used</p>
          </div>
          <div className="w-px h-8 bg-hairline" />
          <div>
            <p className="text-[22px] font-bold text-ink leading-none">100%</p>
            <p className="text-[11px] text-muted mt-0.5">transparent math</p>
          </div>
        </motion.div>
      </motion.div>

      {/* CTAs */}
      <motion.div
        className="px-6 pb-8 space-y-3 safe-bottom"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
      >
        <Button fullWidth size="lg" onClick={handleStart} id="welcome-start-btn">
          Build my plan
          <svg className="ml-2 w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
        <Button fullWidth size="lg" variant="secondary" onClick={handleExperienced} id="welcome-experienced-btn">
          I already invest
        </Button>
        <p className="text-center text-[11px] text-muted pt-1">
          Prototype mode · Nothing real connected
        </p>
      </motion.div>

      {/* Disclaimer bottom sheet */}
      <BottomSheet open={showDisclaimer} onClose={closeDisclaimer} title="Before you start">
        <div className="space-y-4 pt-1">
          <p className="text-sm text-ink-secondary leading-relaxed">
            This is an educational prototype for a product design challenge — exploring a first-time investor experience for Gen Z.
          </p>
          <div className="bg-accent-light rounded-xl p-3.5 space-y-1.5">
            <p className="text-xs font-bold text-accent-dark">Simulated only</p>
            <ul className="space-y-1 text-xs text-ink-secondary">
              <li>• No bank accounts or PAN are connected</li>
              <li>• Returns shown are illustrative examples only</li>
              <li>• Nothing here is registered investment advice</li>
            </ul>
          </div>
          <Button fullWidth size="md" onClick={closeDisclaimer}>
            Got it, let's go
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
