import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  Smartphone,
  Camera,
  Printer,
  Database,
  ArrowRight,
  Sparkles,
  Share2,
  Download,
  RotateCcw,
  CheckCircle2,
  Globe,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DualCaptureShowcase: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'onsite' | 'virtual'>('onsite');

  // --- KIOSK ON-SITE STATE ---
  const [shutterState, setShutterState] = useState<'idle' | 'flashing' | 'spooling' | 'printed'>('idle');
  const [shutterLatency, setShutterLatency] = useState(32);
  const [kioskPhotoCount, setKioskPhotoCount] = useState(482);
  const [spoolerStep, setSpoolerStep] = useState<string>('Standby');
  const [selectedIso, setSelectedIso] = useState<number>(400);
  const [activeSpec, setActiveSpec] = useState<'tether' | 'spool' | 'buffer'>('tether');

  const SPEC_READOUT = {
    tether: { tag: 'USB PTP', text: 'Link kamera aktif. Reconnect otomatis kalau kabel tersenggol.' },
    spool: { tag: 'SPOOLER', text: 'Antrean cetak langsung ke printer. Duplikasi dicegah saat kertas habis.' },
    buffer: { tag: 'OFFLINE', text: 'Foto masuk SSD lokal dulu, lalu sinkron ke cloud begitu WiFi pulih.' },
  } as const;

  // Gentle synthetic camera shutter click
  const playShutterSound = () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.([40, 25, 70]);
      }

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // AudioContext blocked or not supported
    }
  };

  const handleTriggerKioskShutter = () => {
    if (shutterState !== 'idle' && shutterState !== 'printed') return;

    playShutterSound();
    setShutterState('flashing');
    setSpoolerStep('Memicu shutter kamera via USB PTP...');

    // Flash phase
    setTimeout(() => {
      const newLatency = Math.floor(Math.random() * 8) + 26; // 26 - 33ms
      setShutterLatency(newLatency);
      setShutterState('spooling');
      setSpoolerStep('Mengirim layout strip 2x6 ke DNP DS620...');

      // Spooling phase
      setTimeout(() => {
        setShutterState('printed');
        setKioskPhotoCount((prev) => prev - 1);
        setSpoolerStep('Cetak fisik selesai (8.2s). QR galeri siap!');
        try {
          confetti({
            particleCount: 22,
            spread: 50,
            origin: { y: 0.65, x: 0.72 },
            colors: ['#f59e0b', '#10b981', '#3b82f6'],
          });
        } catch {
          // fallback
        }
      }, 1600);
    }, 280);
  };

  const handleResetKiosk = () => {
    setShutterState('idle');
    setSpoolerStep('Standby');
  };

  // --- VIRTUAL WEB BOOTH STATE ---
  const [selectedFilter, setSelectedFilter] = useState<'portra' | 'fuji' | 'mono' | 'vintage'>('portra');
  const [selectedWatermark, setSelectedWatermark] = useState<'wedding' | 'corporate' | 'neon'>('wedding');
  const [webCaptureState, setWebCaptureState] = useState<'idle' | 'countdown' | 'flashing' | 'captured'>('idle');
  const [countdownVal, setCountdownVal] = useState(3);
  const [whatsappToast, setWhatsappToast] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);

  const WEB_FILTERS = [
    {
      id: 'portra' as const,
      label: 'Portra Warm',
      swatch: 'bg-gradient-to-tr from-amber-600 to-amber-300',
      filterStyle: 'contrast(106%) saturate(125%) sepia(12%)',
    },
    {
      id: 'fuji' as const,
      label: 'Fuji Chrome',
      swatch: 'bg-gradient-to-tr from-emerald-600 to-teal-300',
      filterStyle: 'contrast(114%) saturate(130%) hue-rotate(-6deg)',
    },
    {
      id: 'mono' as const,
      label: 'B&W Editorial',
      swatch: 'bg-gradient-to-tr from-stone-900 to-stone-400',
      filterStyle: 'grayscale(100%) contrast(125%) brightness(96%)',
    },
    {
      id: 'vintage' as const,
      label: 'Retro Sepia',
      swatch: 'bg-gradient-to-tr from-yellow-700 to-amber-400',
      filterStyle: 'sepia(45%) contrast(108%) brightness(95%) saturate(110%)',
    },
  ];

  const handleStartWebCountdown = () => {
    if (webCaptureState !== 'idle' && webCaptureState !== 'captured') return;

    setWebCaptureState('countdown');
    setCountdownVal(3);

    setTimeout(() => {
      setCountdownVal(2);
      setTimeout(() => {
        setCountdownVal(1);
        setTimeout(() => {
          playShutterSound();
          setWebCaptureState('flashing');
          setTimeout(() => {
            setWebCaptureState('captured');
            try {
              confetti({
                particleCount: 26,
                spread: 45,
                origin: { y: 0.65, x: 0.65 },
                colors: ['#6366f1', '#ec4899', '#f59e0b'],
              });
            } catch {
              // fallback
            }
          }, 240);
        }, 600);
      }, 600);
    }, 600);
  };

  const handleSendWhatsappSimulation = () => {
    setWhatsappToast(true);
    setTimeout(() => setWhatsappToast(false), 3200);
  };

  const handleDownloadHd = () => {
    setDownloadSuccessToast(true);
    setTimeout(() => setDownloadSuccessToast(false), 3000);
  };

  return (
    <section id="dual-capture" className="w-full py-16 lg:py-24 border-b border-stone-200/80 bg-[#fafaf9] relative scroll-mt-16">
      <span id="architecture" className="absolute -top-20" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Editorial Section Header: asymmetric split */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-16 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-5 items-start max-w-2xl"
          >
            {/* Amber accent bar — marks the section's hardware identity */}
            <div className="hidden sm:flex flex-col items-center gap-1 pt-2 shrink-0">
              <div className="w-[3px] h-10 bg-amber-400 rounded-full" />
              <div className="w-[3px] h-3 bg-amber-200 rounded-full" />
            </div>
            <div>
              <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-widest text-amber-600 mb-2">
                Arsitektur Dual Capture
              </span>
              <h2 className="font-heading-xl text-3xl sm:text-5xl font-extrabold text-stone-950 tracking-tight leading-[1.08]">
                Booth fisik di venue, atau booth di ponsel tamu.
              </h2>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-sm lg:text-right shrink-0"
          >
            Kiosk hardware dengan kamera DSLR dan printer dye-sub untuk cetak kilat. Atau buka tautan web photobooth agar tamu bisa memotret dari ponsel tanpa antrean.
          </motion.p>
        </div>

        {/* Mode Switcher with spring-animated active pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-10"
        >
          {/* Option 1: On-Site */}
          <button
            type="button"
            onClick={() => setActiveMode('onsite')}
            className={`min-h-12 text-left p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
              activeMode === 'onsite'
                ? 'bg-stone-900 border-stone-900 text-white shadow-md'
                : 'bg-white border-stone-200/90 text-stone-700 hover:border-stone-400 hover:bg-stone-50/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  activeMode === 'onsite'
                    ? 'bg-amber-400 text-stone-950'
                    : 'bg-stone-100 text-stone-700 group-hover:bg-stone-200'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <span className={`block text-xs font-bold ${activeMode === 'onsite' ? 'text-white' : 'text-stone-900'}`}>
                  Kiosk On-Site (Hardware)
                </span>
                <span className={`block text-[11px] ${activeMode === 'onsite' ? 'text-stone-300' : 'text-stone-500'}`}>
                  DSLR USB &bull; Dye-Sub 8 Detik &bull; Offline
                </span>
              </div>
            </div>
            <div className="shrink-0 pl-2">
              <span
                className={`inline-block w-2 h-2 rounded-full transition-all ${
                  activeMode === 'onsite' ? 'bg-amber-400 scale-125' : 'bg-stone-300'
                }`}
              />
            </div>
          </button>

          {/* Option 2: Virtual Web */}
          <button
            type="button"
            onClick={() => setActiveMode('virtual')}
            className={`min-h-12 text-left p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
              activeMode === 'virtual'
                ? 'bg-stone-900 border-stone-900 text-white shadow-md'
                : 'bg-white border-stone-200/90 text-stone-700 hover:border-stone-400 hover:bg-stone-50/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  activeMode === 'virtual'
                    ? 'bg-amber-400 text-stone-950'
                    : 'bg-stone-100 text-stone-700 group-hover:bg-stone-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className={`block text-xs font-bold ${activeMode === 'virtual' ? 'text-white' : 'text-stone-900'}`}>
                  Online Web Photobooth
                </span>
                <span className={`block text-[11px] ${activeMode === 'virtual' ? 'text-stone-300' : 'text-stone-500'}`}>
                  Zero-Install Browser &bull; Scan QR Tamu
                </span>
              </div>
            </div>
            <div className="shrink-0 pl-2">
              <span
                className={`inline-block w-2 h-2 rounded-full transition-all ${
                  activeMode === 'virtual' ? 'bg-amber-400 scale-125' : 'bg-stone-300'
                }`}
              />
            </div>
          </button>
        </motion.div>

        {/* Dynamic Dual-Capture Canvas Container */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            {activeMode === 'onsite' ? (
              // ================= MODE 1: KIOSK ON-SITE SHOWCASE =================
              <motion.div
                key="onsite-showcase"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Left: Capability Spec Matrix */}
                <div className="lg:col-span-6 space-y-6">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 block mb-1">
                      Integrasi Perangkat Keras
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight leading-snug">
                      Kendali Shutter Native &amp; Spooling Cetak Tanpa Macet
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed">
                      Dirancang khusus untuk operator booth pernikahan, aktivasi festival, dan pameran. Antarmuka layar sentuh fullscreen terkunci dengan PIN keamanan kru booth.
                    </p>
                  </div>

                  {/* 3 Tactile Architectural Cards */}
                  <div className="space-y-3 pt-1">
                    {/* Feature 1 */}
                    <button
                      type="button"
                      onClick={() => setActiveSpec('tether')}
                      aria-pressed={activeSpec === 'tether'}
                      className={`relative w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 overflow-hidden ${
                        activeSpec === 'tether' ? 'border-stone-900 bg-white shadow-sm' : 'border-stone-200 bg-stone-50/70 hover:bg-stone-50 hover:border-stone-300'
                      }`}
                    >
                      {activeSpec === 'tether' && (
                        <div className="absolute left-0 top-2.5 bottom-2.5 w-[3px] bg-amber-400 rounded-r-full" />
                      )}
                      <div className="flex items-start gap-3 pl-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          activeSpec === 'tether' ? 'bg-amber-400 text-stone-950' : 'bg-stone-200/80 text-stone-700'
                        }`}>
                          <Camera className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">
                            Tethering USB Native PTP (Canon &amp; Sony)
                          </h4>
                          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                            Kontrol shutter kamera Canon EOS dan Sony Alpha langsung tanpa software pihak ketiga yang lambat. Auto-reconnect otomatis jika kabel tersenggol tamu.
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Feature 2 */}
                    <button
                      type="button"
                      onClick={() => setActiveSpec('spool')}
                      aria-pressed={activeSpec === 'spool'}
                      className={`relative w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 overflow-hidden ${
                        activeSpec === 'spool' ? 'border-stone-900 bg-white shadow-sm' : 'border-stone-200 bg-stone-50/70 hover:bg-stone-50 hover:border-stone-300'
                      }`}
                    >
                      {activeSpec === 'spool' && (
                        <div className="absolute left-0 top-2.5 bottom-2.5 w-[3px] bg-amber-400 rounded-r-full" />
                      )}
                      <div className="flex items-start gap-3 pl-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          activeSpec === 'spool' ? 'bg-amber-400 text-stone-950' : 'bg-stone-200/80 text-stone-700'
                        }`}>
                          <Printer className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">
                            Direct Spooler Dye-Sublimation (DNP DS620)
                          </h4>
                          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                            Cetak 2x6 photo strip ganda atau 4x6 postcard dalam 8 detik dengan auto-cut presisi. Sistem antrean cetak cerdas mencegah duplikasi saat kertas habis.
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Feature 3 */}
                    <button
                      type="button"
                      onClick={() => setActiveSpec('buffer')}
                      aria-pressed={activeSpec === 'buffer'}
                      className={`relative w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 overflow-hidden ${
                        activeSpec === 'buffer' ? 'border-stone-900 bg-white shadow-sm' : 'border-stone-200 bg-stone-50/70 hover:bg-stone-50 hover:border-stone-300'
                      }`}
                    >
                      {activeSpec === 'buffer' && (
                        <div className="absolute left-0 top-2.5 bottom-2.5 w-[3px] bg-amber-400 rounded-r-full" />
                      )}
                      <div className="flex items-start gap-3 pl-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          activeSpec === 'buffer' ? 'bg-amber-400 text-stone-950' : 'bg-stone-200/80 text-stone-700'
                        }`}>
                          <Database className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">
                            Buffer Lokal SQLite (100% Zero-Downtime)
                          </h4>
                          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                            Tetap bisa memotret dan mencetak lancar saat sinyal ballroom hotel hilang total. File tersimpan aman di SSD lokal dan otomatis sinkron saat WiFi pulih.
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Direct Launch CTA */}
                  <div className="pt-2">
                    <Link
                      to="/booth/onsite"
                      className="inline-flex items-center gap-2 min-h-11 px-5 py-2.5 rounded-xl bg-stone-950 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all group"
                    >
                      <span>Buka Antarmuka Kiosk On-Site Langsung</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Right: Realistic Kiosk Operator Cockpit & Live Shutter Simulator */}
                <div className="lg:col-span-6">
                  <div className="bg-stone-950 rounded-2xl p-4 sm:p-5 border border-stone-800 text-white shadow-xl relative overflow-hidden">
                    
                    {/* Top Hardware Telemetry Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-stone-800/80 text-xs">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-bold text-stone-100">KIOSK #01 • BALLROOM UTAMA</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400">
                        <span className="text-amber-400 font-semibold">{shutterLatency} ms</span>
                        <span>•</span>
                        <span>{kioskPhotoCount}/800 Strip</span>
                      </div>
                    </div>

                    {/* Interactive Camera Viewfinder Box */}
                    <div className="relative mt-3 rounded-xl overflow-hidden aspect-[16/10] bg-stone-900 border border-stone-800 select-none group">
                      
                      {/* Photo Scene with dynamic brightness according to ISO */}
                      <img
                        src="/images/wedding_postcard_candid.jpg"
                        alt="Kiosk Live Viewfinder Feed"
                        style={{
                          filter: `brightness(${0.85 + (selectedIso / 800) * 0.3})`,
                        }}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.01]"
                      />

                      {/* Camera OSD Overlays */}
                      <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between font-mono text-[10px] text-white/90">
                        {/* Top OSD */}
                        <div className="flex justify-between items-center bg-stone-950/60 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                          <span className="text-amber-400 font-bold">[AF-C SERVO]</span>
                          <span className="text-stone-300">RAW + JPG (24.2 MP)</span>
                          <span className="text-emerald-400 font-semibold">[⚡ STROBE READY]</span>
                        </div>

                        {/* Center Focus Reticle */}
                        <div className="self-center flex items-center justify-center">
                          <div className={`w-14 h-14 border border-dashed rounded-lg flex items-center justify-center transition-colors ${
                            activeSpec === 'tether' && shutterState !== 'flashing' ? 'animate-pulse' : ''
                          } ${
                            shutterState === 'flashing' || activeSpec === 'tether' ? 'border-amber-400 bg-amber-400/20' : 'border-white/50'
                          }`}>
                            <div className="w-2 h-2 bg-amber-400 rounded-full" />
                          </div>
                        </div>

                        {/* Bottom OSD Exposure with Interactive ISO Switcher */}
                        <div className="flex justify-between items-center bg-stone-950/70 backdrop-blur-xs px-2.5 py-1 rounded-lg pointer-events-auto">
                          <span>1/160s</span>
                          <span>f/2.8</span>
                          
                          {/* ISO Interactive Selector */}
                          <div className="flex items-center gap-1">
                            <span className="text-stone-400">ISO:</span>
                            {[200, 400, 800].map((iso) => (
                              <button
                                key={iso}
                                type="button"
                                onClick={() => setSelectedIso(iso)}
                                className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono transition-colors cursor-pointer ${
                                  selectedIso === iso ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
                                }`}
                              >
                                {iso}
                              </button>
                            ))}
                          </div>

                          <span className={activeSpec === 'buffer' ? 'text-amber-400' : 'text-emerald-400'}>
                            {activeSpec === 'buffer' ? 'OFFLINE · WAL' : 'DNP READY'}
                          </span>
                        </div>
                      </div>

                      {/* Strobe Flash Pulse Overlay */}
                      <AnimatePresence>
                        {shutterState === 'flashing' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="absolute inset-0 bg-white pointer-events-none z-30"
                          />
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Spec readout: follows the card selected on the left */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSpec}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="mt-3.5 flex items-start gap-2 text-[11px] font-mono text-stone-300"
                      >
                        <span className="shrink-0 px-1.5 py-0.5 rounded bg-amber-400 text-stone-950 font-bold text-[10px]">
                          {SPEC_READOUT[activeSpec].tag}
                        </span>
                        <span className="leading-relaxed">{SPEC_READOUT[activeSpec].text}</span>
                      </motion.div>
                    </AnimatePresence>

                    {/* Telemetry Status Line */}
                    <div className="mt-3.5 p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs flex items-center justify-between font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-stone-400">Spooler:</span>
                        <span className={shutterState === 'spooling' ? 'text-amber-400 animate-pulse font-semibold' : 'text-stone-200'}>
                          {spoolerStep}
                        </span>
                      </div>
                      {shutterState === 'printed' && (
                        <button
                          type="button"
                          onClick={handleResetKiosk}
                          className="min-h-7 px-2 text-[11px] text-amber-400 hover:text-white underline cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    {/* Live Shutter Interactive Trigger Button */}
                    <div className="mt-3.5 flex flex-col sm:flex-row gap-2.5">
                      <button
                        type="button"
                        onClick={handleTriggerKioskShutter}
                        disabled={shutterState === 'flashing' || shutterState === 'spooling'}
                        className="flex-1 min-h-11 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 shadow-xs"
                      >
                        <Camera className="w-4 h-4 text-stone-950" />
                        <span>
                          {shutterState === 'flashing'
                            ? 'Memicu Shutter...'
                            : shutterState === 'spooling'
                            ? 'Sedang Memproses Spooler...'
                            : shutterState === 'printed'
                            ? 'Ambil Foto Lagi (Picu Shutter)'
                            : 'Picu Shutter Kamera (Simulasi Live)'}
                        </span>
                      </button>

                      {shutterState === 'printed' && (
                        <div className="px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-1.5 shrink-0 justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>1 Strip Siap</span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </motion.div>
            ) : (
              // ================= MODE 2: VIRTUAL WEB BOOTH SHOWCASE =================
              <motion.div
                key="virtual-showcase"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Left: Capability Spec Matrix */}
                <div className="lg:col-span-6 space-y-6">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 block mb-1">
                      Aktivasi Brand &amp; Tamu Mobile
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight leading-snug">
                      Photobooth Web Instan di Smartphone Tamu Tanpa Aplikasi
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed">
                      Solusi ideal untuk pernikahan hybrid, konferensi brand, dan festival dengan ribuan audiens. Tamu cukup memindai barcode di meja atau tap link bio untuk langsung berfoto.
                    </p>
                  </div>

                  {/* 3 Tactile Architectural Cards */}
                  <div className="space-y-3 pt-1">
                    {/* Feature 1 */}
                    <div className="p-3.5 sm:p-4 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-stone-200/80 text-stone-800 flex items-center justify-center shrink-0 mt-0.5">
                          <Globe className="w-4 h-4 text-stone-900" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">
                            Universal Zero-Install (iOS &amp; Android)
                          </h4>
                          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                            Bekerja langsung di Safari iOS, Chrome Android, maupun browser in-app Instagram tanpa download aplikasi App Store atau Play Store.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-3.5 sm:p-4 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-stone-200/80 text-stone-800 flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles className="w-4 h-4 text-stone-900" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">
                            Live Shader Grading &amp; Watermark Brand
                          </h4>
                          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                            Filter warna sinematik dengan rendering instan di kamera ponsel. Template bingkai logo sponsor atau nama mempelai tertempel otomatis saat dijepret.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-3.5 sm:p-4 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-stone-200/80 text-stone-800 flex items-center justify-center shrink-0 mt-0.5">
                          <Share2 className="w-4 h-4 text-stone-900" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">
                            Distribusi WhatsApp &amp; Live Slideshow Wall
                          </h4>
                          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                            Kirim tautan foto resolusi penuh langsung ke WhatsApp tamu, sekaligus otomatis tayangkan foto terbaru di layar proyektor panggung pernikahan.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Direct Launch CTA */}
                  <div className="pt-2">
                    <Link
                      to="/booth/online/wedding-demo"
                      className="inline-flex items-center gap-2 min-h-11 px-5 py-2.5 rounded-xl bg-stone-950 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all group"
                    >
                      <span>Coba Pengalaman Virtual Web Booth</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Right: Realistic Smartphone Mockup with Interactive Guest Web App */}
                <div className="lg:col-span-6 flex justify-center">
                  <div className="w-full max-w-[320px] sm:max-w-[340px] bg-stone-950 rounded-[36px] p-3 sm:p-3.5 border-4 border-stone-800 shadow-2xl relative">
                    
                    {/* Phone Screen Container */}
                    <div className="bg-stone-900 rounded-[28px] overflow-hidden border border-stone-800 text-stone-100 flex flex-col justify-between relative">
                      
                      {/* Top App Bar & Dynamic Island */}
                      <div className="bg-stone-950 px-4 py-2.5 border-b border-stone-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-stone-400" />
                          <span className="font-bold text-[11px] truncate max-w-[150px]">
                            Adit &amp; Maya Wedding
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400">● LIVE</span>
                      </div>

                      {/* Camera Viewport Area */}
                      <div className="relative aspect-[3/4] bg-black overflow-hidden select-none">
                        
                        {/* Guest Photo with Filter */}
                        <img
                          src="/images/wedding_bouquet_laugh.jpg"
                          alt="Virtual Booth Guest Camera"
                          className="w-full h-full object-cover transition-all duration-300"
                          style={{
                            filter: WEB_FILTERS.find((f) => f.id === selectedFilter)?.filterStyle,
                          }}
                        />

                        {/* Interactive Event Watermark Frame Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none text-center">
                          {selectedWatermark === 'wedding' && (
                            <>
                              <p className="font-serif text-[11px] font-bold text-white tracking-widest uppercase drop-shadow-sm">
                                Adit &amp; Maya • 24.10.2026
                              </p>
                              <p className="text-[9px] font-mono text-stone-300 tracking-wider uppercase mt-0.5">
                                Grand Ballroom Mulia Jakarta
                              </p>
                            </>
                          )}
                          {selectedWatermark === 'corporate' && (
                            <>
                              <p className="font-heading-xl text-[11px] font-bold text-amber-400 tracking-widest uppercase drop-shadow-sm">
                                SNAPSTUDIO TECH SUMMIT 2026
                              </p>
                              <p className="text-[9px] font-mono text-stone-200 tracking-wider uppercase mt-0.5">
                                INNOVATION MEETS EMOTION
                              </p>
                            </>
                          )}
                          {selectedWatermark === 'neon' && (
                            <>
                              <p className="font-heading-xl text-[12px] font-black text-rose-400 tracking-widest uppercase drop-shadow-[0_0_8px_#f43f5e]">
                                GLOW PARTY NIGHT ✦
                              </p>
                              <p className="text-[9px] font-mono text-cyan-300 tracking-wider uppercase mt-0.5">
                                VIP GUEST ACCESS ONLY
                              </p>
                            </>
                          )}
                        </div>

                        {/* Countdown Pulse Overlay */}
                        <AnimatePresence>
                          {webCaptureState === 'countdown' && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.4 }}
                              className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-20"
                            >
                              <span className="font-mono text-6xl font-black text-amber-400 drop-shadow-lg">
                                {countdownVal}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Screen Flash Overlay */}
                        <AnimatePresence>
                          {webCaptureState === 'flashing' && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="absolute inset-0 bg-white z-30"
                            />
                          )}
                        </AnimatePresence>

                        {/* WhatsApp Toast Simulation */}
                        <AnimatePresence>
                          {whatsappToast && (
                            <motion.div
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="absolute top-2 inset-x-2 bg-emerald-600 text-white text-[11px] font-bold px-3 py-2 rounded-xl shadow-lg flex items-center justify-center gap-1.5 z-40"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Link foto HD terkirim ke WhatsApp!</span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Download HD Toast */}
                        <AnimatePresence>
                          {downloadSuccessToast && (
                            <motion.div
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="absolute top-2 inset-x-2 bg-amber-500 text-stone-950 text-[11px] font-bold px-3 py-2 rounded-xl shadow-lg flex items-center justify-center gap-1.5 z-40"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Foto 3000x4000 JPG tersimpan!</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Controls & Filter Selector */}
                      <div className="p-3 bg-stone-950 border-t border-stone-800 space-y-2.5">
                        
                        {/* Filter Swatches */}
                        {webCaptureState !== 'captured' ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[10px] text-stone-400">
                              <span className="font-semibold">Tone Warna Foto:</span>
                              <span className="text-amber-400">{WEB_FILTERS.find((f) => f.id === selectedFilter)?.label}</span>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5">
                              {WEB_FILTERS.map((f) => (
                                <button
                                  key={f.id}
                                  type="button"
                                  onClick={() => setSelectedFilter(f.id)}
                                  className={`min-h-11 p-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 border ${
                                    selectedFilter === f.id
                                      ? 'border-amber-400 bg-stone-800 text-white shadow-xs'
                                      : 'border-stone-800 bg-stone-900/60 text-stone-400 hover:text-stone-200'
                                  }`}
                                >
                                  <span className={`w-3.5 h-3.5 rounded-full ${f.swatch}`} />
                                  <span className="truncate w-full text-center leading-tight">
                                    {f.label.split(' ')[0]}
                                  </span>
                                </button>
                              ))}
                            </div>

                            {/* Watermark Frame Quick Switch */}
                            <div className="pt-1">
                              <span className="text-[10px] text-stone-400 font-semibold block mb-1">
                                Bingkai Watermark:
                              </span>
                              <div className="grid grid-cols-3 gap-1 text-[10px]">
                                <button
                                  type="button"
                                  onClick={() => setSelectedWatermark('wedding')}
                                  className={`min-h-8 py-1 px-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                                    selectedWatermark === 'wedding'
                                      ? 'border-amber-400 bg-stone-800 text-amber-300 font-bold'
                                      : 'border-stone-800 text-stone-400 hover:text-white'
                                  }`}
                                >
                                  Wedding
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedWatermark('corporate')}
                                  className={`min-h-8 py-1 px-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                                    selectedWatermark === 'corporate'
                                      ? 'border-amber-400 bg-stone-800 text-amber-300 font-bold'
                                      : 'border-stone-800 text-stone-400 hover:text-white'
                                  }`}
                                >
                                  Summit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedWatermark('neon')}
                                  className={`min-h-8 py-1 px-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                                    selectedWatermark === 'neon'
                                      ? 'border-amber-400 bg-stone-800 text-rose-300 font-bold'
                                      : 'border-stone-800 text-stone-400 hover:text-white'
                                  }`}
                                >
                                  Glow Party
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs text-center font-bold">
                            Foto siap diunduh &amp; dibagikan!
                          </div>
                        )}

                        {/* Interactive Shutter / Download Action */}
                        <div className="pt-1">
                          {webCaptureState !== 'captured' ? (
                            <button
                              type="button"
                              onClick={handleStartWebCountdown}
                              disabled={webCaptureState === 'countdown' || webCaptureState === 'flashing'}
                              className="w-full min-h-11 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
                            >
                              <Camera className="w-4 h-4 text-stone-950" />
                              <span>Ambil Foto Tamu (Countdown)</span>
                            </button>
                          ) : (
                            <div className="space-y-2">
                              <button
                                type="button"
                                onClick={handleSendWhatsappSimulation}
                                className="w-full min-h-11 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                              >
                                <Share2 className="w-4 h-4" />
                                <span>Kirim Foto ke WhatsApp</span>
                              </button>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setWebCaptureState('idle')}
                                  className="flex-1 min-h-10 py-1.5 px-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Foto Ulang</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={handleDownloadHd}
                                  className="flex-1 min-h-10 py-1.5 px-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Unduh HD</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
