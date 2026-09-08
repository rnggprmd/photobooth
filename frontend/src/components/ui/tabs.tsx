import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  tabGroupId: string;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, value, onValueChange, className, children, ...props }, ref) => {
    const [currentValue, setCurrentValue] = React.useState<string>(
      value || defaultValue || ''
    );
    const tabGroupId = React.useId();

    React.useEffect(() => {
      if (value !== undefined) {
        setCurrentValue(value);
      }
    }, [value]);

    const handleValueChange = (val: string) => {
      if (value === undefined) {
        setCurrentValue(val);
      }
      onValueChange?.(val);
    };

    return (
      <TabsContext.Provider
        value={{ value: currentValue, onValueChange: handleValueChange, tabGroupId }}
      >
        <div ref={ref} className={cn('w-full', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative inline-flex h-10 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-600 border border-slate-200/80 gap-1',
      className
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    const isSelected = context?.value === value;

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => context?.onValueChange(value)}
        className={cn(
          'relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          isSelected
            ? 'text-slate-900 font-semibold'
            : 'text-slate-600 hover:text-slate-900',
          className
        )}
        {...props}
      >
        {isSelected && (
          <motion.div
            layoutId={`active-tab-${context?.tabGroupId}`}
            className="absolute inset-0 z-[-1] rounded-md bg-white shadow-xs border border-slate-200/70"
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
          />
        )}
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (context?.value !== value) return null;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={cn('mt-5 focus-visible:outline-none', className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
