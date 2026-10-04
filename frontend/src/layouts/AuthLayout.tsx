import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  QrCode,
  Printer,
} from 'lucide-react';

import { Interactive3DBackground } from '../components/auth/Interactive3DBackground';

type FilterMode = 'normal' | 'bw' | 'sepia' | 'vintage';

const FILTER_STYLES: Record<FilterMode, { filter: string; label: string }> = {
  normal: { filter: 'none', label: 'Warna Asli' },
  bw: { filter: 'grayscale(100%) contrast(115%)', label: 'B&W Klasik' },
  sepia: { filter: 'sepia(75%) contrast(105%) brightness(95%)', label: 'Warm Sepia' },
  vintage: { filter: 'sepia(30%) contrast(120%) saturate(125%)', label: 'Vintage Gold' },
};

export const AuthLayout: React.FC = () => {
  const [filterMode, setFilterMode] = useState<FilterMode>('normal');
  const [flashActive, setFlashActive] = useState(false);
  const [flashCount, setFlashCount] = useState(142);
  const [flashToast, setFlashToast] = useState<string | null>(null);

  // Realistic synthesized camera shutter click sound
  const playShutterSound = () => {
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(860, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio optional feedback
    }
  };

  const triggerCameraFlash = () => {
    playShutterSound();
    setFlashActive(true);
    setFlashCount((prev) => prev + 1);
    setFlashToast('Flash Canon EOS terpicu (1/160s f/4.0 ISO 200)');
    setTimeout(() => setFlashActive(false), 160);
    setTimeout(() => setFlashToast(null), 2400);
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#fafaf9] text-stone-900 flex flex-col justify-between font-sans selection:bg-amber-400 selection:text-stone-950 relative">
      {/* 1. Warm Studio Keylight Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(245, 158, 11, 0.08) 0%, rgba(251, 191, 36, 0.03) 45%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* 2. Precision Darkroom Calibration Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.38] z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(214, 211, 209, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(214, 211, 209, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 35%, black 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 35%, black 30%, transparent 85%)',
        }}
        aria-hidden="true"
      />

      {/* Camera Flash Screen Simulation */}
      <AnimatePresence>
        {flashActive && (
          <motion.div
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 bg-white pointer-events-none z-50"
          />
        )}
      </AnimatePresence>

      {/* Floating Flash Toast Notification */}
      <AnimatePresence>
        {flashToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-stone-950/90 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 border border-stone-800"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>{flashToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive 3D Photobooth World (Three.js Floating Prints & Parallax) */}
      <Interactive3DBackground flashActive={flashActive} />

      {/* Top Header - Clean, High-End Typography */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-stone-200/80 bg-[#fafaf9]/85 backdrop-blur-md shrink-0">
        <Link to="/" className="flex items-center gap-2.5 group cursor-pointer select-none">
          <div className="w-8 h-8 rounded-lg bg-stone-950 flex items-center justify-center text-white shadow-xs group-hover:bg-black transition-colors">
            <Camera className="w-4 h-4 group-hover:text-amber-400 transition-colors" />
          </div>
          <span className="font-heading-xl text-base font-bold tracking-tight text-stone-950">
            Snap<span className="text-amber-600">Studio</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Kiosk Aktif:</span>
            <span className="text-stone-900 font-serif italic">Kevin &amp; Astrid</span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-700 font-medium">{flashCount} Sesi Cetak</span>
          </div>

          <Link
            to="/"
            className="px-3 py-1 rounded-lg border border-stone-200 hover:border-stone-400 hover:bg-stone-100 text-stone-700 hover:text-stone-950 text-xs font-medium transition-colors bg-white shadow-2xs flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Beranda</span>
          </Link>
        </div>
      </header>

      {/* Main Container - Contained & Ergonomic */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-3 py-2 sm:px-6 lg:px-8 min-h-0 overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10 items-center my-auto">
          
          {/* Left Column: Interactive Wedding & Photobooth Experience Showcase (Desktop) */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-center space-y-3.5 pr-4">
            
            <div className="space-y-2">
              <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-stone-950 leading-snug">
                Kendali Stan Foto, Kiosk On-Site &amp;{' '}
                <span className="relative inline-block text-stone-950">
                  Cetak Seketika.
                  <svg className="absolute -bottom-1 left-0 w-full h-2 text-amber-400 pointer-events-none" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none">
                    <path d="M0,7 Q25,0 50,7 T100,7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed max-w-md">
                Solusi operasional stan foto profesional: tethering kamera Canon EOS / Sony, spooler cetak auto-cut printer DNP, dan galeri cloud instan tamu undangan.
              </p>
            </div>

            {/* Interactive Filter Preset Selector Bar */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-stone-700">
                Filter Cetak Kiosk:
              </span>
              <div className="inline-flex p-1 rounded-xl bg-stone-200/70 border border-stone-300/60 gap-1 text-[11px]">
                {(['normal', 'bw', 'sepia', 'vintage'] as FilterMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setFilterMode(mode);
                      playShutterSound();
                    }}
                    className={`relative px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      filterMode === mode
                        ? 'text-white font-semibold'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    {filterMode === mode && (
                      <motion.div
                        layoutId="activeFilterPill"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        className="absolute inset-0 bg-stone-950 rounded-lg shadow-xs -z-10"
                      />
                    )}
                    <span>{FILTER_STYLES[mode].label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Photobooth Prints Composition (3 Layered Draggable Physical Prints) */}
            <div className="relative py-2 px-1">
              {/* Soft warm backglow layer */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-200/30 via-orange-100/20 to-stone-200/25 rounded-2xl -z-10 blur-xl" />

              <div className="flex items-center justify-center relative -space-x-4 sm:-space-x-5">
                
                {/* 1. Classic Vertical 2x6 Photo Strip (Draggable & Hover Tilt) */}
                <motion.div
                  drag
                  dragConstraints={{ left: -15, right: 15, top: -10, bottom: 10 }}
                  dragElastic={0.15}
                  whileDrag={{ scale: 1.04, zIndex: 30 }}
                  initial={{ opacity: 0, y: 15, rotate: -6 }}
                  animate={{ opacity: 1, y: 0, rotate: -5 }}
                  whileHover={{ rotate: 0, y: -5, scale: 1.03, zIndex: 35 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="w-32 bg-white p-2 rounded-lg shadow-md border border-stone-200/90 relative cursor-grab active:cursor-grabbing group select-none shrink-0"
                  title="Geser strip foto untuk merasakan fisika kertas"
                >
                  {/* Real washi tape strip on top */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-9 h-3.5 bg-amber-100/90 border-t border-b border-amber-300/60 shadow-2xs rotate-1 z-20 pointer-events-none" />

                  {/* Strip Image with Interactive Live Preset Filter */}
                  <div className="rounded overflow-hidden bg-stone-100 border border-stone-200">
                    <img
                      src="/images/wedding_strip_couple.jpg"
                      alt="Wedding Photobooth Strip"
                      style={{ filter: FILTER_STYLES[filterMode].filter, transition: 'filter 0.35s ease' }}
                      className="w-full object-cover max-h-[190px] pointer-events-none"
                    />
                  </div>

                  {/* Printed souvenir caption at bottom of strip */}
                  <div className="pt-1.5 text-center">
                    <p className="font-serif italic text-[10px] font-bold text-stone-900 leading-tight">
                      Kevin &amp; Astrid
                    </p>
                    <p className="text-[8px] text-stone-400 font-mono tracking-wider uppercase mt-0.5">
                      02.10.2026
                    </p>
                  </div>
                </motion.div>

                {/* 2. Center Postcard 4R Glossy Print */}
                <motion.div
                  drag
                  dragConstraints={{ left: -15, right: 15, top: -10, bottom: 10 }}
                  dragElastic={0.15}
                  whileDrag={{ scale: 1.04, zIndex: 30 }}
                  initial={{ opacity: 0, y: 20, rotate: 0 }}
                  animate={{ opacity: 1, y: 0, rotate: 1 }}
                  whileHover={{ rotate: 0, y: -5, scale: 1.03, zIndex: 35 }}
                  transition={{ duration: 0.38, delay: 0.05, ease: 'easeOut' }}
                  className="w-36 bg-white p-2 pb-2.5 rounded-lg shadow-lg border border-stone-200/90 relative cursor-grab active:cursor-grabbing group z-10 select-none shrink-0 mt-1"
                  title="Geser cetak foto 4R untuk merasakan fisika kertas"
                >
                  <div className="aspect-[4/3] rounded overflow-hidden bg-stone-100 border border-stone-200">
                    <img
                      src="/images/wedding_postcard_candid.jpg"
                      alt="Wedding Postcard 4R Toast"
                      style={{ filter: FILTER_STYLES[filterMode].filter, transition: 'filter 0.35s ease' }}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>

                  {/* Printed caption */}
                  <div className="pt-1.5 px-0.5 flex items-center justify-between">
                    <div>
                      <p className="font-serif italic text-[10px] font-bold text-stone-900 leading-tight">
                        Celebration Toast
                      </p>
                      <p className="text-[8px] text-stone-400 font-mono">
                        Ballroom Hall
                      </p>
                    </div>
                    <span className="text-[9px] text-stone-500 font-medium font-serif italic">
                      Dye-Sub 300DPI
                    </span>
                  </div>
                </motion.div>

                {/* 3. Overlapping Vintage Wedding Polaroid */}
                <motion.div
                  drag
                  dragConstraints={{ left: -15, right: 15, top: -10, bottom: 10 }}
                  dragElastic={0.15}
                  whileDrag={{ scale: 1.04, zIndex: 30 }}
                  initial={{ opacity: 0, y: 20, rotate: 6 }}
                  animate={{ opacity: 1, y: 0, rotate: 5 }}
                  whileHover={{ rotate: 1, y: -5, scale: 1.03, zIndex: 35 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
                  className="w-36 bg-white p-2 pb-3 rounded-lg shadow-lg border border-stone-200/90 relative cursor-grab active:cursor-grabbing group z-20 select-none shrink-0 mt-4"
                  title="Geser Polaroid untuk merasakan fisika kertas"
                >
                  <div className="aspect-square rounded overflow-hidden bg-stone-100 border border-stone-200">
                    <img
                      src="/images/wedding_polaroid_guests.jpg"
                      alt="Polaroid Guests Fun Moments"
                      style={{ filter: FILTER_STYLES[filterMode].filter, transition: 'filter 0.35s ease' }}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>

                  {/* Polaroid handwritten label */}
                  <div className="pt-1.5 px-0.5 flex items-center justify-between">
                    <div>
                      <p className="font-serif italic text-[10px] font-bold text-stone-900 leading-tight">
                        Joyful Guests
                      </p>
                      <p className="text-[8px] text-stone-500 font-mono">
                        Wedding Hall
                      </p>
                    </div>
                    <div className="w-5 h-5 rounded-md bg-stone-100 flex items-center justify-center text-stone-700">
                      <QrCode className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Interactive Tactile Studio Control Modules (No AI badges) */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              {/* 1. Camera Shutter & Flash Trigger */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                onClick={triggerCameraFlash}
                className="p-3 rounded-xl border border-stone-200/90 bg-white/95 hover:border-amber-500 hover:shadow-xs transition-all text-left cursor-pointer group flex items-center justify-between"
                title="Klik untuk memicu suara shutter dan flash kamera Canon EOS"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-stone-950 text-white flex items-center justify-center group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 leading-tight text-xs">
                      Uji Shutter &amp; Flash
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5">
                      Canon EOS ({flashCount}x terpicu)
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60 group-hover:bg-amber-100 transition-colors">
                  Jepret 📸
                </span>
              </motion.button>

              {/* 2. DNP DS620 High-Speed Spooler */}
              <div className="p-3 rounded-xl border border-stone-200/90 bg-white/90 text-xs flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center shrink-0">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-stone-900 leading-tight text-xs">
                    Spooler DNP DS620
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">
                    Auto-cutter 12 detik per 2 strip
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card Container */}
          <div className="w-full lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div 
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26, mass: 0.85, delay: 0.05 }}
              className="w-full max-w-[370px] sm:max-w-[400px] bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl shadow-[0_16px_44px_-12px_rgba(28,25,23,0.12),0_2px_6px_rgba(28,25,23,0.04)] ring-1 ring-stone-900/[0.04] relative overflow-hidden my-auto"
            >
              {/* Top decorative film accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-stone-950 via-amber-400 to-stone-950" />
              <Outlet />
            </motion.div>
          </div>

        </div>
      </main>

      {/* Footer - Clean Editorial Bar */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2 border-t border-stone-200/80 bg-[#fafaf9]/90 shrink-0">
        <p className="text-[11px]">© 2026 SnapStudio Photobooth Ops. Spesialis Solusi Stan Foto Pernikahan &amp; Event.</p>
        <div className="flex items-center gap-3 text-[11px]">
          <Link to="/admin" className="hover:text-stone-950 hover:underline underline-offset-4 decoration-amber-400 transition-colors">
            Konsol Studio
          </Link>
          <span className="text-stone-300">•</span>
          <Link to="/booth/onsite" className="hover:text-stone-950 hover:underline underline-offset-4 decoration-amber-400 transition-colors">
            Kiosk On-Site
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
