import React from 'react';
import { motion } from 'framer-motion';

interface WeddingBokehBackgroundProps {
  flashActive?: boolean;
}

interface BokehOrb {
  id: number;
  x: string;
  y: string;
  size: number;
  color: string;
  borderColor: string;
  duration: number;
  delay: number;
  blur: string;
  opacity: number;
}

const BOKEH_ORBS: BokehOrb[] = [
  // Upper left ambient cluster
  { id: 1, x: '8%', y: '14%', size: 90, color: 'rgba(254, 243, 199, 0.28)', borderColor: 'rgba(253, 230, 138, 0.45)', duration: 14, delay: 0, blur: 'blur-xs', opacity: 0.7 },
  { id: 2, x: '18%', y: '26%', size: 48, color: 'rgba(253, 230, 138, 0.32)', borderColor: 'rgba(251, 191, 36, 0.55)', duration: 11, delay: 2, blur: 'none', opacity: 0.8 },
  { id: 3, x: '4%', y: '42%', size: 70, color: 'rgba(254, 215, 170, 0.22)', borderColor: 'rgba(251, 146, 60, 0.35)', duration: 16, delay: 1, blur: 'blur-xs', opacity: 0.6 },
  
  // Center-left (around the photobooth prints)
  { id: 4, x: '24%', y: '68%', size: 110, color: 'rgba(254, 240, 138, 0.22)', borderColor: 'rgba(250, 204, 21, 0.4)', duration: 18, delay: 3, blur: 'blur-sm', opacity: 0.65 },
  { id: 5, x: '35%', y: '18%', size: 36, color: 'rgba(253, 224, 71, 0.35)', borderColor: 'rgba(234, 179, 8, 0.6)', duration: 9, delay: 1.5, blur: 'none', opacity: 0.85 },
  { id: 6, x: '42%', y: '82%', size: 64, color: 'rgba(254, 205, 211, 0.25)', borderColor: 'rgba(251, 113, 133, 0.35)', duration: 13, delay: 4, blur: 'blur-xs', opacity: 0.6 },
  
  // Center overhead ballroom glow
  { id: 7, x: '52%', y: '10%', size: 80, color: 'rgba(254, 249, 195, 0.35)', borderColor: 'rgba(250, 204, 21, 0.5)', duration: 15, delay: 0.5, blur: 'blur-xs', opacity: 0.75 },
  { id: 8, x: '60%', y: '30%', size: 40, color: 'rgba(253, 230, 138, 0.28)', borderColor: 'rgba(245, 158, 11, 0.5)', duration: 10, delay: 2.5, blur: 'none', opacity: 0.7 },
  
  // Right side (behind and around the auth card)
  { id: 9, x: '75%', y: '15%', size: 55, color: 'rgba(254, 243, 199, 0.3)', borderColor: 'rgba(251, 191, 36, 0.5)', duration: 12, delay: 1, blur: 'none', opacity: 0.8 },
  { id: 10, x: '92%', y: '28%', size: 125, color: 'rgba(254, 215, 170, 0.25)', borderColor: 'rgba(251, 146, 60, 0.4)', duration: 17, delay: 3.5, blur: 'blur-sm', opacity: 0.6 },
  { id: 11, x: '82%', y: '72%', size: 85, color: 'rgba(254, 240, 138, 0.26)', borderColor: 'rgba(250, 204, 21, 0.45)', duration: 14, delay: 2, blur: 'blur-xs', opacity: 0.7 },
  { id: 12, x: '94%', y: '85%', size: 50, color: 'rgba(255, 228, 230, 0.28)', borderColor: 'rgba(244, 63, 94, 0.35)', duration: 11, delay: 0.8, blur: 'none', opacity: 0.75 },
];

export const WeddingBokehBackground: React.FC<WeddingBokehBackgroundProps> = ({ flashActive = false }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Overhead Chandelier Warm Light Cone */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-5xl h-[380px] opacity-70"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 0%, rgba(254, 240, 138, 0.32), rgba(253, 230, 138, 0.14) 45%, transparent 75%)',
        }}
      />

      {/* 2. Soft Ambient Corner Glows (Champagne & Rose Gold) */}
      <div className="absolute -top-20 -left-20 w-[420px] h-[420px] bg-amber-200/25 rounded-full blur-[130px]" />
      <div className="absolute -bottom-24 -right-20 w-[460px] h-[460px] bg-rose-200/20 rounded-full blur-[140px]" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[380px] h-[380px] bg-amber-100/20 rounded-full blur-[120px]" />

      {/* 3. Draped Canopy Fairy Lights (Garland Strings across ballroom ceiling) */}
      <svg 
        className="absolute top-0 left-0 w-full h-44 opacity-80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 160"
      >
        <defs>
          <radialGradient id="fairyGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbeb" stopOpacity="1" />
            <stop offset="30%" stopColor="#fef08a" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Festoon Light Cable 1 (Upper gentle drape) */}
        <path
          d="M -20,25 Q 240,75 500,35 Q 780,85 1060,40 Q 1280,80 1460,30"
          fill="none"
          stroke="rgba(214, 211, 209, 0.45)"
          strokeWidth="1.2"
        />

        {/* Cable 1 Bulbs */}
        {[
          { cx: 80, cy: 45 },
          { cx: 180, cy: 65 },
          { cx: 280, cy: 70 },
          { cx: 380, cy: 56 },
          { cx: 480, cy: 37 },
          { cx: 580, cy: 52 },
          { cx: 680, cy: 74 },
          { cx: 780, cy: 84 },
          { cx: 880, cy: 73 },
          { cx: 980, cy: 53 },
          { cx: 1080, cy: 45 },
          { cx: 1180, cy: 63 },
          { cx: 1280, cy: 78 },
          { cx: 1380, cy: 54 },
        ].map((bulb, i) => (
          <g key={`cable1-${i}`}>
            {/* Soft bulb glow aura */}
            <circle cx={bulb.cx} cy={bulb.cy} r={flashActive ? 16 : 10} fill="url(#fairyGlow)" />
            {/* Core incandescent bulb */}
            <circle cx={bulb.cx} cy={bulb.cy} r="2.5" fill="#ffffff" />
          </g>
        ))}

        {/* Festoon Light Cable 2 (Lower sweeping drape) */}
        <path
          d="M 60,-10 Q 360,95 680,50 Q 1020,105 1380,15"
          fill="none"
          stroke="rgba(214, 211, 209, 0.35)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Cable 2 Bulbs */}
        {[
          { cx: 160, cy: 42 },
          { cx: 260, cy: 75 },
          { cx: 360, cy: 94 },
          { cx: 470, cy: 82 },
          { cx: 580, cy: 62 },
          { cx: 690, cy: 52 },
          { cx: 810, cy: 74 },
          { cx: 920, cy: 98 },
          { cx: 1030, cy: 104 },
          { cx: 1150, cy: 82 },
          { cx: 1260, cy: 52 },
        ].map((bulb, i) => (
          <g key={`cable2-${i}`}>
            <circle cx={bulb.cx} cy={bulb.cy} r={flashActive ? 14 : 8} fill="url(#fairyGlow)" />
            <circle cx={bulb.cx} cy={bulb.cy} r="2" fill="#ffffff" />
          </g>
        ))}
      </svg>

      {/* 4. Camera Lens Bokeh Discs (Realistic Aperture Rings with Spherical Highlight Rims) */}
      {BOKEH_ORBS.map((orb) => (
        <motion.div
          key={orb.id}
          initial={{ y: 0, opacity: orb.opacity }}
          animate={{
            y: [-6, 6, -6],
            opacity: flashActive ? Math.min(1, orb.opacity + 0.35) : [orb.opacity * 0.85, orb.opacity * 1.15, orb.opacity * 0.85],
            scale: flashActive ? 1.08 : 1,
          }}
          transition={{
            y: { duration: orb.duration, repeat: Infinity, ease: 'easeInOut', delay: orb.delay },
            opacity: { duration: flashActive ? 0.2 : orb.duration * 0.8, repeat: flashActive ? 0 : Infinity, ease: 'easeInOut', delay: orb.delay },
            scale: { duration: 0.2 },
          }}
          style={{
            position: 'absolute',
            left: orb.x,
            top: orb.y,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            borderRadius: '9999px',
            backgroundColor: orb.color,
            boxShadow: `inset 0 0 0 1.5px ${orb.borderColor}, 0 0 ${orb.size * 0.25}px ${orb.color}`,
          }}
          className={`${orb.blur} transition-all duration-300`}
        />
      ))}

      {/* 5. Delicate Floating Wedding Light Motes (Fairy dust) */}
      {[
        { x: '12%', y: '35%', delay: 0 },
        { x: '28%', y: '52%', delay: 1.2 },
        { x: '48%', y: '40%', delay: 2.1 },
        { x: '68%', y: '65%', delay: 0.7 },
        { x: '86%', y: '45%', delay: 1.8 },
      ].map((mote, i) => (
        <motion.div
          key={`mote-${i}`}
          animate={{
            y: [0, -12, 0],
            opacity: [0.2, 0.65, 0.2],
          }}
          transition={{
            duration: 7 + i * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: mote.delay,
          }}
          style={{ left: mote.x, top: mote.y }}
          className="absolute w-1.5 h-1.5 rounded-full bg-amber-100 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
        />
      ))}
    </div>
  );
};

export default WeddingBokehBackground;
