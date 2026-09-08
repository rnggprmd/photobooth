import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { sessionsApi } from '../../api/sessions';
import type { Event } from '../../types';

export const BoothOnsitePage: React.FC = () => {
  const [stage, setStage] = useState<'idle' | 'countdown' | 'capturing' | 'preview' | 'printing'>('idle');
  const [operatorEvents, setOperatorEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    sessionsApi
      .getOperatorEvents()
      .then((res) => {
        if (res.data) {
          const evts = Array.isArray(res.data) ? res.data : [];
          setOperatorEvents(evts);
          if (evts.length > 0) setSelectedEvent(evts[0]);
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
    try {
      const res = await sessionsApi.startOnsiteSession({ event_id: selectedEvent.id });
      const token = res.data?.session_token || null;
      setSessionToken(token);
      showToast(`Sesi dimulai! Token: ${token || 'N/A'}`);
      setStage('capturing');
    } catch (err: any) {
      console.warn('Start session error:', err);
      showToast('Gagal memulai sesi. Coba kembali.');
      setStage('idle');
    }
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
        <div className="w-full max-w-4xl bg-slate-900/60 rounded-2xl border border-slate-800 p-8 sm:p-12 flex flex-col items-center text-center shadow-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 shadow-inner">
            <span className="material-symbols-outlined text-4xl">center_focus_strong</span>
          </div>

          <Badge variant="indigo" className="font-mono text-xs mb-3">
            KIOSK STAGE: {stage.toUpperCase()}
          </Badge>

          {sessionToken && (
            <p className="text-xs text-slate-500 font-mono mb-2">Token: {sessionToken}</p>
          )}

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Interactive Capture Viewport
          </h2>

          <p className="text-slate-400 text-sm max-w-md mb-4 leading-relaxed">
            Kiosk mode connects to Canon EOS EDSDK USB stream, provides automatic countdown triggers, dynamic audio cues, and composite template rendering.
          </p>

          {/* Event Selector */}
          {operatorEvents.length > 0 && (
            <div className="mb-6 w-full max-w-xs">
              <label className="block text-xs text-slate-500 mb-1 font-mono">Pilih Event:</label>
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
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
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={handleStartSession}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 shadow-lg shadow-indigo-600/30 gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-base">play_arrow</span>
              <span>Mulai Sesi ({stage})</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => showToast('Simulasi hardware test: Kamera & Printer OK.')}
              className="border-slate-700 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 text-sm gap-2"
            >
              <span className="material-symbols-outlined text-base">settings_ethernet</span>
              <span>Test Hardware</span>
            </Button>
          </div>
        </div>
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
