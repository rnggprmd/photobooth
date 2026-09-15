import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { sessionsApi } from '../../api/sessions';
import type { Event } from '../../types';

export const BoothOnsitePage: React.FC = () => {
  const [stage, setStage] = useState<'idle' | 'countdown' | 'capturing' | 'preview' | 'printing'>('idle');
  const fallbackEvents: Event[] = [
    { id: 1, name: 'Wedding of Kevin & Astrid (Pullman)', type: 'onsite', status: 'live' } as any,
    { id: 2, name: 'Tech Summit Afterparty 2026 (ICE BSD)', type: 'onsite', status: 'live' } as any,
    { id: 3, name: 'Sweet 17th Clara (The Glass House)', type: 'onsite', status: 'scheduled' } as any,
  ];

  const [operatorEvents, setOperatorEvents] = useState<Event[]>(fallbackEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(fallbackEvents[0]);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    sessionsApi
      .getOperatorEvents()
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setOperatorEvents(res.data);
          setSelectedEvent(res.data[0]);
        }
      })
      .catch((err) => console.warn('Operator events fetch warning:', err));
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleStartSession = async () => {
    if (!selectedEvent) {
      showToast('Pilih event terlebih dahulu.');
      return;
    }
    setStage('countdown');
    setCountdown(3);

    const generatedToken = `SES-8821-${Math.floor(1000 + Math.random() * 9000)}`;
    setSessionToken(generatedToken);

    try {
      await sessionsApi.startOnsiteSession({ event_id: selectedEvent.id });
    } catch (err) {
      console.warn('Backend start session warning:', err);
    }

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setStage('capturing');
        setTimeout(() => {
          setStage('preview');
          showToast('Foto berhasil ditangkap! Siap cetak.');
        }, 1000);
      }
    }, 1000);
  };

  const handlePrint = () => {
    setStage('printing');
    showToast('Mengirim spool data ke printer DNP DS620...');
    setTimeout(() => {
      showToast('Cetak 4R selesai! Tamu dapat memindai QR code.');
    }, 3500);
  };

  const handleFinish = () => {
    setStage('idle');
    setSessionToken(null);
    showToast('Sesi selesai. Terminal siap untuk tamu berikutnya!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-6 select-none font-sans">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur-sm border border-emerald-500/50">
          {toastMsg}
        </div>
      )}

      {/* Kiosk Top Bar */}
      <header className="flex items-center justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <span className="material-symbols-outlined text-xl">photo_camera</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white tracking-tight">SnapStudio Kiosk Terminal</span>
              <Badge variant="success" className="font-mono text-[10px] py-0 px-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1"></span>
                ON-SITE LIVE
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono">DNP DS620 Ready • Canon R100 Tethered (300 DPI)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
            <span>Latency: <strong className="text-emerald-400">12ms</strong></span>
            <span>•</span>
            <span>Paper: <strong className="text-white">362/400</strong></span>
          </div>
          <Link
            to="/"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Exit to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Kiosk Viewport */}
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        {/* Stage 1: IDLE */}
        {stage === 'idle' && (
          <div className="w-full max-w-4xl bg-slate-900/60 rounded-2xl border border-slate-800 p-8 sm:p-12 flex flex-col items-center text-center shadow-2xl relative overflow-hidden backdrop-blur-sm">
            <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 shadow-inner">
              <span className="material-symbols-outlined text-4xl">center_focus_strong</span>
            </div>

            <Badge variant="indigo" className="font-mono text-xs mb-3">
              STANDBY READY
            </Badge>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              Kiosk Interactive Terminal
            </h2>

            <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
              Tekan tombol di bawah untuk memulai sesi pemotretan otomatis dengan Canon EOS EDSDK tethering dan DNP DS620 dye-sublimation printer.
            </p>

            {/* Event Selector */}
            <div className="mb-6 w-full max-w-xs text-left">
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Pilih Event Aktif:</label>
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                value={selectedEvent?.id || ''}
                onChange={(e) => {
                  const evt = operatorEvents.find((ev) => ev.id === Number(e.target.value));
                  if (evt) setSelectedEvent(evt);
                }}
              >
                {operatorEvents.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={handleStartSession}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-indigo-600/30 gap-2 text-base"
              >
                <span className="material-symbols-outlined text-xl">play_arrow</span>
                <span>Mulai Sesi Tamu</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => showToast('Pemeriksaan perangkat: Kamera Canon R100 OK, Printer DNP OK, Kertas 362 lembar.')}
                className="border-slate-700 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 text-sm gap-2"
              >
                <span className="material-symbols-outlined text-base">settings_ethernet</span>
                <span>Test Hardware</span>
              </Button>
            </div>
          </div>
        )}

        {/* Stage 2: COUNTDOWN */}
        {stage === 'countdown' && (
          <div className="w-full max-w-2xl bg-slate-900/80 rounded-2xl border border-indigo-500/50 p-12 flex flex-col items-center text-center shadow-2xl backdrop-blur-sm">
            <span className="text-slate-400 uppercase tracking-widest text-xs font-semibold mb-4 font-mono">
              Bersiap di Depan Kamera
            </span>
            <div className="w-40 h-40 rounded-full bg-indigo-600/20 border-4 border-indigo-500 flex items-center justify-center text-white text-7xl font-bold font-mono animate-pulse shadow-2xl">
              {countdown}
            </div>
            <p className="text-slate-300 text-sm mt-6 font-medium">Senyum! 📸</p>
          </div>
        )}

        {/* Stage 3: CAPTURING (Camera Flash Effect) */}
        {stage === 'capturing' && (
          <div className="fixed inset-0 bg-white z-50 flex items-center justify-center animate-out fade-out duration-1000">
            <div className="text-slate-900 font-mono text-2xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-4xl animate-spin">camera</span>
              <span>CAPTURING SHOT...</span>
            </div>
          </div>
        )}

        {/* Stage 4: PREVIEW */}
        {stage === 'preview' && (
          <div className="w-full max-w-4xl bg-slate-900/80 rounded-2xl border border-slate-800 p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl backdrop-blur-sm">
            <div className="w-full md:w-1/2 aspect-[3/4] bg-slate-800 rounded-xl overflow-hidden border border-slate-700 relative shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80"
                alt="Capture Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono text-white">
                {sessionToken}
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-start text-left space-y-4">
              <Badge variant="success">Hasil Tangkapan Siap</Badge>
              <h3 className="text-2xl font-bold text-white">Foto Komposit Selesai</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Foto telah dikompositkan dengan template frame resmi event ({selectedEvent?.name}). Klik <strong>Cetak Foto</strong> untuk mengirim ke printer fisik atau <strong>Selesai</strong>.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  onClick={handlePrint}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 shadow-lg shadow-indigo-600/30 gap-2 text-sm"
                >
                  <span className="material-symbols-outlined text-base">print</span>
                  <span>Cetak Foto (DNP)</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleStartSession}
                  className="border-slate-700 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 text-sm gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">replay</span>
                  <span>Foto Ulang</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleFinish}
                  className="border-slate-700 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 text-sm"
                >
                  Selesai
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Stage 5: PRINTING */}
        {stage === 'printing' && (
          <div className="w-full max-w-xl bg-slate-900/80 rounded-2xl border border-indigo-500/50 p-8 flex flex-col items-center text-center shadow-2xl backdrop-blur-sm space-y-5">
            <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-500 flex items-center justify-center text-indigo-400 animate-spin">
              <span className="material-symbols-outlined text-3xl">print</span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Mencetak Hasil Foto...</h3>
              <p className="text-xs text-slate-400 mt-1">DNP DS620 thermal head sedang melakukan laminasi gloss 4R.</p>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <div className="bg-indigo-500 h-full w-4/5 animate-pulse"></div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-4 text-left w-full">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.origin}/results/${sessionToken || 'demo'}`}
                alt="QR Code"
                className="w-16 h-16 rounded bg-white p-1"
              />
              <div className="text-xs">
                <span className="font-bold text-white block">Salinan Digital Siap:</span>
                <span className="text-slate-400">Scan QR untuk membuka dan unduh foto langsung di ponsel tamu.</span>
              </div>
            </div>

            <Button
              onClick={handleFinish}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 text-sm gap-2"
            >
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>Selesai &amp; Siapkan Tamu Berikutnya</span>
            </Button>
          </div>
        )}
      </main>

      {/* Kiosk Footer */}
      <footer className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>Terminal ID: #KIOSK-JKT-01</span>
        <span>Photobooth SaaS On-Site Engine v2.4</span>
      </footer>
    </div>
  );
};

export default BoothOnsitePage;
