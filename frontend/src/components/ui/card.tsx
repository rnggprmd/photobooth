import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-xs transition-all duration-150 hover:border-slate-300 overflow-hidden',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

export interface MotionCardProps extends HTMLMotionProps<'div'> {
  hoverEffect?: boolean;
}

const MotionCard = React.forwardRef<HTMLDivElement, MotionCardProps>(
  ({ className, hoverEffect = true, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={hoverEffect ? { y: -2, transition: { duration: 0.15, ease: 'easeOut' } } : undefined}
      className={cn(
        'relative rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-150 overflow-hidden',
        className
      )}
      {...props}
    />
  )
);
MotionCard.displayName = 'MotionCard';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-sm font-bold leading-tight tracking-tight text-slate-900',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs text-slate-500 leading-relaxed', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, MotionCard, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
