import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'caution' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold transition-all select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

  const variants = {
    primary:
      'bg-accent text-white hover:bg-accent-dark active:opacity-90',
    secondary:
      'bg-surface text-ink border border-hairline hover:bg-surface-subtle active:bg-hairline',
    outline:
      'bg-transparent text-ink border border-hairline hover:bg-surface-subtle',
    ghost:
      'bg-transparent text-ink hover:bg-surface-subtle active:bg-hairline',
    caution:
      'bg-caution text-white hover:opacity-90 active:opacity-95',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-full min-h-[36px] font-semibold tracking-wide',
    md: 'px-6 py-3 text-sm rounded-[var(--radius-button)] min-h-[48px] font-semibold',
    lg: 'px-7 py-3.5 text-[15px] rounded-[var(--radius-button)] min-h-[52px] font-bold tracking-tight',
  };

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ duration: 0.1 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${disabled ? 'opacity-35 cursor-not-allowed pointer-events-none' : 'cursor-pointer'} ${className}`}
      disabled={disabled}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
