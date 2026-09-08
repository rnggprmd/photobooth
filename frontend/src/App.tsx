import React, { useState, useEffect } from 'react';
import api from './api';
import { Camera, Sparkles, RefreshCw, CheckCircle2, AlertCircle, Layout, ArrowRight, Layers, Heart } from 'lucide-react';

interface HealthResponse {
  status: string;
  message?: string;
  timestamp?: string;
  php_version?: string;
  laravel_version?: string;
}

export const App: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [backendInfo, setBackendInfo] = useState<HealthResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [snappedPhotos, setSnappedPhotos] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'normal' | 'vintage' | 'bw' | 'cyber'>('normal');

  const checkBackendHealth = async () => {
    setBackendStatus('checking');
    setErrorMessage('');
    try {
      const response = await api.get<HealthResponse>('/health');
      setBackendStatus('online');
      setBackendInfo(response.data);
    } catch (err: any) {
      setBackendStatus('offline');
      setErrorMessage(err?.message || 'Gagal terhubung ke Laravel Backend');
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const triggerSnap = () => {
    if (countdown !== null) return;
    let count = 3;
    setCountdown(count);

    const timer = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(timer);
        setCountdown(null);
        // Add photo snapshot placeholder or dynamic gradient
        const photoColors = [
          'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
          'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
          'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          'linear-gradient(135deg, #10b981 0%, #84cc16 100%)',
        ];
        const randomColor = photoColors[Math.floor(Math.random() * photoColors.length)];
        setSnappedPhotos((prev) => [randomColor, ...prev.slice(0, 3)]);
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px var(--accent-glow)'
            }}>
              <Camera size={22} color="#fff" />
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Photobooth <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Studio</span>
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Laravel 11 REST API (Backend) + React Vite (Frontend)
          </p>
        </div>

        {/* Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {backendStatus === 'online' ? (
            <div className="badge-connected">
              <span className="dot-pulse"></span>
              <CheckCircle2 size={16} />
              <span>Laravel API: Online</span>
            </div>
          ) : backendStatus === 'checking' ? (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#818cf8',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              <RefreshCw size={14} style={{ animation: 'spin 1.5s linear infinite' }} />
              <span>Memeriksa Backend...</span>
            </div>
          ) : (
            <div className="badge-disconnected" title={errorMessage}>
              <AlertCircle size={16} />
              <span>Backend Offline</span>
            </div>
          )}

          <button 
            onClick={checkBackendHealth}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: '10px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 500
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        {/* Left Column: Booth Camera Mockup & Action */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#ec4899" /> Live Camera Booth
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>1080p Studio Preview</span>
          </div>

          {/* Viewfinder box */}
          <div style={{
            width: '100%',
            aspectRatio: '4/3',
            background: '#040711',
            borderRadius: '16px',
            border: '2px dashed rgba(255, 255, 255, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: selectedFilter === 'vintage' ? 'sepia(0.6) contrast(1.1)' : selectedFilter === 'bw' ? 'grayscale(1)' : selectedFilter === 'cyber' ? 'hue-rotate(90deg) contrast(1.2)' : 'none',
            transition: 'filter 0.3s ease'
          }}>
            {countdown !== null ? (
              <div style={{
                fontSize: '5rem',
                fontWeight: 800,
                color: '#fff',
                textShadow: '0 0 30px rgba(236, 72, 153, 0.8)',
                animation: 'pulse 1s infinite'
              }}>
                {countdown}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Camera size={48} color="rgba(255, 255, 255, 0.25)" style={{ marginBottom: '12px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Siap mengambil foto photobooth Anda
                </p>
              </div>
            )}

            {/* Viewfinder frame corners */}
            <div style={{ position: 'absolute', top: 16, left: 16, width: 24, height: 24, borderTop: '2px solid #6366f1', borderLeft: '2px solid #6366f1' }} />
            <div style={{ position: 'absolute', top: 16, right: 16, width: 24, height: 24, borderTop: '2px solid #6366f1', borderRight: '2px solid #6366f1' }} />
            <div style={{ position: 'absolute', bottom: 16, left: 16, width: 24, height: 24, borderBottom: '2px solid #6366f1', borderLeft: '2px solid #6366f1' }} />
            <div style={{ position: 'absolute', bottom: 16, right: 16, width: 24, height: 24, borderBottom: '2px solid #6366f1', borderRight: '2px solid #6366f1' }} />
          </div>

          {/* Filter options */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {(['normal', 'vintage', 'bw', 'cyber'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  background: selectedFilter === filter ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedFilter === filter ? '#818cf8' : 'var(--text-muted)',
                  border: selectedFilter === filter ? '1px solid #6366f1' : '1px solid var(--border-color)',
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Capture Trigger Button */}
          <div style={{ marginTop: '24px' }}>
            <button
              onClick={triggerSnap}
              disabled={countdown !== null}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                background: 'var(--accent-gradient)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 10px 25px var(--accent-glow)',
                opacity: countdown !== null ? 0.7 : 1,
              }}
            >
              <Camera size={20} />
              {countdown !== null ? 'Memotret...' : 'Ambil Foto (Countdown 3s)'}
            </button>
          </div>
        </div>

        {/* Right Column: Photo Strip & Backend Integration Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Recent Strip Preview */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="#6366f1" /> Photostrip Preview
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{snappedPhotos.length} hasil jepretan</span>
            </div>

            {snappedPhotos.length === 0 ? (
              <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Heart size={28} color="rgba(255,255,255,0.15)" style={{ marginBottom: '8px' }} />
                <p>Klik tombol <b>Ambil Foto</b> untuk membuat strip photobooth pertama Anda.</p>
              </div>
            ) : (
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                gap: '10px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                justifyContent: 'center'
              }}>
                {snappedPhotos.map((bg, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      aspectRatio: '3/4',
                      borderRadius: '8px',
                      background: bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    #{idx + 1}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Backend Info Box */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layout size={18} color="#34d399" /> Detail Arsitektur Project
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Backend:</span>
                <span style={{ fontWeight: 600 }}>Laravel 11 (REST API)</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Frontend:</span>
                <span style={{ fontWeight: 600 }}>React 19 + Vite</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>GitHub Repository:</span>
                <a 
                  href="https://github.com/rnggprmd/photobooth" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  rnggprmd/photobooth <ArrowRight size={14} />
                </a>
              </li>
              {backendInfo && (
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Versi PHP / Laravel:</span>
                  <span style={{ fontWeight: 600, color: '#34d399' }}>
                    {backendInfo.php_version || '8.3'} / {backendInfo.laravel_version || '11.x'}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
