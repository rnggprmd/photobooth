import React, { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  className?: string;
  prefix?: string;
}

/** Tweens between values so the figure visibly responds to the sliders. */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, className, prefix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const last = useRef(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(last.current, value, {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = prefix + Math.round(v).toLocaleString('id-ID');
      },
    });
    last.current = value;
    return () => controls.stop();
  }, [value, prefix]);

  return (
    <span ref={ref} className={className}>
      {prefix + value.toLocaleString('id-ID')}
    </span>
  );
};
