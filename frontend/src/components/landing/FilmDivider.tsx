import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface FilmDividerProps {
  frame: string;
  label: string;
  tone?: 'light' | 'dark';
}

// A strip of sprocket holes that drifts sideways as the page scrolls past it.
// It marks the hand-off between sections like frame numbers on a film roll.
export const FilmDivider: React.FC<FilmDividerProps> = ({ frame, label, tone = 'light' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0px', '-96px']);

  const dark = tone === 'dark';

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`relative w-full overflow-hidden select-none ${dark ? 'bg-stone-950' : 'bg-stone-900'} border-y ${
        dark ? 'border-stone-800' : 'border-stone-800'
      }`}
    >
      <motion.div
        style={reduceMotion ? undefined : { x }}
        className="flex items-center gap-4 h-9 sm:h-10 w-[calc(100%+96px)] px-4"
      >
        {Array.from({ length: 60 }).map((_, i) => (
          <span key={i} className="shrink-0 w-3.5 h-2.5 rounded-[2px] bg-stone-700/70" />
        ))}
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="px-3 py-0.5 bg-stone-950 text-[10px] sm:text-[11px] font-mono tracking-wider text-amber-400">
          {frame} <span className="text-stone-500">/</span> {label}
        </span>
      </div>
    </div>
  );
};
