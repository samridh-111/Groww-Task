interface RiskMeterProps {
  dots: number; // 1-4
  label: string;
  className?: string;
}

export function RiskMeter({ dots, label, className = '' }: RiskMeterProps) {
  const dotColors = [
    'bg-accent',         // Very low / Low: Groww Emerald
    'bg-sky-500',        // Moderately low: Sky Blue
    'bg-amber-500',      // Moderate: Amber
    'bg-rose-500',       // High: Rose
  ];

  const activeColor = dotColors[Math.min(dots - 1, dotColors.length - 1)] || 'bg-accent';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
              i <= dots ? activeColor : 'bg-hairline'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted font-medium">{label}</span>
    </div>
  );
}
