import * as React from 'react';
import { cn } from '../../lib/utils';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative inline-block w-full">
        <select
          ref={ref}
          className={cn(
            'flex h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-1.5 pr-8 text-xs text-slate-900 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer font-medium',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
          <span className="material-symbols-outlined text-[16px]">expand_more</span>
        </span>
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
