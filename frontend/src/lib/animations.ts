import { type Variants } from 'framer-motion';

// Refined spring physics configuration
export const springTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

export const smoothTransition = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1], // Custom cubic bezier for a smooth apple/linear feel
};

// Container stagger entrance
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

// Fade in up animation for individual cards / sections
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Scale in for modals, badges, or prominent highlights
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 0.18,
      ease: 'easeOut',
    },
  },
};

// Subtle card hover effect
export const cardHover = {
  hover: {
    y: -4,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    scale: 0.99,
  },
};

// Button press physics
export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};
