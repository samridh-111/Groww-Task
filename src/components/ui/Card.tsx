import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'flat' | 'accent';
}

export function Card({
  padding = 'md',
  selected = false,
  onClick,
  children,
  className = '',
  variant = 'default',
  ...props
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  };

  const variants = {
    default: selected
      ? 'bg-accent-faint border-accent'
      : 'bg-surface border-hairline',
    elevated: 'bg-surface border-hairline shadow-sm',
    flat: selected
      ? 'bg-accent-faint border-accent'
      : 'bg-surface-subtle border-transparent',
    accent: 'bg-accent-light border-accent/30',
  };

  const interactiveClass = onClick
    ? 'cursor-pointer active:opacity-90 transition-all duration-100'
    : '';

  return (
    <div
      className={`border rounded-[var(--radius-card)] ${paddings[padding]} ${variants[variant]} ${selected ? 'border-accent' : ''} ${interactiveClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
