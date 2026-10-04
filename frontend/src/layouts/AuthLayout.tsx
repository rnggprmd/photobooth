import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  QrCode,
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

  const triggerCameraFlash = () => {
    setFlashActive(true);
    setFlashCount((prev) => prev + 1);
    setFlashToast('Flash Canon EOS Speedlite terpicu (1/160s f/4.0 ISO 200)');
    setTimeout(() => setFlashActive(false), 160);
    setTimeout(() => setFlashToast(null), 3000);
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-white text-slate-900 flex flex-col justify-between font-sans selection:bg-indigo-600 selection:text-white relative">
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
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 border border-slate-700/60"
          >
            <span>{flashToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive 3D Photobooth World (Three.js Floating Prints & Parallax) */}
      <Interactive3DBackground flashActive={flashActive} />

      {/* Top Header - Clean Brand & Single-Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between border-b border-stone-200/90 bg-white/90 backdrop-blur-md shrink-0">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center text-white shadow-xs group-hover:bg-black transition-colors">
            <Camera className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900">SnapStudio</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-stone-50 border border-stone-200 text-xs text-slate-600 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-slate-800">Wedding Live:</span>
            <span className="text-slate-600 font-serif italic">Kevin &amp; Astrid</span>
            <span className="text-stone-300">•</span>
            <span className="text-[11px] font-mono font-semibold text-stone-700">{flashCount} Sesi Cetak</span>
          </div>

          <Link
            to="/"
            className="px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-100/80 text-slate-700 text-xs font-medium transition-colors bg-white shadow-2xs"
          >
            Landing Page
          </Link>
        </div>
      </header>

      {/* Main Container - Responsive contained */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-3 py-2 sm:px-6 lg:px-8 min-h-0 overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10 items-center my-auto">
          
          {/* Left Column: Interactive Wedding & Photobooth Experience Showcase (Desktop) */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-center space-y-3 pr-4">
            <div className="space-y-1.5">
              <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-slate-900 leading-snug">
                Abadikan Setiap Senyum &amp; Momen Bahagia di Hari Istimewa.
              </h1>
              <p className="text-slate-600 text-xs leading-relaxed max-w-md">
                Solusi cetak strip foto kilat, live kiosk kamera Canon EOS, kustomisasi bingkai pernikahan, dan distribusi galeri instan via QR code para tamu.
              </p>
            </div>

            {/* Interactive Filter Preset Selector Bar - Clean Typography */}
            <div className="flex items-center justify-between px-1 pt-1">
              <span className="text-[11px] font-semibold text-slate-700">
                Preset Filter Kiosk:
              </span>
              <div className="inline-flex p-0.5 rounded-lg bg-stone-200/70 border border-stone-300/70 text-[10px]">
                {(['normal', 'bw', 'sepia', 'vintage'] as FilterMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFilterMode(mode)}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                      filterMode === mode
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {FILTER_STYLES[mode].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Photobooth Prints Composition (3 Layered Draggable Prints with Spring Physics) */}
            <div className="relative py-2 px-1">
              {/* Backglow layer */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-100/40 via-rose-100/30 to-indigo-100/30 rounded-2xl -z-10 blur-xl" />

              <div className="flex items-center justify-center relative -space-x-4 sm:-space-x-5">
                
                {/* 1. Classic Vertical 2x6 Photo Strip (Draggable & Hover Tilt) */}
                <motion.div
                  drag
                  dragConstraints={{ left: -15, right: 15, top: -10, bottom: 10 }}
                  dragElastic={0.15}
                  whileDrag={{ scale: 1.04, zIndex: 30 }}
                  initial={{ opacity: 0, y: 15, rotate: -6 }}
                  animate={{ opacity: 1, y: 0, rotate: -5 }}
                  whileHover={{ rotate: 0, y: -4, scale: 1.03, zIndex: 35 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="w-32 bg-white p-2 rounded-lg shadow-md border border-stone-200/90 relative cursor-grab active:cursor-grabbing group select-none shrink-0"
                  title="Geser strip foto untuk merasakan fisika kertas"
                >
                  {/* Tape strip on top */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-9 h-3.5 bg-amber-100/80 border-t border-b border-amber-200/60 shadow-2xs rotate-1 z-20 pointer-events-none" />

                  {/* Strip Image with Interactive Live Preset Filter */}
                  <div className="rounded overflow-hidden bg-stone-100 border border-stone-200">
                    <img
                      src="/images/wedding_strip_couple.jpg"
                      alt="Wedding Photobooth Strip"
                      style={{ filter: FILTER_STYLES[filterMode].filter, transition: 'filter 0.35s ease' }}
                      className="w-full object-cover max-h-[190px] pointer-events-none"
                    />
                  </div>

                  {/* Printed caption at bottom of strip */}
                  <div className="pt-1 text-center">
                    <p className="font-serif italic text-[10px] font-bold text-slate-800 leading-tight">
                      Kevin &amp; Astrid
                    </p>
                    <p className="text-[8px] text-slate-400 font-mono tracking-wider uppercase">
                      02.10.2026
                    </p>
                  </div>

                  {/* Badge floating - Clean Text */}
                  <div className="absolute -bottom-2 -left-1.5 bg-slate-900 text-white text-[8px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                    Strip 2x6
                  </div>
                </motion.div>

                {/* 2. Center Postcard 4R Glossy Print (New 3rd Print) */}
                <motion.div
                  drag
                  dragConstraints={{ left: -15, right: 15, top: -10, bottom: 10 }}
                  dragElastic={0.15}
                  whileDrag={{ scale: 1.04, zIndex: 30 }}
                  initial={{ opacity: 0, y: 20, rotate: 0 }}
                  animate={{ opacity: 1, y: 0, rotate: 1 }}
                  whileHover={{ rotate: 0, y: -4, scale: 1.03, zIndex: 35 }}
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
                      <p className="font-serif italic text-[10px] font-bold text-slate-900 leading-tight">
                        Celebration Toast
                      </p>
                      <p className="text-[8px] text-slate-400 font-mono">
                        Ballroom Hall
                      </p>
                    </div>
                    <span className="text-[8px] font-semibold text-indigo-700 bg-indigo-50 px-1 py-0.2 rounded border border-indigo-200">
                      Cetak 4R
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
                  whileHover={{ rotate: 1, y: -4, scale: 1.03, zIndex: 35 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
                  className="w-36 bg-white p-2 pb-2.5 rounded-lg shadow-lg border border-stone-200/90 relative cursor-grab active:cursor-grabbing group z-20 select-none shrink-0 mt-4"
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

                  {/* Polaroid handwritten style label - Clean */}
                  <div className="pt-1.5 px-0.5 flex items-center justify-between">
                    <div>
                      <p className="font-serif italic text-[10px] font-bold text-slate-900 leading-tight">
                        Joyful Guests
                      </p>
                      <p className="text-[8px] text-rose-600 font-medium">
                        Wedding Reception
                      </p>
                    </div>
                    <div className="w-5 h-5 rounded-md bg-stone-100 flex items-center justify-center text-slate-700">
                      <QrCode className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Badge floating - Clean Text */}
                  <div className="absolute -top-2 -right-1 bg-emerald-600 text-white text-[8px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                    Scan QR Tamu
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Feature Highlights & Interactive Camera Shutter Test - 3 Cards */}
            <div className="grid grid-cols-3 gap-2 text-xs pt-0.5">
              <div className="p-2 sm:p-2.5 rounded-xl border border-stone-200 bg-white/90 shadow-2xs">
                <div className="font-semibold text-slate-800 mb-0.5 text-[11px]">
                  Cetak Kilat 12s
                </div>
                <p className="text-slate-500 text-[9.5px] leading-relaxed">
                  Spooler printer DNP DS620 dengan auto-cutter strip rapi.
                </p>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                onClick={triggerCameraFlash}
                className="p-2 sm:p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50/50 transition-all text-left shadow-2xs cursor-pointer group"
                title="Klik untuk mensimulasikan flash kamera Canon EOS"
              >
                <div className="font-semibold text-slate-800 flex items-center justify-between mb-0.5 text-[11px]">
                  <span className="text-stone-900 font-medium">Uji Flash</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-stone-100 text-stone-700 border border-stone-300 font-semibold">
                    Tes
                  </span>
                </div>
                <p className="text-slate-500 text-[9.5px] leading-relaxed">
                  Flash speedlite Canon EOS ({flashCount}x).
                </p>
              </motion.button>

              <div className="p-2 sm:p-2.5 rounded-xl border border-stone-200 bg-white/90 shadow-2xs">
                <div className="font-semibold text-slate-800 mb-0.5 text-[11px]">
                  Galeri QR Kilat
                </div>
                <p className="text-slate-500 text-[9.5px] leading-relaxed">
                  Distribusi foto &amp; GIF instan ke smartphone para tamu.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card Container */}
          <div className="w-full lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div 
              initial={{ opacity: 0, y: 28, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24, mass: 0.85, delay: 0.08 }}
              className="w-full max-w-[360px] sm:max-w-[390px] bg-white border border-stone-200/90 rounded-2xl shadow-[0_12px_36px_-10px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.02)] ring-1 ring-stone-900/[0.03] relative overflow-hidden my-auto"
            >
              <Outlet />
            </motion.div>
          </div>

        </div>
      </main>

      {/* Footer - Clean Single-Bar */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 border-t border-stone-200/90 bg-white/95 shrink-0">
        <p className="text-[11px]">© 2026 SnapStudio Photobooth Ops. Spesialis Solusi Stan Foto Pernikahan &amp; Event.</p>
        <div className="flex items-center gap-3 text-[11px]">
          <Link to="/admin" className="hover:text-stone-900 transition-colors">
            Konsol Studio
          </Link>
          <span className="text-stone-300">•</span>
          <Link to="/booth/onsite" className="hover:text-stone-900 transition-colors">
            Kiosk On-Site
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
