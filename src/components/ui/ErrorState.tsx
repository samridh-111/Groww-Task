import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry, retryLabel = 'Try again' }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-6 border border-hairline rounded-xl my-4 bg-surface">
      <span className="text-[10px] font-bold uppercase tracking-wider text-caution mb-2">
        Notice
      </span>
      <h3 className="font-heading font-semibold text-base mb-1 text-ink">{title}</h3>
      <p className="text-muted text-xs mb-5 max-w-[280px] leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="primary" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
