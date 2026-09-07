import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="label">{label}</label>}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 dark:text-navy-500 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'input',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'input-error',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 dark:text-navy-500 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
        {helperText && !error && <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-navy-500 dark:text-navy-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, InputProps & TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="label">{label}</label>}
        <textarea
          ref={ref}
          id={inputId}
          className={cn('input min-h-[100px] resize-y', error && 'input-error', className)}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
        {helperText && !error && <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-navy-500 dark:text-navy-400">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && <label htmlFor={selectId} className="label">{label}</label>}
        <select
          ref={ref}
          id={selectId}
          className={cn('input appearance-none bg-no-repeat bg-right pr-10', error && 'input-error', className)}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p id={`${selectId}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
        {helperText && !error && <p id={`${selectId}-helper`} className="mt-1.5 text-sm text-navy-500 dark:text-navy-400">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';