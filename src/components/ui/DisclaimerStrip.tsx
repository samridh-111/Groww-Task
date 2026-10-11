interface DisclaimerStripProps {
  className?: string;
}

export function DisclaimerStrip({ className = '' }: DisclaimerStripProps) {
  return (
    <div className={`flex items-baseline gap-2 px-3 py-2 border-t border-hairline/60 ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted flex-shrink-0">
        Demo
      </span>
      <p className="text-[11px] text-muted leading-tight">
        Prototype only · Simulated model · Not SEBI-registered financial advice
      </p>
    </div>
  );
}
