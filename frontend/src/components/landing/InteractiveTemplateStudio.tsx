import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, CheckCircle2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PrintFormat {
  id: 'strip_2r' | 'postcard_4r' | 'polaroid_sq' | 'collage_5r';
  title: string;
  subtitle: string;
  dimensions: string;
  slots: number;
}

const FORMATS: PrintFormat[] = [
  {
    id: 'strip_2r',
    title: 'Strip 2x6" (2R)',
    subtitle: '3 Foto Vertikal • Standar Favorit Wedding',
    dimensions: '600 × 1800 px (300 DPI)',
    slots: 3,
  },
  {
    id: 'postcard_4r',
    title: 'Postcard 4x6" (4R)',
    subtitle: 'Landscape 4 Grid • Souvenir Eksklusif',
    dimensions: '1800 × 1200 px (300 DPI)',
    slots: 4,
  },
  {
    id: 'polaroid_sq',
    title: 'Square 1:1 Polar',
    subtitle: 'Single Hero Frame • Estetika Vintage Retro',
    dimensions: '1200 × 1400 px (300 DPI)',
    slots: 1,
  },
  {
    id: 'collage_5r',
    title: 'Multi-Collage 5x7"',
    subtitle: '4 Slot Grid • Event Korporat & Gala',
    dimensions: '1500 × 2100 px (300 DPI)',
    slots: 4,
  },
];

const COLOR_THEMES = [
  { id: 'white', name: 'Pure Snow White', bg: '#ffffff', text: '#18181b', border: '#e4e4e7' },
  { id: 'dark', name: 'Matte Obsidian', bg: '#18181b', text: '#ffffff', border: '#27272a' },
  { id: 'champagne', name: 'Rose Champagne', bg: '#fff1f2', text: '#881337', border: '#fecdd3' },
  { id: 'sand', name: 'Warm Ivory Sand', bg: '#fef3c7', text: '#78350f', border: '#fde68a' },
  { id: 'midnight', name: 'Midnight Indigo', bg: '#0f172a', text: '#f8fafc', border: '#1e293b' },
];

export const InteractiveTemplateStudio: React.FC = () => {
  const [activeFormat, setActiveFormat] = useState<PrintFormat>(FORMATS[0]);
  const [selectedTheme, setSelectedTheme] = useState(COLOR_THEMES[0]);
  const [headline, setHeadline] = useState('SARAH & DIMAS WEDDING');
  const [tagline, setTagline] = useState('24 OKTOBER 2026 • HOTEL MULIA JAKARTA');
  const [activeStamp, setActiveStamp] = useState<string | null>('💍 The Wedding');
  const [paperFinish, setPaperFinish] = useState<'glossy' | 'luster' | 'metallic'>('glossy');
  const [isSimulatingPrint, setIsSimulatingPrint] = useState(false);
  const [printSuccessToast, setPrintSuccessToast] = useState(false);

  const STAMPS = ['💍 The Wedding', '✨ VIP Gala', '🍸 Celebration', 'None'];

  const handleSimulatePrint = () => {
    if (isSimulatingPrint) return;
    setIsSimulatingPrint(true);
    setTimeout(() => {
      setIsSimulatingPrint(false);
      setPrintSuccessToast(true);
      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.6, x: 0.7 },
          colors: ['#f59e0b', '#10b981', '#ffffff'],
        });
      } catch {
        // fallback
      }
      setTimeout(() => setPrintSuccessToast(false), 3500);
    }, 1100);
  };

  return (
    <div className="w-full bg-stone-950 text-white rounded-3xl border border-stone-900 shadow-2xl p-4 sm:p-8 lg:p-10 relative overflow-hidden">
      
      {/* Background Darkroom Calibration Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Controls & Customizer (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                Spooler Layout 300 DPI
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                DNP DS620 Ready
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Kustomisasi Format Cetak &amp; Bingkai Kertas
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed">
              Pilih ukuran kertas sesuai format acara. Setiap perubahan teks, warna bingkai, dan komposisi langsung di-render otomatis dengan akurasi skala cetak asli.
            </p>
          </div>

          {/* 1. Format Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-200">
              Pilih Ukuran Kertas:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {FORMATS.map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setActiveFormat(fmt)}
                  className={`min-h-12 p-3 rounded-xl text-left transition-all cursor-pointer border ${
                    activeFormat.id === fmt.id
                      ? 'bg-stone-900 border-amber-400 text-white ring-1 ring-amber-400 shadow-sm'
                      : 'bg-stone-900/60 hover:bg-stone-900 border-stone-800 text-stone-300 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>{fmt.title}</span>
                    {activeFormat.id === fmt.id && (
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </div>
                  <div className="text-[11px] mt-1 leading-snug text-stone-400">
                    {fmt.subtitle}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Color Theme & Paper Finish */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-200 mb-2">
                Tema Warna Kertas:
              </label>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                {COLOR_THEMES.map((theme, i) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme)}
                    style={{ backgroundColor: theme.bg }}
                    className={`min-h-11 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      i === COLOR_THEMES.length - 1 ? 'col-span-2 sm:col-span-1' : ''
                    } ${
                      selectedTheme.id === theme.id
                        ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-950 font-bold shadow-md scale-102'
                        : 'border-stone-700/60 opacity-90 hover:opacity-100'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-stone-400/40 shrink-0"
                      style={{ backgroundColor: theme.text }}
                    />
                    <span style={{ color: theme.text }}>{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Paper Sheen Finish Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-200 mb-2">
                Tekstur Hasil Cetak (DNP Media):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'glossy', label: 'High Glossy' },
                  { id: 'luster', label: 'Matte Luster' },
                  { id: 'metallic', label: 'Metallic Pearl' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setPaperFinish(f.id as any)}
                    className={`min-h-11 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                      paperFinish === f.id
                        ? 'border-amber-400 bg-stone-900 text-amber-300 font-bold ring-1 ring-amber-400'
                        : 'border-stone-800 bg-stone-900/60 text-stone-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Decorative Event Stamp Toggle */}
            <div>
              <label className="block text-xs font-bold text-stone-200 mb-2">
                Stempel / Ornamen Event:
              </label>
              <div className="flex flex-wrap gap-2">
                {STAMPS.map((stamp) => (
                  <button
                    key={stamp}
                    type="button"
                    onClick={() => setActiveStamp(stamp === 'None' ? null : stamp)}
                    className={`min-h-9 px-3 py-1 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      (stamp === 'None' && activeStamp === null) || activeStamp === stamp
                        ? 'border-amber-400 bg-amber-400/20 text-amber-300 font-bold'
                        : 'border-stone-800 bg-stone-900/60 text-stone-400 hover:text-white'
                    }`}
                  >
                    {stamp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Text Inputs with Mobile-Safe Font Size (>= 16px to prevent iOS auto-zoom) */}
          <div className="space-y-3 bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Teks Judul Acara (Live Update di Kertas):
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Contoh: SARAH & DIMAS WEDDING"
                className="w-full min-h-11 px-3.5 py-2 text-base sm:text-xs rounded-xl border border-stone-700 bg-stone-950 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Subteks Lokasi / Tanggal:
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Contoh: 24 OKTOBER 2026 • HOTEL MULIA JAKARTA"
                className="w-full min-h-11 px-3.5 py-2 text-base sm:text-xs rounded-xl border border-stone-700 bg-stone-950 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-sans"
              />
            </div>
          </div>

          {/* Technical Export Specs & Interactive Print Trigger */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-800/80">
            <div className="font-mono text-[11px] text-stone-400 space-y-0.5">
              <div>
                Dimensi: <span className="text-white font-bold">{activeFormat.dimensions}</span>
              </div>
              <div>
                Profil Warna: <span className="text-white font-bold">sRGB IEC61966-2.1</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSimulatePrint}
              disabled={isSimulatingPrint}
              className="min-h-11 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
            >
              {isSimulatingPrint ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-stone-950" />
                  <span>Mengirim ke Spooler...</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4 text-stone-950" />
                  <span>Uji Cetak ke DNP DS620</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Live Visual Mockup: Darkroom Workbench Stage (6 cols) */}
        <div className="lg:col-span-6 bg-[#161514] rounded-2xl border border-stone-800 p-4 sm:p-8 flex flex-col items-center justify-center min-h-[460px] sm:min-h-[520px] relative overflow-hidden">
          
          {/* Subtle Cutting Mat Guides */}
          <div className="absolute inset-x-6 top-3 flex items-center justify-between text-[10px] font-mono text-stone-600 select-none pointer-events-none">
            <span>◄ 0 cm</span>
            <span>RULER DYE-SUB PRO 300 DPI</span>
            <span>15 cm ►</span>
          </div>

          {/* Toast Notification Simulation */}
          <AnimatePresence>
            {printSuccessToast && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-4 inset-x-4 bg-emerald-600 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xl flex items-center justify-center gap-2 z-30"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Format siap cetak! Terkirim ke spooler DNP DS620 (8.2s).</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Physical Photo Paper Preview with Tactile 3D Hover & Stamp */}
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            whileHover={{ y: -4, rotate: 0.5, transition: { duration: 0.2 } }}
            style={{
              backgroundColor: selectedTheme.bg,
              borderColor: selectedTheme.border,
            }}
            className={`p-3 sm:p-4 rounded-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] border ring-1 ring-white/10 relative transition-colors max-w-full flex flex-col items-center justify-between select-none cursor-pointer ${
              paperFinish === 'glossy' ? 'before:absolute before:inset-0 before:bg-gradient-to-tr before:from-transparent before:via-white/10 before:to-white/20 before:pointer-events-none before:rounded-xl' : ''
            }`}
          >
            {/* Format: Strip 2x6 */}
            {activeFormat.id === 'strip_2r' && (
              <div className="w-40 sm:w-48 flex flex-col gap-2">
                <div className="h-22 sm:h-26 rounded overflow-hidden bg-stone-200 border border-stone-200/60 shadow-xs">
                  <img src="/images/wedding_strip_couple.jpg" alt="Photo 1" className="w-full h-full object-cover" />
                </div>
                <div className="h-22 sm:h-26 rounded overflow-hidden bg-stone-200 border border-stone-200/60 shadow-xs">
                  <img src="/images/wedding_bouquet_laugh.jpg" alt="Photo 2" className="w-full h-full object-cover" />
                </div>
                <div className="h-22 sm:h-26 rounded overflow-hidden bg-stone-200 border border-stone-200/60 shadow-xs">
                  <img src="/images/wedding_polaroid_guests.jpg" alt="Photo 3" className="w-full h-full object-cover" />
                </div>
                
                {/* Auto-cut line indicator */}
                <div className="text-center pt-2 pb-1 border-t border-dashed border-stone-300/60">
                  {activeStamp && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-mono border border-stone-400/40 mb-1 opacity-80" style={{ color: selectedTheme.text }}>
                      {activeStamp}
                    </span>
                  )}
                  <p style={{ color: selectedTheme.text }} className="font-bold text-[11px] tracking-wider truncate uppercase">
                    {headline || 'SNAPSTUDIO PHOTO'}
                  </p>
                  <p style={{ color: selectedTheme.text }} className="text-[8px] opacity-75 font-mono mt-0.5 truncate tracking-wide">
                    {tagline || 'SPECIAL EVENT'}
                  </p>
                </div>
              </div>
            )}

            {/* Format: Postcard 4x6 (Responsive max-w so no mobile overflow) */}
            {activeFormat.id === 'postcard_4r' && (
              <div className="w-64 sm:w-80 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="h-20 sm:h-24 rounded overflow-hidden bg-stone-200 border border-stone-200/60 shadow-xs">
                    <img src="/images/wedding_strip_couple.jpg" alt="Photo 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="h-20 sm:h-24 rounded overflow-hidden bg-stone-200 border border-stone-200/60 shadow-xs">
                    <img src="/images/wedding_bouquet_laugh.jpg" alt="Photo 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="h-20 sm:h-24 rounded overflow-hidden bg-stone-200 border border-stone-200/60 shadow-xs">
                    <img src="/images/wedding_postcard_candid.jpg" alt="Photo 3" className="w-full h-full object-cover" />
                  </div>
                  <div className="h-20 sm:h-24 rounded overflow-hidden bg-stone-200 border border-stone-200/60 shadow-xs">
                    <img src="/images/wedding_polaroid_guests.jpg" alt="Photo 4" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="text-center pt-2 pb-1 border-t border-stone-200/40">
                  {activeStamp && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-mono border border-stone-400/40 mb-1 opacity-80" style={{ color: selectedTheme.text }}>
                      {activeStamp}
                    </span>
                  )}
                  <p style={{ color: selectedTheme.text }} className="font-bold text-xs tracking-wider uppercase truncate">
                    {headline || 'SNAPSTUDIO PHOTO'}
                  </p>
                  <p style={{ color: selectedTheme.text }} className="text-[9px] opacity-75 font-mono mt-0.5 truncate tracking-wide">
                    {tagline || 'SPECIAL EVENT'}
                  </p>
                </div>
              </div>
            )}

            {/* Format: Square 1:1 Polar */}
            {activeFormat.id === 'polaroid_sq' && (
              <div className="w-56 sm:w-64 flex flex-col gap-2">
                <div className="aspect-square rounded overflow-hidden bg-stone-200 border border-stone-200/60 shadow-xs">
                  <img src="/images/wedding_sparklers_toast.jpg" alt="Photo Hero" className="w-full h-full object-cover" />
                </div>
                <div className="text-center pt-2 pb-1">
                  {activeStamp && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-mono border border-stone-400/40 mb-1 opacity-80" style={{ color: selectedTheme.text }}>
                      {activeStamp}
                    </span>
                  )}
                  <p style={{ color: selectedTheme.text }} className="font-bold text-xs tracking-wider uppercase truncate">
                    {headline || 'SNAPSTUDIO PHOTO'}
                  </p>
                  <p style={{ color: selectedTheme.text }} className="text-[9px] opacity-75 font-mono mt-0.5 truncate tracking-wide">
                    {tagline || 'SPECIAL EVENT'}
                  </p>
                </div>
              </div>
            )}

            {/* Format: Multi-Collage 5x7 */}
            {activeFormat.id === 'collage_5r' && (
              <div className="w-60 sm:w-72 flex flex-col gap-2">
                <div className="h-28 sm:h-36 rounded overflow-hidden bg-stone-200 border border-stone-200/60 shadow-xs">
                  <img src="/images/wedding_strip_couple.jpg" alt="Photo Big" className="w-full h-full object-cover" />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="h-14 sm:h-16 rounded overflow-hidden bg-stone-200 shadow-xs">
                    <img src="/images/wedding_bouquet_laugh.jpg" alt="Photo 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="h-14 sm:h-16 rounded overflow-hidden bg-stone-200 shadow-xs">
                    <img src="/images/wedding_postcard_candid.jpg" alt="Photo 3" className="w-full h-full object-cover" />
                  </div>
                  <div className="h-14 sm:h-16 rounded overflow-hidden bg-stone-200 shadow-xs">
                    <img src="/images/wedding_polaroid_guests.jpg" alt="Photo 4" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="text-center pt-2 pb-1 border-t border-stone-200/40">
                  {activeStamp && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-mono border border-stone-400/40 mb-1 opacity-80" style={{ color: selectedTheme.text }}>
                      {activeStamp}
                    </span>
                  )}
                  <p style={{ color: selectedTheme.text }} className="font-bold text-xs tracking-wider uppercase truncate">
                    {headline || 'SNAPSTUDIO PHOTO'}
                  </p>
                  <p style={{ color: selectedTheme.text }} className="text-[9px] opacity-75 font-mono mt-0.5 truncate tracking-wide">
                    {tagline || 'SPECIAL EVENT'}
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          <div className="mt-4 text-center">
            <span className="text-[11px] font-mono text-stone-400">
              Format 1:1 proporsional dengan hasil cetak fisik DNP DS620
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
