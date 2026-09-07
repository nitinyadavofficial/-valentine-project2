import { cn } from '@/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ className, variant = 'text', width, height, lines = 1, ...props }: SkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={cn('card-premium p-6 space-y-4', className)} {...props}>
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="space-y-2">
            <Skeleton variant="text" width="40%" height={24} />
            <Skeleton variant="text" width="30%" height={16} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton variant="text" width="60%" height={14} />
              <Skeleton variant="text" width="100%" height={28} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'circular') {
    return <div className={cn('skeleton rounded-full', className)} style={{ width, height }} {...props} />;
  }

  if (variant === 'rectangular') {
    return <div className={cn('skeleton rounded-xl', className)} style={{ width, height }} {...props} />;
  }

  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn('skeleton rounded', i === lines - 1 && lines > 1 && 'w-3/4')}
          style={{ width: i === lines - 1 && lines > 1 ? '75%' : width, height: height || 16 }}
        />
      ))}
    </div>
  );
}

export function TrainCardSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <Skeleton variant="rectangular" width={80} height={80} className="rounded-xl bg-gradient-to-br from-primary-500 to-primary-700" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width={80} height={24} />
          </div>
          <div className="flex items-center gap-4 text-navy-500">
            <Skeleton variant="text" width={120} height={20} />
            <Skeleton variant="text" width={20} height={20} className="rounded" />
            <Skeleton variant="text" width={120} height={20} />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton variant="text" width={100} height={20} />
            <Skeleton variant="text" width={80} height={20} />
            <Skeleton variant="text" width={100} height={20} />
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton variant="text" width="60%" height={14} />
            <Skeleton variant="text" width="100%" height={20} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Skeleton variant="rectangular" width={120} height={40} />
        <Skeleton variant="rectangular" width={120} height={40} />
        <Skeleton variant="rectangular" width={120} height={40} />
      </div>
    </div>
  );
}

export function TrainListSkeleton({ count = 5 } = {}) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <TrainCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SeatMapSkeleton({ rows = 5, cols = 6 } = {}) {
  return (
    <div className="card p-6">
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: rows * cols }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={44} className="rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function BookingStepSkeleton() {
  return (
    <div className="card p-6 space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="space-y-2">
          <Skeleton variant="text" width="50%" height={20} />
          <Skeleton variant="text" width="30%" height={16} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton variant="text" width="60%" height={14} />
            <Skeleton variant="text" width="100%" height={44} className="rounded-lg" />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-2 gap-4">
            <Skeleton variant="text" width="100%" height={14} />
            <Skeleton variant="text" width="100%" height={44} className="rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}