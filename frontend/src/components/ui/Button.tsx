import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, fullWidth, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus-visible:ring-primary-500 shadow-lg shadow-primary-500/25',
      secondary: 'bg-navy-100 text-navy-900 hover:bg-navy-200 active:bg-navy-300 dark:bg-navy-800 dark:text-navy-100 dark:hover:bg-navy-700 dark:active:bg-navy-600 focus-visible:ring-navy-500',
      outline: 'border-2 border-navy-300 text-navy-700 hover:bg-navy-100 active:bg-navy-200 dark:border-navy-600 dark:text-navy-300 dark:hover:bg-navy-800 dark:active:bg-navy-700 focus-visible:ring-navy-500',
      ghost: 'text-navy-600 hover:bg-navy-100 active:bg-navy-200 dark:text-navy-400 dark:hover:bg-navy-800 dark:active:bg-navy-700 focus-visible:ring-navy-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500 shadow-lg shadow-red-500/25',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2',
      xl: 'px-8 py-4 text-xl gap-3',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';