import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { dashboardApi } from '../../api/dashboard';

export const DashboardPage: React.FC = () => {
  const { user, tenant } = useAuthStore();
  const [showTelemetryAlert, setShowTelemetryAlert] = useState(true);
  const [eventTab, setEventTab] = useState<'all' | 'onsite' | 'hybrid'>('all');
  const [searchSession, setSearchSession] = useState('');
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  // Sample real-time sessions data aligned with BRD & PRD
  const [sessions, setSessions] = useState([
    {
      id: '#SES-8821-0492',
      time: '14:28:12 WIB',
      event: 'Wedding Kevin & Astrid',
      location: 'Pullman Ballroom 2',
      mode: 'On-Site Kiosk 01',
      modeType: 'onsite',
      template: '4R Minimalist Gold',
      templateDetail: '3 Shots / Strip',
      captures: '3 Foto',
      printed: 'Printed (2x)',
      delivery: 'Scanned',
    },
    {
      id: '#SES-8821-0491',
      time: '14:24:50 WIB',
      event: 'Tech Summit Afterparty',
      location: 'ICE BSD Hall 3',
      mode: 'Online Web Booth',
      modeType: 'online',
      template: 'Cyber Glitch 2R',
      templateDetail: '2 Shots / Vertical',
      captures: '2 Foto',
      printed: 'Cloud Sync',
      delivery: 'Saved (App)',
    },
    {
      id: '#SES-8821-0490',
      time: '14:19:04 WIB',
      event: 'Wedding Kevin & Astrid',
      location: 'Pullman Ballroom 2',
      mode: 'On-Site Kiosk 02',
      modeType: 'onsite',
      template: '4R Minimalist Gold',
      templateDetail: '3 Shots / Strip',
      captures: '3 Foto',
      printed: 'Printed (1x)',
      delivery: 'Belum Scan',
    },
    {
      id: '#SES-8821-0489',
      time: '14:15:33 WIB',
      event: 'Tech Summit Afterparty',
      location: 'ICE BSD Hall 3',
      mode: 'On-Site Kiosk 01',
      modeType: 'onsite',
      template: 'Modern Minimalist Polar',
      templateDetail: '4 Shots Grid',
      captures: '4 Foto',
      printed: 'Printed (2x)',
      delivery: 'Scanned (3 Org)',
    },
  ]);

  useEffect(() => {
    dashboardApi
      .get()
      .then((res) => {
        if (res.data) {
          setDashboardStats(res.data);
          if (res.data.sessions && res.data.sessions.length > 0) {
            const beSessions = res.data.sessions.map((s: any) => ({
              id: `#SES-${String(s.id).padStart(4, '0')}`,
              time: s.created_at ? new Date(s.created_at).toLocaleTimeString('id-ID') + ' WIB' : '14:28:12 WIB',
              event: s.event?.name || 'Live Event',
              location: s.event?.location || 'Pullman Ballroom 2',
              mode: s.mode === 'onsite' ? 'On-Site Kiosk' : 'Online Web Booth',
              modeType: s.mode || 'onsite',
              template: s.template?.name || '4R Minimalist Gold',
              templateDetail: `${s.photo_count || 3} Shots`,
              captures: `${s.photo_count || 3} Foto`,
              printed: s.printed_at ? 'Printed (1x)' : 'Cloud Sync',
              delivery: s.qr_scanned_at ? 'Scanned' : 'Belum Scan',
            }));
            setSessions((prev) => [...beSessions, ...prev.slice(beSessions.length)]);
          }
        }
      })
      .catch((err) => console.warn('Dashboard fetch warning:', err));
  }, []);

  const filteredSessions = sessions.filter(
    (s) =>
      s.id.toLowerCase().includes(searchSession.toLowerCase()) ||
      s.event.toLowerCase().includes(searchSession.toLowerCase()) ||
      s.template.toLowerCase().includes(searchSession.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Operational Alert / Hardware Health Ribbon */}
      {showTelemetryAlert && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">sensors</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-0.5">
              <span className="text-xs font-semibold text-slate-900">Hardware Telemetry:</span>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Kiosk Terminal 01 (Pullman Jakarta)
                </span>
                <span className="text-slate-300">•</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[11px] font-medium border border-slate-200">
                  Kertas 4R: Sisa 38 Lembar
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">DNP Ribbon Tinta OK (92%)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
            <Link
              to="/settings"
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors border border-slate-200"
            >
              Detail Hardware
            </Link>
            <button
              onClick={() => setShowTelemetryAlert(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Tutup Alert"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Header Section & Operational Status Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-semibold tracking-wide uppercase">
              Multi-Tenant Core
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-xs text-slate-500">Tenant #ID-8821</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Selamat Pagi, {user?.name || 'Studio Admin'}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-medium text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{tenant?.name || 'Lumina Photostudio Bali'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-slate-400">event_available</span>
              <span>2 Event Berlangsung Hari Ini</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-slate-400">desktop_windows</span>
              <span>On-Site: 3 Terminal Aktif</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-slate-400">wifi_tethering</span>
              <span>Online: Web Link Aktif</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Group */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/templates"
            className="px-3 py-2 rounded-lg bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all flex items-center gap-1.5 border border-slate-200 shadow-xs"
          >
            <span className="material-symbols-outlined text-[17px] text-slate-500">add_photo_alternate</span>
            <span>Upload Template</span>
          </Link>
          <Link
            to="/booth/onsite"
            className="px-3 py-2 rounded-lg bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all flex items-center gap-1.5 border border-slate-200 shadow-xs"
          >
            <span className="material-symbols-outlined text-[17px] text-slate-500">terminal</span>
            <span>Buka Kiosk</span>
          </Link>
          <Link
            to="/events"
            className="px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[17px]">add_circle</span>
            <span>+ Buat Event Baru</span>
          </Link>
        </div>
      </div>

      {/* KPI / Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Sesi Bulan Ini
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
              <span className="material-symbols-outlined text-[16px]">photo_camera_front</span>
            </div>
          </div>
          <div className="my-1">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {dashboardStats?.metrics?.today_sessions ? dashboardStats.metrics.today_sessions : 1428}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs">
              <span className="material-symbols-outlined text-[14px] text-emerald-600 font-semibold">trending_up</span>
              <span className="font-semibold text-emerald-600">+18.4%</span>
              <span className="text-slate-400">vs bulan lalu</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 bg-slate-50 rounded-lg p-2 flex items-center justify-between border border-slate-100 text-[11px]">
            <span className="font-medium text-slate-700">82% Kuota</span>
            <span className="font-mono text-slate-500">2,000 Maks</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Event Aktif
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
              <span className="material-symbols-outlined text-[16px]">event_seat</span>
            </div>
          </div>
          <div className="my-1">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              14 <span className="text-xs font-normal text-slate-500 font-sans">Event</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="font-medium text-slate-700">3 Live Hari Ini</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400">11 Jadwal</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 flex items-center gap-1.5 text-slate-500 text-[11px]">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            <span>Peak: Sabtu & Minggu Ini</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Pendapatan Sewa
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
              <span className="material-symbols-outlined text-[16px]">payments</span>
            </div>
          </div>
          <div className="my-1">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              Rp 42.85M
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs">
              <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                94% Lunas
              </span>
              <span className="text-slate-400">Bulan Berjalan</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 flex items-center justify-between text-[11px] text-slate-500">
            <span>Invoice Selesai</span>
            <span className="font-mono font-medium text-slate-800">32 / 34</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Output Cetak & QR
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
              <span className="material-symbols-outlined text-[16px]">burst_mode</span>
            </div>
          </div>
          <div className="my-1">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              4,896
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>QR: <strong className="text-slate-800 font-medium">91.2%</strong></span>
              <span>Print: <strong className="text-slate-800 font-medium">98.7%</strong></span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-slate-900 h-full rounded-full" style={{ width: '94%' }}></div>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Storage S3 Jakarta
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
              <span className="material-symbols-outlined text-[16px]">cloud_queue</span>
            </div>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">14.2</span>
              <span className="text-xs text-slate-500 font-sans">/ 25 GB</span>
            </div>
            <span className="text-xs text-slate-400">AWS Jakarta Region</span>
          </div>
          <div className="mt-3 pt-2.5">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '56.8%' }}></div>
            </div>
            <div className="flex justify-between items-center mt-1 text-[11px] text-slate-500">
              <span>56.8% Terpakai</span>
              <span className="text-emerald-600 font-medium">Kapasitas Aman</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Monitoring & Popular Templates Mosaic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Event & Kiosk Fleet (2 Cols Span) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                Live Event &amp; Kiosk Telemetry
              </h2>
            </div>
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80">
              <button
                onClick={() => setEventTab('all')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  eventTab === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua (3)
              </button>
              <button
                onClick={() => setEventTab('onsite')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  eventTab === 'onsite'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                On-Site (2)
              </button>
              <button
                onClick={() => setEventTab('hybrid')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  eventTab === 'hybrid'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hybrid (1)
              </button>
            </div>
          </div>

          {/* Live Cards Container */}
          <div className="space-y-3">
            {/* Live Card 1: Pullman Wedding */}
            {(eventTab === 'all' || eventTab === 'onsite') && (
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 gap-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono text-[11px] font-semibold border border-slate-200">
                      EV-2026-091
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Sedang Berlangsung
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 text-[11px] font-medium border border-slate-200">
                      Mode: On-Site
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono">Sync: 12 dtk lalu</span>
                    <button className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">more_vert</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-2 space-y-1">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Wedding of Kevin &amp; Astrid
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
                      Ballroom 2, Pullman Jakarta Central Park
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-slate-600">
                      <span>Operator: <strong className="text-slate-800 font-medium">Rian &amp; Siti</strong></span>
                      <span className="text-slate-300">•</span>
                      <span>Hardware: <strong className="text-slate-800 font-medium">2 Kiosk (TS-A &amp; TS-B)</strong></span>
                      <span className="text-slate-300">•</span>
                      <span>Template: <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">4R Floral Gold</span></span>
                    </div>
                  </div>

                  {/* Progress Telemetry */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] text-slate-500 font-medium">Progress Sesi</span>
                      <span className="font-mono text-xs text-slate-900 font-semibold">184 / 200</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1.5">
                      <div className="bg-slate-900 h-full rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>92% Quota Event</span>
                      <span className="text-emerald-600 font-medium">16 Sisa</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2.5 gap-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-emerald-600">print</span>
                      DNP DS620: Ready
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-indigo-600">photo_camera</span>
                      Canon R100: Connected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors">
                      Kirim Notifikasi
                    </button>
                    <Link
                      to="/booth/onsite"
                      className="px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors flex items-center gap-1"
                    >
                      <span>Live Feed Kiosk</span>
                      <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Live Card 2: Tech Summit Afterparty */}
            {(eventTab === 'all' || eventTab === 'hybrid') && (
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 gap-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono text-[11px] font-semibold border border-slate-200">
                      EV-2026-092
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live Hybrid
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-medium">
                      Hybrid QR + Kiosk
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono">Sync: 45 dtk lalu</span>
                    <button className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">more_vert</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-2 space-y-1">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Tech Summit Afterparty 2026
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
                      ICE BSD Hall 3 &amp; Web Link Live
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-slate-600">
                      <span>Operator: <strong className="text-slate-800 font-medium">Dimas Tri</strong></span>
                      <span className="text-slate-300">•</span>
                      <span>Hardware: <strong className="text-slate-800 font-medium">1 Kiosk Booth + Web App</strong></span>
                      <span className="text-slate-300">•</span>
                      <span>Template: <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">Cyber Glitch 2R</span></span>
                    </div>
                  </div>

                  {/* Progress Telemetry */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] text-slate-500 font-medium">Total Sesi Terekam</span>
                      <span className="font-mono text-xs text-slate-900 font-semibold">312 Sesi</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1.5">
                      <div className="bg-slate-900 h-full rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Unlimited Package</span>
                      <span className="text-slate-800 font-medium">QR Dominan (64%)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2.5 gap-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">qr_code_2</span>
                      Web Portal: lumina.snap/ts26
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-amber-500">flash_on</span>
                      Auto-AI Removal: Aktif
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors">
                      Salin QR
                    </button>
                    <Link
                      to="/events"
                      className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors shadow-xs"
                    >
                      Kelola Event
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Popular Templates & Visual Previews */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
              Template Terpopuler
            </h2>
            <Link to="/templates" className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-0.5">
              <span>Semua Galeri</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            {/* Item 1: Classic 4R Strip */}
            <div className="p-2.5 rounded-lg bg-slate-50/70 hover:bg-slate-50 transition-colors border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-14 h-18 rounded-md overflow-hidden flex-shrink-0 bg-slate-200 border border-slate-200 relative group">
                  <img
                    className="w-full h-full object-cover"
                    alt="Classic 4R Strip Vertical"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs2uSCA_1x4egT-SWZhe80JHNnZtQf_RWXoZP9HFCIZSnvDBE0wCW_2GExbQU9cvJ3o5K7MAHq0osFLPXxDfMlacpRHG_6T3YmiIDGOcVbJkPACrm8FDvEmTZQiJgwzFe-UElfHdSmaY8qdpQiKhN_4MkU8UkbIiB0gOLDnNz6SRO68OqdgpG7mBMBpAlM7xjQRAaNKCD-gTzAGuXzATSBV0YArRZbDBZF8zkQEWN0OV8HrdOtMZk"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="material-symbols-outlined text-white text-[15px]">visibility</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.5 rounded bg-white text-slate-800 font-mono text-[10px] font-semibold border border-slate-200">
                      4R Strip
                    </span>
                    <span className="font-mono text-xs text-slate-900 font-semibold">640 Sesi</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 truncate mt-1">
                    Classic 4R Strip Vertical
                  </h4>
                  <p className="text-[11px] text-slate-500">3 Slots • Portrait • Auto Cut</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                      Wedding
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                      Formal
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Item 2: 2R Dual Bookmark */}
            <div className="p-2.5 rounded-lg bg-slate-50/70 hover:bg-slate-50 transition-colors border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-14 h-18 rounded-md overflow-hidden flex-shrink-0 bg-slate-200 border border-slate-200 relative group">
                  <img
                    className="w-full h-full object-cover"
                    alt="2R Dual Photo Bookmark"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn6RypqRpe0zNin65jrmHHkTekkXH95Lm84ZrjQMK6gMlaTpCzgFzqBF3gFm9ydHNCPZ5x_mYQvVaz9lS-LOQEPF5ZN4iNIYPVQOCSOHoxbLgtKNh_opFW2xnKtVjw2LTbYs1GI9IkArkTMWbSons0k4o6kAnEbHYWiNEwSsBj9f1BGzT0Mm5Bh-lEwfMOuERXqqtIH_3DZmrUNIVBaiv7KbImFkkm7kXiGQPgsOf2PHqbBo01Hpk"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="material-symbols-outlined text-white text-[15px]">visibility</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.5 rounded bg-white text-slate-800 font-mono text-[10px] font-semibold border border-slate-200">
                      2R Bookmark
                    </span>
                    <span className="font-mono text-xs text-slate-900 font-semibold">480 Sesi</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 truncate mt-1">
                    2R Dual Photo Bookmark
                  </h4>
                  <p className="text-[11px] text-slate-500">2 Slots • Bookmark Format</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                      Birthday
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                      Graduation
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Auto-Layout Banner */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-700 text-[17px]">auto_awesome</span>
                <span className="text-xs text-slate-800 font-medium">Layout Generator Siap</span>
              </div>
              <Link to="/templates" className="text-xs text-indigo-600 font-semibold hover:underline">
                Coba Buat
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Photo Sessions Log Table */}
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
              Log Sesi &amp; Real-Time Stream
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold border border-slate-200">
              Live Socket On
            </span>
          </div>

          {/* Table Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-xs">
              <span className="material-symbols-outlined text-slate-400 text-[16px] mr-2">search</span>
              <input
                value={searchSession}
                onChange={(e) => setSearchSession(e.target.value)}
                className="bg-transparent text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none w-44"
                placeholder="Cari Sesi, Event..."
                type="text"
              />
            </div>
            <select className="px-2.5 py-1.5 rounded-lg bg-white text-slate-700 text-xs border border-slate-200 shadow-xs focus:outline-none">
              <option>Semua Event</option>
              <option>Wedding Kevin &amp; Astrid</option>
              <option>Tech Summit 2026</option>
            </select>
            <button className="px-2.5 py-1.5 rounded-lg bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium border border-slate-200 shadow-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">tune</span>
              <span>Filter</span>
            </button>
            <button className="px-2.5 py-1.5 rounded-lg bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium border border-slate-200 shadow-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">file_download</span>
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* The Data Table */}
        <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-2.5 px-4">ID Sesi</th>
                  <th className="py-2.5 px-4">Waktu</th>
                  <th className="py-2.5 px-4">Event Studio</th>
                  <th className="py-2.5 px-4">Mode Terminal</th>
                  <th className="py-2.5 px-4">Template</th>
                  <th className="py-2.5 px-4">Captures</th>
                  <th className="py-2.5 px-4">Output &amp; Delivery</th>
                  <th className="py-2.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredSessions.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      {row.id}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {row.time}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900 block">{row.event}</span>
                      <span className="text-[11px] text-slate-500">{row.location}</span>
                    </td>
                    <td className="py-3 px-4">
                      {row.modeType === 'onsite' ? (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-medium inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {row.mode}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-medium inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                          {row.mode}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900">{row.template}</span>
                      <span className="text-[11px] text-slate-500 block">{row.templateDetail}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">{row.captures}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-slate-500">
                            {row.printed.includes('Cloud') ? 'cloud_done' : 'print'}
                          </span>
                          {row.printed}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-slate-500">
                            {row.delivery.includes('Saved') ? 'download' : 'qr_code'}
                          </span>
                          {row.delivery}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to="/gallery"
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Lihat Hasil Foto"
                        >
                          <span className="material-symbols-outlined text-[17px]">photo_library</span>
                        </Link>
                        <Link
                          to="/results/RESULT-LUMINA-DEMO-001"
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Salin QR Link"
                        >
                          <span className="material-symbols-outlined text-[17px]">link</span>
                        </Link>
                        <button
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Cetak Ulang"
                        >
                          <span className="material-symbols-outlined text-[17px]">print</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Bar */}
          <div className="px-4 py-3 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <span>Menampilkan 1-4 dari 1,428 Sesi</span>
              <span className="text-slate-300">•</span>
              <span className="font-mono">WebSocket: 24ms</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 rounded bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs disabled:opacity-50" disabled>
                Sebelumnya
              </button>
              <span className="px-2 py-1 font-mono text-slate-900 font-semibold">1</span>
              <button className="px-2 py-1 hover:bg-slate-200/60 rounded">2</button>
              <button className="px-2 py-1 hover:bg-slate-200/60 rounded">3</button>
              <span className="px-1 text-slate-400">...</span>
              <button className="px-2 py-1 hover:bg-slate-200/60 rounded">72</button>
              <button className="px-2.5 py-1 rounded bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Tenant Bottom Quick Status & Hardware Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hardware Status 1 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5 hover:border-slate-300 transition-all">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">print_connect</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-900 truncate">
                DNP DS620 Fleet Status
              </h4>
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">3 Printer Siap • 0 Antrean Error</p>
            <div className="mt-1">
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                Thermal Head: Optimal (32°C)
              </span>
            </div>
          </div>
        </div>

        {/* Hardware Status 2 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5 hover:border-slate-300 transition-all">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">camera</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-900 truncate">
                Canon EDSDK Connection
              </h4>
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">2 EOS R100 • 1 EOS 200D II</p>
            <div className="mt-1">
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                LiveView: 60 FPS Stable
              </span>
            </div>
          </div>
        </div>

        {/* Hardware Status 3 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5 hover:border-slate-300 transition-all">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-900 truncate">
                Paket Pro Studio Tenant
              </h4>
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Aktif s/d 14 November 2026</p>
            <div className="mt-1">
              <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-medium">
                Batas Event: Unlimited Booth
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
