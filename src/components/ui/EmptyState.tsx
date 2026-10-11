import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-6 border border-dashed border-hairline rounded-xl my-4">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
        Empty
      </span>
      <h3 className="font-heading font-semibold text-base mb-1 text-ink">{title}</h3>
      <p className="text-muted text-xs mb-5 max-w-[280px] leading-relaxed">{description}</p>
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
