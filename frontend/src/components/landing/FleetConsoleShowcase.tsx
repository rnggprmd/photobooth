import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Printer,
  RotateCcw,
  Bell,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Camera,
  Activity,
  Terminal,
  Eye,
} from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';

interface FleetEvent {
  id: string;
  title: string;
  venue: string;
  boothId: string;
  camera: string;
  printer: string;
  qrDownloadRate: string;
  cameraTemp: string;
  image: string;
}

const FLEET_EVENTS: FleetEvent[] = [
  {
    id: 'wedding-sarah',
    title: 'Wedding Sarah & Dimas',
    venue: 'Grand Ballroom Hotel Mulia',
    boothId: 'Kiosk #01',
    camera: 'Canon EOS R6 Mark II',
    printer: 'DNP DS620A (USB)',
    qrDownloadRate: '96.4%',
    cameraTemp: '34°C Normal',
    image: '/images/wedding_strip_couple.jpg',
  },
  {
    id: 'gala-mandiri',
    title: 'Gala Dinner Bank Mandiri',
    venue: 'Ritz Carlton Pacific Place',
    boothId: 'Kiosk #02',
    camera: 'Sony Alpha 7 IV',
    printer: 'Citizen CY-02 (USB)',
    qrDownloadRate: '93.8%',
    cameraTemp: '32°C Normal',
    image: '/images/wedding_postcard_candid.jpg',
  },
  {
    id: 'scarlett-launch',
    title: 'Scarlett Activation',
    venue: 'Senayan City Main Atrium',
    boothId: 'Kiosk #03',
    camera: 'Canon EOS R',
    printer: 'DNP DS620A (USB)',
    qrDownloadRate: '98.2%',
    cameraTemp: '31°C Standby',
    image: '/images/wedding_bouquet_laugh.jpg',
  },
];

export const FleetConsoleShowcase: React.FC = () => {
  const [selectedFleetIndex, setSelectedFleetIndex] = useState(0);
  const [crewAlertMessage, setCrewAlertMessage] = useState<string | null>(null);
  const [livePaperRolls, setLivePaperRolls] = useState<number[]>([62, 84, 95]);
  const [liveSessions, setLiveSessions] = useState<number[]>([1482, 1120, 680]);
  const [livePrints, setLivePrints] = useState<number[]>([2118, 1740, 940]);
  const [livePrintJob, setLivePrintJob] = useState<{ text: string; isPrinting: boolean } | null>(null);
  const [showLiveStream, setShowLiveStream] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [role, setRole] = useState<'owner' | 'crew'>('owner');

  const activeEvent = FLEET_EVENTS[selectedFleetIndex];

  const handleSendCrewPing = () => {
    setCrewAlertMessage(`Pesan telemetri terkirim ke kru ${activeEvent.title} di ${activeEvent.venue}: Status sinkronisasi optimal.`);
    setTimeout(() => setCrewAlertMessage(null), 3800);
  };

  const handleRefillPaper = () => {
    setLivePaperRolls((prev) => {
      const next = [...prev];
      next[selectedFleetIndex] = 100;
      return next;
    });
    setCrewAlertMessage(`Roll kertas ${activeEvent.printer} di ${activeEvent.venue} berhasil diisi ulang: 100% (800 lembar).`);
    setTimeout(() => setCrewAlertMessage(null), 3800);
  };

  const handleSimulatePrint = () => {
    if (livePrintJob?.isPrinting) return;

    setLivePrintJob({
      text: `Memproses spooling strip 2x6 ke ${activeEvent.printer}...`,
      isPrinting: true,
    });

    setLiveSessions((prev) => {
      const next = [...prev];
      next[selectedFleetIndex] += 1;
      return next;
    });

    setLivePrints((prev) => {
      const next = [...prev];
      next[selectedFleetIndex] += 2;
      return next;
    });

    setLivePaperRolls((prev) => {
      const next = [...prev];
      if (next[selectedFleetIndex] > 1) next[selectedFleetIndex] -= 1;
      return next;
    });

    setTimeout(() => {
      setLivePrintJob({
        text: `Cetak fisik selesai (8.2 detik)! Galeri QR otomatis terdistribusi.`,
        isPrinting: false,
      });
      setTimeout(() => setLivePrintJob(null), 3000);
    }, 1600);
  };

  return (
    <section id="fleet" className="w-full py-16 lg:py-24 bg-white border-b border-stone-200/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Mission Narrative & Architecture */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            <div>
              {/* Accent bar + label + heading block */}
              <div className="flex gap-4 items-start mb-4">
                <div className="hidden sm:flex flex-col items-center gap-1 pt-1 shrink-0">
                  <div className="w-[3px] h-8 bg-amber-400 rounded-full" />
                  <div className="w-[3px] h-2.5 bg-amber-200 rounded-full" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-600 block mb-2">
                    Manajemen Armada &amp; Multi-Tenant
                  </span>
                  <h2 className="font-heading-xl text-3xl sm:text-5xl font-extrabold text-stone-950 tracking-tight leading-[1.08]">
                    Satu dasbor untuk semua booth dan jadwal event.
                  </h2>
                </div>
              </div>
              <p className="text-xs sm:text-base text-stone-700 leading-relaxed">
                Pantau sisa roll kertas printer dye-sub, antrean cetak, suhu kamera, dan unduhan QR tamu dari satu layar terpusat tanpa harus bolak-balik ke venue.
              </p>
            </div>

            {/* 2 Tactile Architecture Cards */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setRole('owner')}
                aria-pressed={role === 'owner'}
                className={`relative w-full text-left p-4 rounded-2xl border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 overflow-hidden ${
                  role === 'owner' ? 'border-stone-900 bg-white shadow-sm' : 'border-stone-200 bg-stone-50/70 hover:bg-stone-50 hover:border-stone-300'
                }`}
              >
                {/* Active left indicator */}
                {role === 'owner' && (
                  <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-amber-400 rounded-r-full" />
                )}
                <div className="flex items-start gap-3.5 pl-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    role === 'owner' ? 'bg-amber-400 text-stone-950' : 'bg-stone-200/80 text-stone-700'
                  }`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs sm:text-sm font-bold text-stone-950">
                      Ruang Kerja Studio Terisolasi (Multi-Tenant)
                    </span>
                    <span className="block text-xs text-stone-600 mt-1 leading-relaxed">
                      Aset logo, watermark sponsor, template bingkai, dan data foto tiap klien tersimpan terisolasi di workspace studio Anda tanpa risiko tercampur.
                    </span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('crew')}
                aria-pressed={role === 'crew'}
                className={`relative w-full text-left p-4 rounded-2xl border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 overflow-hidden ${
                  role === 'crew' ? 'border-stone-900 bg-white shadow-sm' : 'border-stone-200 bg-stone-50/70 hover:bg-stone-50 hover:border-stone-300'
                }`}
              >
                {/* Active left indicator */}
                {role === 'crew' && (
                  <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-amber-400 rounded-r-full" />
                )}
                <div className="flex items-start gap-3.5 pl-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    role === 'crew' ? 'bg-amber-400 text-stone-950' : 'bg-stone-200/80 text-stone-700'
                  }`}>
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs sm:text-sm font-bold text-stone-950">
                      Akses Kru Lokasi Terkunci PIN Keamanan
                    </span>
                    <span className="block text-xs text-stone-600 mt-1 leading-relaxed">
                      Operator di venue dapat memicu shutter dan mengganti roll kertas tanpa memiliki akses ke laporan omset, billing, dan data finansial pemilik studio.
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Direct Launch CTA */}
            <div className="pt-2">
              <Link
                to="/auth/register"
                className="inline-flex items-center gap-2 min-h-11 px-6 py-3 rounded-xl bg-stone-950 text-white text-xs sm:text-sm font-bold hover:bg-black transition-all shadow-xs hover:shadow-md group"
              >
                <span>Buka Konsol Armada Admin</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Mission Control Telemetry Cockpit */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 bg-stone-950 text-white rounded-3xl p-4 sm:p-7 border border-stone-800 shadow-2xl relative overflow-hidden"
          >
            {/* Background Radar Grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-15 z-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
                `,
                backgroundSize: '24px 24px',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 space-y-4 sm:space-y-5">
              
              {/* Top Station Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="font-mono text-xs font-bold text-white tracking-wide">
                    TELEMETRI ARMADA • 3 KIOSK LIVE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">HEARTBEAT 1 SEC</span>
                  <div className="ml-1 flex items-center p-0.5 rounded-lg bg-stone-900 border border-stone-800">
                    {([['owner', 'Pemilik'], ['crew', 'Kru Venue']] as const).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setRole(id)}
                        aria-pressed={role === id}
                        className={`min-h-8 px-2.5 rounded-md text-[10.5px] font-semibold transition-colors cursor-pointer ${
                          role === id ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Station Selector Tabs (3 Booths) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {FLEET_EVENTS.map((event, idx) => {
                  const isSelected = selectedFleetIndex === idx;
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setSelectedFleetIndex(idx)}
                      className={`min-h-12 p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-stone-900 border-amber-400 text-white ring-1 ring-amber-400/50 shadow-md'
                          : 'bg-stone-900/40 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-900/80'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[10px] font-mono font-bold uppercase ${isSelected ? 'text-amber-400' : 'text-stone-500'}`}>
                          {event.boothId}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-stone-700'}`} />
                      </div>
                      <div className="text-xs font-bold text-white truncate mt-1">
                        {event.title.split(' ')[0]} {event.title.split(' ')[1] || ''}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Venue Details Banner + Remote Live View Button */}
              <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-white text-sm">{activeEvent.title}</div>
                    <div className="text-xs text-stone-400 mt-0.5">{activeEvent.venue}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowLiveStream(!showLiveStream)}
                      className="min-h-8 px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>{showLiveStream ? 'Tutup Feed' : 'Live Frame'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLogs(!showLogs)}
                      className="min-h-8 px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{showLogs ? 'Tutup Log' : 'Logs'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px] text-stone-300 pt-1 border-t border-stone-800/80">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activeEvent.camera.split(' ')[0]} {activeEvent.camera.split(' ')[1]}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Printer className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{activeEvent.printer.split(' ')[0]} {activeEvent.printer.split(' ')[1]}</span>
                  </span>
                </div>

                {/* Simulated Live View Feed Accordion */}
                <AnimatePresence>
                  {showLiveStream && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pt-2"
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-stone-700 bg-black">
                        <img
                          src={activeEvent.image}
                          alt="Live Stream Feed"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          <span>STREAM WEBRTC: 60 FPS</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Simulated Terminal Logs */}
                <AnimatePresence>
                  {showLogs && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pt-2"
                    >
                      <div className="p-2.5 rounded-xl bg-black border border-stone-800 font-mono text-[10px] text-stone-300 space-y-1">
                        <div className="text-emerald-400">[15:35:02] Canon EOS EDSDK tethering hooked. Shutter latency: 28ms</div>
                        <div className="text-stone-400">[15:35:05] DNP DS620 spooler buffer: 0 queued jobs (Ready)</div>
                        <div className="text-amber-400">[15:35:09] SQLite sync: 4 photos buffered locally, cloud ACK received</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Live Metric Counters Triad with AnimatedNumber */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                <div className="p-3 sm:p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800">
                  <span className="text-[10px] sm:text-[11px] text-stone-400 block truncate">Total Sesi Foto</span>
                  <span className="font-mono text-lg sm:text-2xl font-bold text-white mt-0.5 block tabular-nums">
                    <AnimatedNumber value={liveSessions[selectedFleetIndex]} />
                  </span>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800">
                  <span className="text-[10px] sm:text-[11px] text-stone-400 block truncate">Lembar Tercetak</span>
                  <span className="font-mono text-lg sm:text-2xl font-bold text-amber-400 mt-0.5 block tabular-nums">
                    <AnimatedNumber value={livePrints[selectedFleetIndex]} />
                  </span>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800">
                  <span className="text-[10px] sm:text-[11px] text-stone-400 block truncate">Unduhan QR</span>
                  <span className="font-mono text-lg sm:text-2xl font-bold text-emerald-400 mt-0.5 block">
                    {activeEvent.qrDownloadRate}
                  </span>
                </div>
              </div>

              {/* Billing row: visible to the owner, locked for venue crew */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={role}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className={`flex items-center justify-between gap-3 p-3 rounded-2xl border text-xs ${
                    role === 'owner'
                      ? 'bg-stone-900/70 border-stone-800 text-stone-200'
                      : 'bg-stone-950 border-dashed border-stone-700 text-stone-400'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    {role === 'owner' ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <span className="truncate">
                      {role === 'owner' ? 'Laporan omset dan billing studio' : 'Laporan omset dan billing disembunyikan'}
                    </span>
                  </span>
                  <span className="font-mono text-[10.5px] shrink-0 text-stone-400">
                    {role === 'owner' ? 'Akses penuh' : 'Butuh PIN pemilik'}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Live Paper Roll Level Progress Bar & Refill Action */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300 font-medium flex items-center gap-1.5">
                    <Printer className="w-4 h-4 text-stone-400" />
                    <span>Sisa Media Roll {activeEvent.printer.split(' ')[0]}:</span>
                  </span>
                  <span className="font-mono font-bold text-white">
                    {livePaperRolls[selectedFleetIndex]}% ({Math.round(livePaperRolls[selectedFleetIndex] * 8)} / 800 Lembar)
                  </span>
                </div>

                <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${livePaperRolls[selectedFleetIndex]}%` }}
                    transition={{ duration: 0.4 }}
                    className={`h-full rounded-full transition-all ${
                      livePaperRolls[selectedFleetIndex] > 50
                        ? 'bg-emerald-400'
                        : livePaperRolls[selectedFleetIndex] > 25
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                    }`}
                  />
                </div>

                {/* Spooler Print Simulator & Roll Refill Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSimulatePrint}
                      disabled={livePrintJob?.isPrinting}
                      className="min-h-11 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
                    >
                      <Printer className="w-3.5 h-3.5 text-stone-950" />
                      <span>{livePrintJob?.isPrinting ? 'Sedang Spooling...' : 'Uji Cetak Spooler (8.2s)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRefillPaper}
                      className="min-h-11 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                      <span>Refill Roll (100%)</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-stone-400 font-mono">
                    Buffer Sync: Online
                  </span>
                </div>
              </div>

              {/* Simulated Spooler Printing Job Banner */}
              <AnimatePresence>
                {livePrintJob && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                      livePrintJob.isPrinting
                        ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                        : 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                    }`}
                  >
                    {livePrintJob.isPrinting ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span>{livePrintJob.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Simulated Crew Notification Alert Banner */}
              <AnimatePresence>
                {crewAlertMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-800 text-emerald-200 text-xs font-semibold flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{crewAlertMessage}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCrewAlertMessage(null)}
                      className="min-h-8 text-xs font-bold text-emerald-400 hover:text-white underline cursor-pointer ml-2"
                    >
                      Tutup
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Telemetry Health & Crew Dispatch Bar */}
              <div className="pt-3 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-stone-400 font-mono text-[11px]">
                  Sensor Kamera: <strong className="text-white">{activeEvent.cameraTemp}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleSendCrewPing}
                  className="min-h-11 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kirim Alert ke Kru Venue</span>
                </button>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
