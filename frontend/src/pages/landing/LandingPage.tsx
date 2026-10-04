import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Camera, CheckCircle2 } from 'lucide-react';
import { LandingNavbar } from '../../components/landing/LandingNavbar';
import { Landing3DHero } from '../../components/landing/Landing3DHero';
import { InteractiveKioskSimulator } from '../../components/landing/InteractiveKioskSimulator';
import { InteractiveTemplateStudio } from '../../components/landing/InteractiveTemplateStudio';
import { DualCaptureShowcase } from '../../components/landing/DualCaptureShowcase';
import { FleetConsoleShowcase } from '../../components/landing/FleetConsoleShowcase';
import { LandingFinalCta } from '../../components/landing/LandingFinalCta';
import { LandingPricing } from '../../components/landing/LandingPricing';
import { LandingFaq } from '../../components/landing/LandingFaq';
import { LandingCalculator } from '../../components/landing/LandingCalculator';
import { LandingChatBot } from '../../components/landing/LandingChatBot';
import { FilmDivider } from '../../components/landing/FilmDivider';

export const LandingPage: React.FC = () => {
  // Trigger flash coordination
  const [flashTriggered, setFlashTriggered] = useState(false);

  const handleKioskFlash = () => {
    setFlashTriggered(true);
    setTimeout(() => setFlashTriggered(false), 500);
  };

  return (
    <div className="bg-[#fafaf9] text-stone-900 min-h-screen flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      
      {/* ================= 1. INTERACTIVE FLOATING & EXPANDING NAVBAR ================= */}
      <LandingNavbar />

      {/* ================= 2. HERO SECTION WITH 3D PRINTS & LIVE SIMULATOR ================= */}
      <section className="relative w-full pt-20 pb-16 sm:pt-24 lg:pt-28 lg:pb-24 overflow-hidden border-b border-stone-200/80">
        
        {/* Three.js 3D Background Canvas */}
        <Landing3DHero flashActive={flashTriggered} />

        {/* 1. Warm Studio Keylight Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 26%, rgba(245, 158, 11, 0.08) 0%, rgba(251, 191, 36, 0.03) 45%, transparent 75%)',
          }}
          aria-hidden="true"
        />

        {/* 2. Precision Darkroom & Print Calibration Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.42] z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(214, 211, 209, 0.5) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(214, 211, 209, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 80% 55% at 50% 32%, black 25%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 55% at 50% 32%, black 25%, transparent 80%)',
          }}
          aria-hidden="true"
        />

        {/* 3. Camera Viewfinder & Optical Calibration Watermark */}
        <div
          className="absolute top-8 sm:top-14 left-1/2 -translate-x-1/2 w-[760px] h-[520px] max-w-full pointer-events-none select-none z-0 opacity-[0.065] flex items-center justify-center"
          aria-hidden="true"
        >
          <svg className="w-full h-full text-stone-950" viewBox="0 0 760 520" fill="none" stroke="currentColor">
            {/* Concentric Lens Circles */}
            <circle cx="380" cy="260" r="230" strokeWidth="1.2" strokeDasharray="6 6" />
            <circle cx="380" cy="260" r="160" strokeWidth="1" />
            <circle cx="380" cy="260" r="75" strokeWidth="1" strokeDasharray="3 3" />
            
            {/* Viewfinder Aspect Ratio 3:2 Frame */}
            <rect x="150" y="105" width="460" height="310" rx="4" strokeWidth="1" strokeDasharray="8 8" />
            
            {/* Center Focus Crosshair */}
            <line x1="380" y1="225" x2="380" y2="295" strokeWidth="1.5" />
            <line x1="345" y1="260" x2="415" y2="260" strokeWidth="1.5" />
            
            {/* Cardinal Degree Marks */}
            <line x1="380" y1="26" x2="380" y2="36" strokeWidth="1.5" />
            <line x1="380" y1="484" x2="380" y2="494" strokeWidth="1.5" />
            <line x1="146" y1="260" x2="156" y2="260" strokeWidth="1.5" />
            <line x1="604" y1="260" x2="614" y2="260" strokeWidth="1.5" />

            {/* Corner Crop Brackets */}
            <path d="M 130 125 L 130 85 L 170 85" strokeWidth="1.5" fill="none" />
            <path d="M 630 125 L 630 85 L 590 85" strokeWidth="1.5" fill="none" />
            <path d="M 130 395 L 130 435 L 170 435" strokeWidth="1.5" fill="none" />
            <path d="M 630 395 L 630 435 L 590 435" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Subtle Technical Viewfinder Annotations */}
          <div className="hidden md:flex items-center justify-between text-[11px] font-mono text-stone-600/70 select-none pb-4 mb-2 tracking-wider">
            <span className="flex items-center gap-1.5">
              <span className="text-amber-600 font-bold">[+]</span>
              <span>CALIBRATION: 3:2 RAW TETHER</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span>PRINT MATRIX: 300 DPI DYE-SUB</span>
              <span className="text-amber-600 font-bold">[+]</span>
            </span>
          </div>
          
          {/* Top Editorial Headline with Framer Motion Staggered Entrance */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 relative"
          >
            {/* Soft optical contrast shield to ensure text remains crisp over floating background photos */}
            <div
              className="absolute -inset-x-8 -inset-y-6 pointer-events-none -z-10 rounded-full blur-xl"
              style={{
                background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(250, 250, 249, 0.95) 25%, rgba(250, 250, 249, 0.6) 65%, transparent 100%)',
              }}
              aria-hidden="true"
            />

            {/* Main Title with Pristine 16-Wave Animated Underline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading-xl text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-950 tracking-tight leading-[1.28] sm:leading-[1.18]"
            >
              Kendali Penuh Photobooth Event, Dari{' '}
              <span className="relative inline-block text-stone-950 font-extrabold group whitespace-nowrap">
                <span className="relative z-10 text-amber-600 sm:text-stone-950 group-hover:text-amber-600 transition-colors duration-200">
                  Kamera Tethered
                </span>
                {/* 
                  High-Frequency 16-Wave Bézier SVG Underline
                  Engineered with 16 continuous quadratic oscillation cycles across a 240-unit viewBox.
                  Scales responsively across all screen widths with distinct, crisp, rhythmic wave crests.
                */}
                <svg
                  className="absolute left-0 -bottom-2 sm:-bottom-2.5 w-full h-2.5 sm:h-3.5 text-amber-500 overflow-visible pointer-events-none drop-shadow-[0_1px_2px_rgba(245,158,11,0.5)]"
                  viewBox="0 0 240 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M 0 6 Q 3.75 1.5, 7.5 6 T 15 6 T 22.5 6 T 30 6 T 37.5 6 T 45 6 T 52.5 6 T 60 6 T 67.5 6 T 75 6 T 82.5 6 T 90 6 T 97.5 6 T 105 6 T 112.5 6 T 120 6 T 127.5 6 T 135 6 T 142.5 6 T 150 6 T 157.5 6 T 165 6 T 172.5 6 T 180 6 T 187.5 6 T 195 6 T 202.5 6 T 210 6 T 217.5 6 T 225 6 T 232.5 6 T 240 6"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.1, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  />
                </svg>
              </span>{' '}
              Hingga Cetak Sub-Detik.
            </motion.h1>

            {/* Call To Action Buttons with Interactive Spring Hover */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/auth/register"
                  className="px-6 py-3.5 rounded-xl bg-stone-950 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
                >
                  <span>Daftarkan Studio Anda Gratis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <a
                  href="#simulator"
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-xs sm:text-sm font-semibold border border-stone-200/90 shadow-2xs transition-all flex items-center gap-2 cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
                >
                  <Play className="w-3.5 h-3.5 text-amber-600 fill-amber-600 group-hover:scale-110 transition-transform" />
                  <span>Uji Coba Simulator Kiosk</span>
                </a>
              </motion.div>
            </motion.div>

            {/* Hardware Partner Compatibility Badges - single scrollable row on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mt-8 w-full overflow-x-auto no-scrollbar"
            >
              <div className="flex items-center justify-center gap-2.5 text-[11px] font-mono text-stone-600 min-w-max mx-auto px-4">
                <a
                  href="#dual-capture"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-stone-100 border border-stone-200 text-stone-700 hover:text-stone-950 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                  title="Lihat spesifikasi tethering Canon & Sony"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Canon &amp; Sony USB Tethering</span>
                </a>
                <a
                  href="#simulator"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-stone-100 border border-stone-200 text-stone-700 hover:text-stone-950 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                  title="Lihat simulasi direct spooler DNP & Citizen"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>DNP &amp; Citizen Dye-Sub Spooler</span>
                </a>
                <a
                  href="#dual-capture"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-stone-100 border border-stone-200 text-stone-700 hover:text-stone-950 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                  title="Sistem buffer lokal SQLite tanpa koneksi internet"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Offline SQLite Buffer Ready</span>
                </a>
              </div>
            </motion.div>

          </motion.div>

          {/* Live Kiosk Terminal Simulator Section */}
          <motion.div
            id="simulator"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto scroll-mt-20"
          >
            <p className="text-center text-xs text-stone-500 mb-4">
              Coba langsung: pilih filter, lalu tekan &quot;Snap Foto Test&quot;.
            </p>
            <InteractiveKioskSimulator onFlashTrigger={handleKioskFlash} />
          </motion.div>

        </div>
      </section>


      {/* ================= 3. ARCHITECTURAL HARDWARE SPECIFICATION MARQUEE ================= */}
      <section className="w-full bg-stone-950 text-white border-y border-stone-900 overflow-hidden relative select-none py-6 sm:py-8">
        {/* Optical Fade Vignettes */}
        <div className="absolute left-0 inset-y-0 w-12 sm:w-32 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-12 sm:w-32 bg-gradient-to-l from-stone-950 via-stone-950/80 to-transparent z-10 pointer-events-none" />

        {/* Continuous Infinite Marquee Track (Smooth Leftward Translation) */}
        <div className="ticker-track">
          {[
            {
              metric: '< 42ms',
              title: 'Tethering Kamera USB-C',
              desc: 'Integrasi native Canon EOS & Sony Alpha SDK. Respon shutter instan tanpa jeda aplikasi pihak ketiga.',
              tag: 'EDSDK v13.17 Native Hook',
              href: '#dual-capture',
            },
            {
              metric: '8.2 Detik',
              title: 'Direct Spooling DNP DS620',
              desc: 'Antrean cetak dye-sublimation otomatis. Anti-macet dengan sistem recovery saat kertas habis mendadak.',
              tag: 'DNP DS620 & Citizen CY-02',
              href: '#simulator',
            },
            {
              metric: 'Zero-App',
              title: 'Distribusi Foto Lewat QR',
              desc: 'Tamu cukup scan via kamera ponsel. Galeri foto & GIF beresolusi tinggi terbuka langsung dalam browser.',
              tag: 'Instant WebRTC PWA',
              href: '#dual-capture',
            },
            {
              metric: '100% Offline',
              title: 'Buffer Lokal SQLite',
              desc: 'Tetap bisa foto dan cetak lancar saat venue tanpa sinyal. Data otomatis tersinkronisasi saat WiFi pulih.',
              tag: 'WAL Mode Local Cache',
              href: '#dual-capture',
            },
            {
              metric: '24.2 MP',
              title: 'Studio Strobe Flash Sync',
              desc: 'Sinkronisasi flash blitz eksternal studio 1/160s dengan live view RAW resolusi maksimal.',
              tag: 'Hotshoe Strobe Trigger',
              href: '#simulator',
            },
            {
              metric: '60 FPS',
              title: 'WebRTC Low-Latency Engine',
              desc: 'Preview frame kamera instan tanpa stutter di layar sentuh kiosk maupun browser ponsel.',
              tag: 'H.264 Hardware Acceleration',
              href: '#dual-capture',
            },
            // Duplicate array for seamless infinite marquee loop
            {
              metric: '< 42ms',
              title: 'Tethering Kamera USB-C',
              desc: 'Integrasi native Canon EOS & Sony Alpha SDK. Respon shutter instan tanpa jeda aplikasi pihak ketiga.',
              tag: 'EDSDK v13.17 Native Hook',
              href: '#dual-capture',
            },
            {
              metric: '8.2 Detik',
              title: 'Direct Spooling DNP DS620',
              desc: 'Antrean cetak dye-sublimation otomatis. Anti-macet dengan sistem recovery saat kertas habis mendadak.',
              tag: 'DNP DS620 & Citizen CY-02',
              href: '#simulator',
            },
            {
              metric: 'Zero-App',
              title: 'Distribusi Foto Lewat QR',
              desc: 'Tamu cukup scan via kamera ponsel. Galeri foto & GIF beresolusi tinggi terbuka langsung dalam browser.',
              tag: 'Instant WebRTC PWA',
              href: '#dual-capture',
            },
            {
              metric: '100% Offline',
              title: 'Buffer Lokal SQLite',
              desc: 'Tetap bisa foto dan cetak lancar saat venue tanpa sinyal. Data otomatis tersinkronisasi saat WiFi pulih.',
              tag: 'WAL Mode Local Cache',
              href: '#dual-capture',
            },
            {
              metric: '24.2 MP',
              title: 'Studio Strobe Flash Sync',
              desc: 'Sinkronisasi flash blitz eksternal studio 1/160s dengan live view RAW resolusi maksimal.',
              tag: 'Hotshoe Strobe Trigger',
              href: '#simulator',
            },
            {
              metric: '60 FPS',
              title: 'WebRTC Low-Latency Engine',
              desc: 'Preview frame kamera instan tanpa stutter di layar sentuh kiosk maupun browser ponsel.',
              tag: 'H.264 Hardware Acceleration',
              href: '#dual-capture',
            },
          ].map((item, idx) => (
            <a
              key={`${item.metric}-${idx}`}
              href={item.href}
              className="w-[240px] sm:w-[320px] lg:w-[360px] shrink-0 px-4 sm:px-8 border-r border-stone-800/80 group transition-all cursor-pointer block hover:bg-stone-900/40"
            >
              <div className="flex items-center justify-between">
                <span className="block font-mono text-2xl sm:text-4xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  {item.metric}
                </span>
                <span className="text-[9.5px] font-mono text-stone-300 bg-stone-900 px-2 py-0.5 rounded-full border border-stone-800 group-hover:border-amber-400/40 group-hover:text-amber-300 transition-colors">
                  {item.tag}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white mt-2 group-hover:text-stone-100 transition-colors flex items-center justify-between">
                <span>{item.title}</span>
                <span className="text-[10px] text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  Buka &rarr;
                </span>
              </h4>
              <p className="text-[11px] sm:text-xs text-stone-300 mt-1 leading-relaxed">
                {item.desc}
              </p>
            </a>
          ))}
        </div>

        <style>{`
          @keyframes ticker-slide {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          .ticker-track {
            display: flex;
            width: max-content;
            animation: ticker-slide 36s linear infinite;
            will-change: transform;
          }
          .ticker-track:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>


      {/* ================= 4. DUAL-CAPTURE ARCHITECTURE SECTION ================= */}
      <DualCaptureShowcase />


      {/* ================= 5. INTERACTIVE TEMPLATE STUDIO ================= */}
      <FilmDivider frame="FRAME 03" label="STUDIO TEMPLATE" />
      <section id="templates" className="w-full py-16 lg:py-24 bg-amber-400 text-stone-950 border-y border-amber-500/40 relative overflow-hidden">
        {/* Grain texture overlay — identity texture for the print-studio section */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06] z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 lg:mb-12"
          >
            <div className="max-w-xl">
              <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-widest text-stone-800 mb-3">
                Studio Template &amp; Format Kertas
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-950 tracking-tight leading-[1.05]">
                Ketik nama event,<br className="hidden sm:block" /> lihat hasil cetaknya.
              </h2>
            </div>
            <p className="text-sm sm:text-base text-stone-900 leading-relaxed font-medium max-w-xs sm:max-w-sm sm:text-right">
              Pilih format kertas, ganti warna dan judul. Preview berubah saat itu juga, proporsional dengan hasil DNP DS620.
            </p>
          </motion.div>

          <InteractiveTemplateStudio />
        </div>
      </section>


      {/* ================= 6. FLEET & MULTI-TENANT CONSOLE SECTION ================= */}
      <FilmDivider frame="FRAME 04" label="KONSOL ARMADA" />
      <FleetConsoleShowcase />


      {/* ================= 6.5 PROFIT CALCULATOR ================= */}
      <FilmDivider frame="FRAME 05" label="KALKULATOR" />
      <LandingCalculator />


      {/* ================= 7. PRICING ================= */}
      <FilmDivider frame="FRAME 06" label="PAKET HARGA" />
      <LandingPricing />

      {/* ================= 8. OPERATOR FAQ ================= */}
      <FilmDivider frame="FRAME 07" label="FAQ" />
      <LandingFaq />



      {/* ================= 9. FINAL CALL TO ACTION ================= */}
      <FilmDivider frame="FRAME 08" label="MULAI SEKARANG" />
      <LandingFinalCta />


      {/* ================= 10. EDITORIAL FOOTER ================= */}
      <footer className="w-full bg-stone-950 border-t border-stone-800 pt-12 pb-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top row: brand + links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10 border-b border-stone-800">

            {/* Brand block */}
            <div className="lg:col-span-1 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4 text-stone-950" />
                </div>
                <span className="font-extrabold text-sm text-white tracking-tight">SnapStudio</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed max-w-[220px]">
                Platform operasi photobooth untuk vendor pernikahan dan event di Indonesia.
              </p>
              <a
                href="https://wa.me/6281234567890?text=Halo%20SnapStudio"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              >
                Tanya via WhatsApp
              </a>
            </div>

            {/* Platform links */}
            <div className="space-y-3">
              <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600">Platform</span>
              <nav aria-label="Platform links" className="space-y-2">
                <Link to="/auth/login" className="block text-stone-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">
                  Konsol Admin
                </Link>
                <Link to="/booth/onsite" className="block text-stone-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">
                  Kiosk On-Site
                </Link>
                <Link to="/booth/online/wedding-demo" className="block text-stone-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">
                  Virtual Web Booth
                </Link>
                <a href="#simulator" className="block text-stone-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">
                  Simulator Kiosk
                </a>
              </nav>
            </div>

            {/* Hardware compatibility + pricing anchors */}
            <div className="space-y-3">
              <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600">Spesifikasi</span>
              <nav aria-label="Specification links" className="space-y-2">
                <a href="#dual-capture" className="block text-stone-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">
                  Kamera Canon &amp; Sony
                </a>
                <a href="#simulator" className="block text-stone-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">
                  Printer DNP &amp; Citizen
                </a>
                <a href="#templates" className="block text-stone-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">
                  Format Strip &amp; Postcard
                </a>
                <a href="#pricing" className="block text-stone-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">
                  Paket Harga Studio
                </a>
              </nav>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-stone-600">
              &copy; 2026 SnapStudio. Spesialis solusi stan foto pernikahan &amp; event Indonesia.
            </p>
            <span className="text-[10px] font-mono text-stone-700 tracking-wider">
              DNP DS620 &bull; Canon EDSDK &bull; SQLite WAL Mode
            </span>
          </div>
        </div>
      </footer>

      {/* ================= 10. REALTIME OPERATOR CHAT BOT ================= */}
      <LandingChatBot />

    </div>
  );
};

export default LandingPage;
