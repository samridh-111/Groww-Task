import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function Chip({
  children,
  selected,
  onClick,
  className = '',
  size = 'md',
}: ChipProps) {
  const sizeClasses =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs min-h-[36px]'
      : 'px-4 py-2.5 text-sm min-h-[44px]';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full font-medium transition-all duration-150 cursor-pointer select-none active:scale-[0.97] ${sizeClasses}
        ${
          selected
            ? 'bg-accent-light text-accent-dark border-2 border-accent font-semibold shadow-xs'
            : 'bg-surface text-ink-secondary border border-hairline hover:border-hairline/80 hover:bg-surface-subtle'
        } ${className}`}
    >
      {children}
    </button>
  );
}
