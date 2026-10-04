import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedNumber } from './AnimatedNumber';
import { TrendingUp, ArrowRight, ChevronDown, Copy, CheckCircle2 } from 'lucide-react';

const DEFAULT_MATERIAL_PER_EVENT = 350000;
const SOFTWARE_PER_MONTH = 239000;

const EVENT_PRESETS = [4, 8, 12, 16];
const RATE_PRESETS = [2000000, 2500000, 3500000, 4500000];

const rupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

export const LandingCalculator: React.FC = () => {
  const [events, setEvents] = useState(6);
  const [rate, setRate] = useState(2500000);
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);
  const [materialPerEvent, setMaterialPerEvent] = useState(DEFAULT_MATERIAL_PER_EVENT);
  const [copiedToast, setCopiedToast] = useState(false);

  const gross = events * rate;
  const material = events * materialPerEvent;
  const net = gross - material - SOFTWARE_PER_MONTH;
  const softwarePct = (SOFTWARE_PER_MONTH / gross) * 100;
  const netPct = Math.max(0, (net / gross) * 100);
  const materialPct = (material / gross) * 100;
  const annualNet = net * 12;

  const handleCopySummary = () => {
    const text = `Simulasi Omset SnapStudio:\n• ${events} Event/Bulan @ ${rupiah(rate)}\n• Omset Bruto: ${rupiah(gross)}\n• Estimasi Laba Bersih: ${rupiah(net)}/bln (${netPct.toFixed(0)}%)\n• Estimasi 1 Tahun: ${rupiah(annualNet)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  return (
    <section id="calculator" className="w-full py-16 lg:py-24 bg-[#faf8f5] border-b border-stone-200/90 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header — editorial split */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-16 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-5 items-start max-w-2xl"
          >
            <div className="hidden sm:flex flex-col items-center gap-1 pt-2 shrink-0">
              <div className="w-[3px] h-10 bg-amber-400 rounded-full" />
              <div className="w-[3px] h-3 bg-amber-200 rounded-full" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-600 block mb-2">
                Simulasi Profitabilitas Booth
              </span>
              <h2 className="font-heading-xl text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-950 leading-[1.08]">
                Berapa sisa uang dari satu bulan event?
              </h2>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-sm lg:text-right shrink-0"
          >
            Geser jumlah event dan tarif sewa. Margin keuntungan bersih ter-update real-time lengkap dengan rincian biaya bahan cetak.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Interactive Controls & Slider Deck (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Slider 1: Events */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3.5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <label htmlFor="calc-events" className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                    Frekuensi Acara
                  </label>
                  <span className="text-sm font-bold text-stone-900 mt-0.5 block">
                    Jumlah Event per Bulan
                  </span>
                </div>
                <span className="font-heading-xl text-2xl sm:text-3xl font-extrabold text-stone-950 tabular-nums">
                  {events} <span className="text-sm font-normal text-stone-500">Event</span>
                </span>
              </div>

              {/* Slider Track with enlarged mobile touch area */}
              <div className="py-2">
                <input
                  id="calc-events"
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={events}
                  onChange={(e) => setEvents(Number(e.target.value))}
                  className="w-full h-3 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500 touch-pan-x"
                />
              </div>

              {/* Presets with Thumb-Friendly >= 44px tap targets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {EVENT_PRESETS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setEvents(n)}
                    className={`min-h-11 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center text-center ${
                      events === n
                        ? 'bg-stone-950 text-white border-stone-950 shadow-xs'
                        : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                    }`}
                  >
                    {n} Event
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 2: Rate */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3.5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <label htmlFor="calc-rate" className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                    Harga Jual Paket
                  </label>
                  <span className="text-sm font-bold text-stone-900 mt-0.5 block">
                    Tarif Sewa Rata-Rata per Event
                  </span>
                </div>
                <span className="font-heading-xl text-2xl sm:text-3xl font-extrabold text-stone-950 tabular-nums">
                  {rupiah(rate)}
                </span>
              </div>

              {/* Slider Track with enlarged touch area */}
              <div className="py-2">
                <input
                  id="calc-rate"
                  type="range"
                  min={1500000}
                  max={6000000}
                  step={250000}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full h-3 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500 touch-pan-x"
                />
              </div>

              {/* Presets with Thumb-Friendly >= 44px tap targets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {RATE_PRESETS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRate(r)}
                    className={`min-h-11 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center text-center ${
                      rate === r
                        ? 'bg-stone-950 text-white border-stone-950 shadow-xs'
                        : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                    }`}
                  >
                    {(r / 1000000).toFixed(1)} Juta
                  </button>
                ))}
              </div>
            </div>

            {/* Break-Even Point Insight Card */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <TrendingUp className="w-4 h-4 text-stone-950" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-950">
                  Titik Impas (BEP) Cepat: Hanya Butuh 1 Event
                </h4>
                <p className="text-xs text-stone-700 mt-0.5 leading-relaxed">
                  Pendapatan 1 event ({rupiah(rate)}) sudah cukup menutup biaya software bulanan dan bahan baku. {events > 1 ? `Event ke-2 hingga ke-${events} adalah 100% laba bersih operasional studio Anda.` : 'Tambah event untuk melipatgandakan keuntungan bersih.'}
                </p>
              </div>
            </div>

            {/* Interactive Cost Breakdown Accordion Drawer */}
            <div className="border border-stone-200 rounded-2xl bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setShowCostBreakdown(!showCostBreakdown)}
                className="w-full min-h-11 px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <span>Atur Biaya Bahan per Event: <span className="tabular-nums text-amber-700">{rupiah(materialPerEvent)}</span></span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${
                    showCostBreakdown ? 'rotate-180 text-stone-900' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {showCostBreakdown && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-4 pb-4 pt-1 text-xs text-stone-600 border-t border-stone-100 space-y-2 bg-stone-50/50"
                  >
                    <label htmlFor="calc-material" className="block text-stone-800 font-semibold pt-2">
                      Biaya kertas, ribbon, sleeve, dan transport per event
                    </label>
                    <input
                      id="calc-material"
                      type="range"
                      min={150000}
                      max={700000}
                      step={25000}
                      value={materialPerEvent}
                      onChange={(e) => setMaterialPerEvent(Number(e.target.value))}
                      className="w-full h-3 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500 touch-pan-x"
                    />
                    <div className="flex justify-between text-[11px] text-stone-500 tabular-nums">
                      <span>{rupiah(150000)}</span>
                      <button
                        type="button"
                        onClick={() => setMaterialPerEvent(DEFAULT_MATERIAL_PER_EVENT)}
                        className="min-h-8 px-2 font-semibold text-stone-700 underline underline-offset-2 hover:text-stone-950 cursor-pointer"
                      >
                        Kembali ke angka contoh ({rupiah(DEFAULT_MATERIAL_PER_EVENT)})
                      </button>
                      <span>{rupiah(700000)}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Angka contoh hanya titik awal. Isi dengan harga riil bahan Anda supaya proyeksi laba sesuai kondisi studio.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>

          {/* Right Column: Dynamic Cashflow Card (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 p-[1px] rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(120,113,108,0.4) 0%, rgba(245,158,11,0.5) 40%, rgba(120,113,108,0.2) 100%)',
            }}
          >
            <div className="bg-stone-950 text-white rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">

            {/* Background Subtle Gradient */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25 z-0"
              style={{
                background: 'radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.3) 0%, transparent 60%)',
              }}
              aria-hidden="true"
            />
            {/* Dot matrix pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.08] z-0"
              style={{
                backgroundImage: 'radial-gradient(rgba(245,158,11,0.8) 1px, transparent 1px)',
                backgroundSize: '18px 18px',
                maskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black 30%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black 30%, transparent 80%)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 space-y-5 sm:space-y-6">
              
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400/70 font-bold block mb-2">
                  Proyeksi Keuntungan Bersih
                </span>
                <div className="font-heading-xl text-4xl sm:text-6xl font-black text-amber-400 tracking-tight tabular-nums leading-none">
                  <AnimatedNumber value={net} prefix="Rp " />
                </div>
                <p className="text-xs text-stone-400 mt-2 font-medium">
                  Sisa laba bersih per bulan dari omset bruto {rupiah(gross)}
                </p>
              </div>

              {/* Dynamic Revenue Allocation Bar */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-mono text-stone-300">
                  <span>Distribusi Alokasi Omset:</span>
                  <span className="text-amber-400 font-bold">{netPct.toFixed(0)}% Laba Bersih</span>
                </div>

                <div className="h-3 w-full bg-stone-900 rounded-full overflow-hidden flex p-0.5 border border-stone-800">
                  <motion.div
                    className="h-full bg-amber-400 rounded-l-full"
                    animate={{ width: `${netPct}%` }}
                    transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                  />
                  <motion.div
                    className="h-full bg-stone-500"
                    animate={{ width: `${materialPct}%` }}
                    transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                  />
                  <motion.div
                    className="h-full bg-emerald-400 rounded-r-full"
                    animate={{ width: `${softwarePct}%` }}
                    transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                  />
                </div>
              </div>

              {/* Breakdown List */}
              <div className="space-y-2.5 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="text-stone-200 font-medium">Laba Bersih Studio</span>
                  </div>
                  <div className="font-mono font-bold text-white text-right">
                    <AnimatedNumber value={net} prefix="Rp " />
                    <span className="text-[10px] text-amber-400 ml-1.5 font-normal">({netPct.toFixed(0)}%)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-500 shrink-0" />
                    <span className="text-stone-300 font-medium">Kertas Cetak &amp; Souvenir</span>
                  </div>
                  <div className="font-mono font-semibold text-stone-200 text-right">
                    {rupiah(material)}
                    <span className="text-[10px] text-stone-400 ml-1.5 font-normal">({materialPct.toFixed(0)}%)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-stone-300 font-medium">Platform SnapStudio</span>
                  </div>
                  <div className="font-mono font-semibold text-stone-200 text-right">
                    {rupiah(SOFTWARE_PER_MONTH)}
                    <span className="text-[10px] text-emerald-400 ml-1.5 font-normal">({softwarePct.toFixed(1)}%)</span>
                  </div>
                </div>
              </div>

              {/* Annual Estimate Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-xs flex items-center justify-between">
                <div>
                  <span className="text-stone-300 block text-[11px]">Estimasi Akumulasi 1 Tahun:</span>
                  <span className="font-mono text-lg font-bold text-amber-400 mt-0.5 block">
                    <AnimatedNumber value={annualNet} prefix="Rp " />
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="min-h-11 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedToast ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{copiedToast ? 'Disalin!' : 'Salin'}</span>
                </button>
              </div>

              {/* CTA Action */}
              <div className="pt-1">
                <a
                  href="#pricing"
                  className="w-full min-h-11 px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer group"
                >
                  <span>Pilih Paket Langganan Sesuai Armada</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

            </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
