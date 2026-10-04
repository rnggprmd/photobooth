import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Printer,
  QrCode,
  Check,
  Volume2,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FilterOption {
  id: string;
  name: string;
  css: string;
  badge: string;
}

const FILTERS: FilterOption[] = [
  { id: 'natural', name: 'Natural TrueColor', css: 'none', badge: 'TrueColor' },
  { id: 'vintage', name: 'Kodak Portra Warmth', css: 'sepia(0.28) contrast(1.08) saturate(1.18)', badge: 'Portra' },
  { id: 'mono', name: 'Ilford B&W Film', css: 'grayscale(1) contrast(1.22) brightness(0.96)', badge: 'B&W Film' },
  { id: 'pastel', name: 'Soft Velvet Pastel', css: 'brightness(1.04) contrast(1.04) saturate(1.25) hue-rotate(-8deg)', badge: 'Velvet' },
];

const CAMERA_PRESETS = [
  { label: '50mm f/1.8 • 1/160s • ISO 200 • sRGB 300DPI', name: 'Studio Portrait (50mm)' },
  { label: '35mm f/2.0 • 1/200s • ISO 100 • sRGB 300DPI', name: 'Group Wide (35mm)' },
  { label: '85mm f/1.4 • 1/250s • ISO 400 • sRGB 300DPI', name: 'Bokeh Tight (85mm)' },
];

interface InteractiveKioskSimulatorProps {
  onFlashTrigger?: () => void;
}

export const InteractiveKioskSimulator: React.FC<InteractiveKioskSimulatorProps> = ({ onFlashTrigger }) => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>(FILTERS[0]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [printEjected, setPrintEjected] = useState(true);
  const [shotCount, setShotCount] = useState(1);
  const [eventName, setEventName] = useState('SARAH & DIMAS WEDDING');
  const [eventDate] = useState('24.10.2026 • GRAND BALLROOM');
  const [showQrModal, setShowQrModal] = useState(false);
  const [printFormat, setPrintFormat] = useState<'strip' | 'postcard'>('strip');
  const [soundMuted, setSoundMuted] = useState(false);
  const [cameraPresetIdx, setCameraPresetIdx] = useState(0);

  // Web Audio Camera Shutter & Beep Synthesis
  const playBeep = (freq = 880, duration = 0.08) => {
    if (soundMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext not allowed or not supported
    }
  };

  const playShutterSound = () => {
    if (soundMuted) return;
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.([40, 25, 70]);
      }

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
      }

      // Shutter click 1
      const noise1 = ctx.createBufferSource();
      noise1.buffer = buffer;
      const filter1 = ctx.createBiquadFilter();
      filter1.type = 'bandpass';
      filter1.frequency.value = 1400;
      const gain1 = ctx.createGain();
      gain1.gain.setValueAtTime(0.35, ctx.currentTime);
      noise1.connect(filter1);
      filter1.connect(gain1);
      gain1.connect(ctx.destination);
      noise1.start(ctx.currentTime);

      // Shutter click 2 (rebound)
      const noise2 = ctx.createBufferSource();
      noise2.buffer = buffer;
      const filter2 = ctx.createBiquadFilter();
      filter2.type = 'bandpass';
      filter2.frequency.value = 1000;
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.28, ctx.currentTime + 0.055);
      noise2.connect(filter2);
      filter2.connect(gain2);
      gain2.connect(ctx.destination);
      noise2.start(ctx.currentTime + 0.055);
    } catch {
      // AudioContext fallback
    }
  };

  // Trigger Snap Action
  const handleSnap = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setPrintEjected(false);

    let count = 3;
    setCountdown(count);
    playBeep(660, 0.09);

    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        playBeep(660, 0.09);
      } else {
        clearInterval(interval);
        setCountdown(null);
        playBeep(1320, 0.16);

        // Flash and camera shutter
        setFlashActive(true);
        if (onFlashTrigger) onFlashTrigger();
        playShutterSound();

        setTimeout(() => {
          setFlashActive(false);
          setShotCount((prev) => (prev % 4) + 1);
          setIsCapturing(false);

          // Eject printed photo strip with physical delay
          setTimeout(() => {
            setPrintEjected(true);
            try {
              confetti({
                particleCount: 28,
                spread: 45,
                origin: { y: 0.72, x: 0.75 },
                colors: ['#3b82f6', '#f59e0b', '#10b981'],
              });
            } catch {
              // Confetti fallback
            }
          }, 350);
        }, 320);
      }
    }, 700);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-stone-200/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)] p-4 sm:p-6 lg:p-7 relative overflow-hidden">
      {/* Terminal Title Bar - Precision Single-Row Across Breakpoints */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-stone-100 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-mono text-stone-700 font-semibold text-[10.5px] sm:text-xs truncate">
            kiosk://ballroom-01.snapstudio.id
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="font-mono text-[11px] text-stone-500 hidden md:inline">
            Canon EOS R6 II · DNP DS620 · 482 Lembar
          </span>
          <button
            type="button"
            onClick={() => setSoundMuted(!soundMuted)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-[10px] font-semibold transition-colors cursor-pointer border border-stone-200 shrink-0"
            title={soundMuted ? 'Nyalakan Efek Suara Kamera' : 'Matikan Suara'}
          >
            {soundMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span>{soundMuted ? 'MUTE' : 'AUDIO ON'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Viewfinder (7 cols) + Right Print Output Simulator (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT: Live Touch Viewfinder Screen */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-stone-950 border border-stone-800 relative overflow-hidden min-h-[360px] sm:min-h-[440px] shadow-inner p-3.5 sm:p-4">
          
          {/* Camera Flash Overlay */}
          <AnimatePresence>
            {flashActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 bg-white z-40 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Active Live Video Stream Image */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <img
              src="/images/wedding_strip_couple.jpg"
              alt="Live Camera Viewfinder Feed"
              style={{ filter: activeFilter.css }}
              className="w-full h-full object-cover transition-all duration-300 transform scale-105"
            />
            {/* Viewfinder Vignette & Studio Lighting Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-stone-950/45 pointer-events-none" />
          </div>

          {/* Top Viewfinder HUD */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setShotCount((c) => (c % 4) + 1);
                playBeep(720, 0.04);
              }}
              title="Ketuk untuk ganti frame foto"
              className="px-3 py-1.5 rounded-full bg-stone-900/90 backdrop-blur-md text-white text-[11px] font-semibold border border-white/15 flex items-center gap-2 shadow-sm hover:border-amber-400/50 transition-colors cursor-pointer select-none"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>
                FRAME <span className="text-amber-400 font-bold">{shotCount}</span> / 4
              </span>
            </button>

            {/* Quick Format Switcher Pill inside HUD */}
            <div className="flex items-center gap-1 bg-stone-900/90 backdrop-blur-md p-1 rounded-full border border-white/15">
              <button
                type="button"
                onClick={() => {
                  setPrintFormat('strip');
                  playBeep(640, 0.05);
                }}
                className={`min-h-7 px-2.5 py-0.5 rounded-full text-[10px] font-mono transition-colors cursor-pointer ${
                  printFormat === 'strip' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
                }`}
              >
                2x6 Strip
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrintFormat('postcard');
                  playBeep(640, 0.05);
                }}
                className={`min-h-7 px-2.5 py-0.5 rounded-full text-[10px] font-mono transition-colors cursor-pointer ${
                  printFormat === 'postcard' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
                }`}
              >
                4x6 Card
              </button>
            </div>

            <div className="hidden sm:flex px-3 py-1.5 rounded-full bg-stone-900/90 backdrop-blur-md text-white/90 font-mono text-[11px] border border-white/15 items-center gap-1.5 shadow-sm">
              <span className="text-stone-400">Shutter:</span>
              <span className="text-amber-300 font-bold">
                {countdown !== null ? `0${countdown}s` : 'Ready'}
              </span>
            </div>
          </div>

          {/* Center Dynamic Crosshairs / AF Grid with Animated Countdown */}
          <div className="relative z-10 flex flex-col items-center justify-center self-center my-auto pointer-events-none select-none py-4">
            {countdown !== null ? (
              <motion.div
                key={countdown}
                initial={{ scale: 1.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="w-24 h-24 rounded-full bg-stone-900/90 border-2 border-amber-400 flex flex-col items-center justify-center text-4xl font-extrabold text-amber-300 shadow-2xl backdrop-blur-md"
              >
                <span>{countdown}</span>
                <span className="text-[9px] font-mono text-amber-200 uppercase tracking-widest -mt-1">
                  Bersiap!
                </span>
              </motion.div>
            ) : (
              <div className="w-24 sm:w-28 h-24 sm:h-28 border border-white/40 rounded-2xl flex items-center justify-center relative">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
                <span className="absolute -top-3 text-[9px] font-mono text-white/90 bg-stone-900/80 px-2 py-0.5 rounded border border-white/15">
                  EYE AF • CANON DUAL PIXEL
                </span>
                {/* 4 Corner Bracket accents */}
                <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-white/80" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-white/80" />
                <span className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-white/80" />
                <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-white/80" />
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setCameraPresetIdx((prev) => (prev + 1) % CAMERA_PRESETS.length);
                playBeep(920, 0.05);
              }}
              title="Ketuk untuk ganti profil lensa kamera"
              className="mt-3 text-[10px] font-mono text-white/90 hover:text-amber-300 bg-stone-900/90 hover:bg-stone-900 px-3 py-1 rounded-full border border-white/15 hover:border-amber-400/50 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span>{CAMERA_PRESETS[cameraPresetIdx].label}</span>
            </button>
          </div>

          {/* Bottom Viewfinder Touch Controls Bar */}
          <div className="relative z-10 bg-stone-900/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border border-white/15 shadow-2xl">
            {/* Filter Selector Chips with Thumb-Friendly Tap Targets */}
            <div className="grid grid-cols-4 gap-1 sm:gap-1.5 max-w-full">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setActiveFilter(f);
                    playBeep(520, 0.04);
                  }}
                  className={`min-h-11 px-0.5 sm:px-3 py-2 rounded-xl text-[10.5px] sm:text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
                    activeFilter.id === f.id
                      ? 'bg-amber-400 text-stone-950 font-bold shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white/90'
                  }`}
                >
                  {activeFilter.id === f.id && <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 shrink-0 hidden sm:inline" />}
                  <span className="whitespace-nowrap leading-none">{f.badge}</span>
                </button>
              ))}
            </div>

            {/* Tactile Big Shutter Button */}
            <motion.button
              type="button"
              onClick={handleSnap}
              disabled={isCapturing}
              whileHover={{ scale: isCapturing ? 1 : 1.03 }}
              whileTap={{ scale: isCapturing ? 1 : 0.95 }}
              className="min-h-11 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(245,158,11,0.4)] transition-all cursor-pointer disabled:opacity-60 shrink-0"
            >
              <Camera className="w-4 h-4 text-stone-950" />
              <span>{isCapturing ? 'Menjepret...' : 'Snap Foto Test'}</span>
            </motion.button>
          </div>
        </div>

        {/* RIGHT: DNP Physical Printer Eject & Live Strip Mockup */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-stone-50 rounded-2xl border border-stone-200/90 p-4 relative">
          
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-200/80 gap-2">
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 truncate">
                  <Printer className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>DNP DS620A Eject Simulator</span>
                </h4>
                <p className="text-[10px] text-stone-500 truncate">Cetak dye-sublimation 8.2 detik tanpa noda tinta</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setPrintEjected(false);
                    playBeep(800, 0.06);
                    setTimeout(() => {
                      setPrintEjected(true);
                      try {
                        confetti({
                          particleCount: 22,
                          spread: 40,
                          origin: { y: 0.72, x: 0.75 },
                          colors: ['#3b82f6', '#f59e0b', '#10b981'],
                        });
                      } catch {
                        // Confetti fallback
                      }
                    }, 300);
                  }}
                  className="text-[10px] font-mono bg-white hover:bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full border border-stone-300 transition-colors cursor-pointer shadow-2xs"
                  title="Keluarkan ulang strip cetak fisik"
                >
                  Reprint ↺
                </button>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Online
                </span>
              </div>
            </div>

            {/* Live Editable Text Input for Frame Event Name (Mobile Safe 16px Font on Focus) */}
            <div className="space-y-1.5 mb-3 bg-white p-3 rounded-xl border border-stone-200">
              <label className="block text-[11px] font-semibold text-stone-800">
                Ubah Nama Event (Live Preview di Kertas):
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Contoh: SARAH & DIMAS WEDDING"
                className="w-full min-h-11 px-3 py-2 text-base sm:text-xs rounded-lg border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 bg-stone-50/60 font-sans"
              />
            </div>
          </div>

          {/* Virtual Printer Ejection Slot & Sliding Strip */}
          <div className="relative py-2 flex flex-col items-center">
            {/* Realistic Printer Slot Opening */}
            <div className="w-52 h-3.5 bg-stone-900 rounded-t-md shadow-inner relative z-20 border-b border-stone-700 flex items-center justify-center">
              <div className="w-44 h-1 bg-black rounded-full" />
            </div>

            {/* Photo Strip Sliding Out */}
            <AnimatePresence>
              {printEjected && (
                <motion.div
                  initial={{ y: -60, opacity: 0, scale: 0.94 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  className={`bg-white p-2.5 rounded-b-xl shadow-xl border-x border-b border-stone-200 relative z-10 flex flex-col gap-1.5 transition-all ${
                    printFormat === 'strip' ? 'w-44 sm:w-48' : 'w-56 sm:w-60'
                  }`}
                >
                  {printFormat === 'strip' ? (
                    <>
                      {/* Photo 1 */}
                      <div className="h-16 sm:h-18 rounded overflow-hidden bg-stone-100 border border-stone-200/60 shadow-2xs">
                        <img
                          src="/images/wedding_strip_couple.jpg"
                          alt="Photo slot 1"
                          style={{ filter: activeFilter.css }}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Photo 2 */}
                      <div className="h-16 sm:h-18 rounded overflow-hidden bg-stone-100 border border-stone-200/60 shadow-2xs">
                        <img
                          src="/images/wedding_bouquet_laugh.jpg"
                          alt="Photo slot 2"
                          style={{ filter: activeFilter.css }}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Photo 3 */}
                      <div className="h-16 sm:h-18 rounded overflow-hidden bg-stone-100 border border-stone-200/60 shadow-2xs">
                        <img
                          src="/images/wedding_polaroid_guests.jpg"
                          alt="Photo slot 3"
                          style={{ filter: activeFilter.css }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-1">
                      <div className="h-16 rounded overflow-hidden bg-stone-100 border border-stone-200/60">
                        <img src="/images/wedding_strip_couple.jpg" alt="P1" style={{ filter: activeFilter.css }} className="w-full h-full object-cover" />
                      </div>
                      <div className="h-16 rounded overflow-hidden bg-stone-100 border border-stone-200/60">
                        <img src="/images/wedding_bouquet_laugh.jpg" alt="P2" style={{ filter: activeFilter.css }} className="w-full h-full object-cover" />
                      </div>
                      <div className="h-16 rounded overflow-hidden bg-stone-100 border border-stone-200/60">
                        <img src="/images/wedding_postcard_candid.jpg" alt="P3" style={{ filter: activeFilter.css }} className="w-full h-full object-cover" />
                      </div>
                      <div className="h-16 rounded overflow-hidden bg-stone-100 border border-stone-200/60">
                        <img src="/images/wedding_polaroid_guests.jpg" alt="P4" style={{ filter: activeFilter.css }} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  {/* Dynamic Event Footer on Strip */}
                  <div className="pt-2 pb-1 border-t border-stone-100 text-center">
                    <p className="font-heading-xl text-[10px] sm:text-[11px] font-bold text-stone-900 tracking-wider truncate uppercase">
                      {eventName || 'SNAPSTUDIO EVENT'}
                    </p>
                    <p className="font-mono text-[8px] text-stone-500 mt-0.5">
                      {eventDate} • SNAPSTUDIO.ID
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Instant QR Guest Download Simulator Pill */}
          <div className="mt-3 pt-3 border-t border-stone-200/80">
            <button
              type="button"
              onClick={() => setShowQrModal(!showQrModal)}
              className="w-full min-h-11 p-2.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 flex items-center justify-between text-left transition-colors cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 leading-tight">
                    QR Galeri Tamu Instan
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Scan untuk coba download ke smartphone
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-amber-700 underline underline-offset-2">
                {showQrModal ? 'Tutup' : 'Coba scan'}
              </span>
            </button>

            {/* QR Mockup expansion */}
            <AnimatePresence>
              {showQrModal && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2.5 p-3.5 bg-white rounded-xl border border-stone-200 text-center space-y-2.5 overflow-hidden"
                >
                  <div className="w-32 h-32 mx-auto bg-stone-100 p-2 rounded-xl border border-stone-200 flex items-center justify-center">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://snapstudio.id/gallery/demo"
                      alt="Guest QR Code Demo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-stone-600">
                    Arahkan kamera HP Anda untuk melihat tampilan galeri web tamu tanpa unduh aplikasi.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
};

