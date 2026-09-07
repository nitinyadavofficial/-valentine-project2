import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-300',
      success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
      primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && <span className={cn('w-1.5 h-1.5 rounded-full', variant === 'success' && 'bg-green-500', variant === 'warning' && 'bg-amber-500', variant === 'danger' && 'bg-red-500', variant === 'info' && 'bg-cyan-500', variant === 'primary' && 'bg-primary-500', variant === 'default' && 'bg-navy-500')} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

interface StatusBadgeProps {
  status: 'RUNNING' | 'ARRIVED' | 'DEPARTED' | 'CANCELLED' | 'DELAYED' | 'ON_TIME' | 'SCHEDULED';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = {
    RUNNING: { label: 'Running', variant: 'info' as const, dot: true },
    ARRIVED: { label: 'Arrived', variant: 'success' as const },
    DEPARTED: { label: 'Departed', variant: 'primary' as const },
    CANCELLED: { label: 'Cancelled', variant: 'danger' as const },
    DELAYED: { label: 'Delayed', variant: 'warning' as const, dot: true },
    ON_TIME: { label: 'On Time', variant: 'success' as const, dot: true },
    SCHEDULED: { label: 'Scheduled', variant: 'default' as const },
  }[status];

  return <Badge variant={config.variant} size={size} dot={config.dot}>{config.label}</Badge>;
}