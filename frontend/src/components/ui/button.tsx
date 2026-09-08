import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    const baseStyles =
      'relative inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none';

    const variants = {
      default:
        'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs active:bg-indigo-800',
      primary:
        'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs active:bg-indigo-800',
      secondary:
        'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-xs',
      outline:
        'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs hover:border-slate-300',
      ghost:
        'hover:bg-slate-100 text-slate-600 hover:text-slate-900',
      destructive:
        'bg-rose-600 text-white hover:bg-rose-700 shadow-xs',
      link: 'text-indigo-600 underline-offset-4 hover:underline p-0 h-auto font-medium',
    };

    const sizes = {
      default: 'h-9 px-3.5 py-2 gap-2 text-xs',
      sm: 'h-8 px-2.5 text-xs gap-1.5 rounded-md',
      lg: 'h-10 px-5 text-sm gap-2.5 rounded-xl font-semibold',
      icon: 'h-8 w-8 p-0 rounded-lg',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
