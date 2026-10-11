interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
}

export function Skeleton({ width = '100%', height = '20px', className = '', rounded }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${rounded ? 'rounded-full' : ''} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-surface rounded-[20px] border border-hairline p-5 space-y-3 ${className}`}>
      <Skeleton width="60%" height="16px" />
      <Skeleton width="40%" height="28px" />
      <Skeleton width="100%" height="8px" />
      <Skeleton width="80%" height="14px" />
    </div>
  );
}
