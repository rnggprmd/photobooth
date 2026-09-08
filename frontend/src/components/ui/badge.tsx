import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'danger'
    | 'outline'
    | 'success'
    | 'warning'
    | 'info'
    | 'indigo'
    | 'tertiary';
  pulse?: boolean;
}

function Badge({ className, variant = 'default', pulse, children, ...props }: BadgeProps) {
  const baseStyles =
    'relative inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-all select-none border';

  const variants = {
    default:
      'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    indigo:
      'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    secondary:
      'bg-slate-100 text-slate-700 border-slate-200/80',
    destructive:
      'bg-rose-50 text-rose-700 border-rose-200/80',
    danger:
      'bg-rose-50 text-rose-700 border-rose-200/80',
    outline:
      'text-slate-700 border-slate-200 bg-white/90',
    success:
      'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning:
      'bg-amber-50 text-amber-700 border-amber-200/80',
    info:
      'bg-sky-50 text-sky-700 border-sky-200/80',
    tertiary:
      'bg-sky-50 text-sky-700 border-sky-200/80',
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {children}
    </div>
  );
}

export { Badge };
