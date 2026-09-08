import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { sessionsApi } from '../../api/sessions';

export const BoothOnlinePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [eventInfo, setEventInfo] = useState<any>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    sessionsApi
      .getOnlineEventInfo(slug)
      .then((res) => {
        if (res.data) setEventInfo(res.data);
      })
      .catch((err) => console.warn('Online event info fetch warning:', err));
  }, [slug]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleStartOnlineSession = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await sessionsApi.startOnlineSession(slug, {
        customer_name: 'Online Guest',
      });
      const token = res.data?.session_token || null;
      setSessionToken(token);
      showToast(`Sesi online dimulai! Token: ${token || 'N/A'}`);
    } catch (err: any) {
      console.warn('Start online session error:', err);
      showToast('Gagal memulai sesi online. Pastikan event aktif.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-6 select-none font-sans">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-purple-600/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur-sm border border-purple-500/50">
          {toastMsg}
        </div>
      )}

      {/* Online Top Bar */}
      <header className="flex items-center justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <span className="material-symbols-outlined text-xl">language</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white tracking-tight">SnapStudio Online Virtual Booth</span>
              <Badge variant="indigo" className="font-mono text-[10px] py-0 px-2 bg-purple-500/20 text-purple-300 border-purple-500/30">
                WEB BOOTH
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Event: {eventInfo?.name || slug || 'demo-event'}
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Exit to Dashboard
        </Link>
      </header>

      {/* Main Virtual Booth Viewport */}
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-xl bg-slate-900/60 rounded-2xl border border-slate-800 p-8 sm:p-12 flex flex-col items-center text-center shadow-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 shadow-inner">
            <span className="material-symbols-outlined text-4xl">stay_current_portrait</span>
          </div>

          <Badge variant="success" className="font-mono text-xs mb-3">
            {sessionToken ? 'SESSION ACTIVE' : 'GUEST ACCESS GRANTED'}
          </Badge>

          {sessionToken && (
            <p className="text-xs text-slate-500 font-mono mb-2">Session: {sessionToken}</p>
          )}

          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            Ambil Foto Virtual
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm max-w-sm mb-8 leading-relaxed">
            Akses kamera browser di smartphone Anda, pilih template custom, dan unduh foto langsung dalam resolusi tinggi atau bagikan via WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <Button
              onClick={handleStartOnlineSession}
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 shadow-lg shadow-purple-600/30 gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-base">photo_camera</span>
              <span>{loading ? 'Memulai...' : 'Buka Kamera'}</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => showToast('Membuka file picker galeri foto...')}
              className="border-slate-700 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 text-sm gap-2"
            >
              <span className="material-symbols-outlined text-base">upload_file</span>
              <span>Upload Foto</span>
            </Button>
          </div>
        </div>
      </main>

      {/* Virtual Booth Footer */}
      <footer className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>SaaS Cloud Virtual Engine v2.4</span>
        <span>Secure AWS S3 Jakarta Gateway</span>
      </footer>
    </div>
  );
};

export default BoothOnlinePage;
