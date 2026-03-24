interface SkeletonShimmerProps {
  rows?: number;
  className?: string;
}

export default function SkeletonShimmer({ rows = 5, className = '' }: SkeletonShimmerProps) {
  return (
    <div className={`space-y-2 ${className}`} aria-label="Elaborazione in corso..." aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3 items-center px-2 py-1.5">
          <div
            className="skeleton-shimmer h-4 rounded-none"
            style={{ width: `${60 + ((i * 37) % 40)}px`, animationDelay: `${i * 120}ms` }}
          />
          <div
            className="skeleton-shimmer h-4 rounded-none flex-1"
            style={{ animationDelay: `${i * 120 + 60}ms` }}
          />
          <div
            className="skeleton-shimmer h-4 rounded-none"
            style={{ width: '80px', animationDelay: `${i * 120 + 100}ms` }}
          />
          <div
            className="skeleton-shimmer h-4 rounded-none"
            style={{ width: '60px', animationDelay: `${i * 120 + 140}ms` }}
          />
        </div>
      ))}
    </div>
  );
}
