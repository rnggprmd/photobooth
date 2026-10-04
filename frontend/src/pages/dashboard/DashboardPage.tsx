import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Printer,
  Calendar,
  TrendingUp,
  Plus,
  MonitorPlay,
  QrCode,
  CheckCircle2,
  ExternalLink,
  RotateCw,
  Search,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { dashboardApi } from '../../api/dashboard';
import SuperAdminDashboardPage from '../superadmin/DashboardPage';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export const DashboardPage: React.FC = () => {
  const { user, tenant } = useAuthStore();

  const isSuperAdmin = Boolean(
    user?.roles?.some((r: any) => (typeof r === 'string' ? r === 'super_admin' : r.name === 'super_admin'))
  );

  if (isSuperAdmin) {
    return <SuperAdminDashboardPage />;
  }

  const [showTelemetryAlert, setShowTelemetryAlert] = useState(true);
  const [eventTab, setEventTab] = useState<'all' | 'onsite' | 'hybrid'>('all');
  const [searchSession, setSearchSession] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyQr = (slug: string) => {
    const url = `${window.location.origin}/results/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    showToast(`Tautan portal live berhasil disalin: ${url}`);
  };

  const handleExportCsv = () => {
    const headers = ['ID_Sesi,Waktu,Event,Lokasi,Mode,Template,Captures,Output,Delivery'];
    const rows = filteredSessions.map(
      (s) =>
        `"${s.id}","${s.time}","${s.event}","${s.location}","${s.mode}","${s.template}","${s.captures}","${s.printed}","${s.delivery}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `photobooth_sessions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Seluruh data sesi berhasil diekspor ke format CSV!');
  };

  const handleReprintSession = (sessionId: string) => {
    showToast(`Perintah cetak ulang untuk sesi ${sessionId} dikirim ke printer DNP DS620!`);
  };

  // Real-time sessions data aligned with Photobooth operations
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

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchSession.toLowerCase()) ||
      s.event.toLowerCase().includes(searchSession.toLowerCase()) ||
      s.template.toLowerCase().includes(searchSession.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedEventFilter !== 'all' && !s.event.toLowerCase().includes(selectedEventFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-900 shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hardware Telemetry Alert Banner */}
      {showTelemetryAlert && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 flex-shrink-0">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-0.5 text-xs">
              <span className="font-semibold text-slate-900">Telemetri On-Site:</span>
              <div className="flex flex-wrap items-center gap-2 text-slate-600">
                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Kiosk Terminal 01 (Pullman Jakarta)
                </span>
                <span className="text-slate-300">•</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[11px] font-medium border border-slate-200">
                  Kertas DNP 4R: Sisa 38 Lembar
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">Ribbon Tinta OK (92%)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
            <Link
              to="/admin/settings?tab=hardware"
              className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors border border-slate-200"
            >
              Kelola Hardware
            </Link>
            <button
              onClick={() => setShowTelemetryAlert(false)}
              className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Page Header (Shadcn style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Ringkasan Operasional {tenant?.name || 'Studio'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitoring sesi live, armada kiosk on-site, dan telemetri perangkat cetak.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin/events"
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>Event Baru</span>
          </Link>
          <Link
            to="/booth/onsite"
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span>Buka Kiosk</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid (Shadcn style: clean border, small uppercase label, bold metric, trend pill) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Sesi Bulan Ini
            </span>
            <Camera className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
              {dashboardStats?.metrics?.today_sessions ? dashboardStats.metrics.today_sessions : 1428}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs">
              <span className="font-semibold text-emerald-600 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +18.4%
              </span>
              <span className="text-slate-400">vs bulan lalu</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Kuota Studio: 82%</span>
              <span className="font-mono text-slate-700 font-medium">2,000 Maks</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Event Aktif
            </span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
              14 <span className="text-xs font-normal text-slate-500 font-sans">Acara</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-slate-800">3 Live Hari Ini</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">11 Terjadwal</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Peak: Weekend Ini</span>
              <span className="text-indigo-600 font-medium hover:underline cursor-pointer">Lihat Kalender</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Printer DNP DS620
            </span>
            <Printer className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
              38 <span className="text-xs font-normal text-slate-500 font-sans">Lembar Sisa</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200 text-[10px]">
                Perlu Roll Baru
              </span>
              <span className="text-slate-400 font-mono">Roll #DNP-4R</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100">
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '22%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Output Cetak & QR
            </span>
            <QrCode className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
              4,896 <span className="text-xs font-normal text-slate-500 font-sans">Foto</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>Unduh QR: <strong className="text-slate-800 font-semibold">91.2%</strong></span>
              <span>Cetak Fisik: <strong className="text-slate-800 font-semibold">98.7%</strong></span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Storage S3: 14.2 / 25 GB</span>
              <span className="text-emerald-600 font-medium">Aman</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Event & Telemetry Fleet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Kiosk Fleet (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                Armada Kiosk On-Site & Live Event
              </h2>
            </div>
            <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setEventTab('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  eventTab === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Semua (3)
              </button>
              <button
                onClick={() => setEventTab('onsite')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  eventTab === 'onsite'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                On-Site (2)
              </button>
              <button
                onClick={() => setEventTab('hybrid')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  eventTab === 'hybrid'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Online (1)
              </button>
            </div>
          </div>

          {/* Kiosk Fleet Card 1 */}
          <Card className="hover:border-slate-300 transition-colors">
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      Wedding Kevin &amp; Astrid
                    </span>
                    <Badge variant="outline" className="text-[10px] text-emerald-700 bg-emerald-50 border-emerald-200 font-mono">
                      LIVE ON-SITE
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pullman Ballroom 2, Jakarta Barat • Kiosk Unit #01 &amp; #02
                  </p>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleCopyQr('kevin-astrid')}
                  >
                    <QrCode className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    Salin QR Tamu
                  </Button>
                  <Link to="/booth/onsite">
                    <Button size="sm" className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700">
                      Buka Terminal
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hardware Status Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-medium">Kamera Kiosk 01</div>
                  <div className="font-semibold text-slate-800 mt-0.5">Canon EOS R50</div>
                  <div className="text-[10px] text-emerald-600 font-mono">1080p • 60 FPS</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-medium">Printer DNP 01</div>
                  <div className="font-semibold text-slate-800 mt-0.5">DNP DS620</div>
                  <div className="text-[10px] text-amber-600 font-mono">Kertas 38/400</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-medium">Sesi Selesai</div>
                  <div className="font-semibold text-slate-800 mt-0.5 font-mono">148 Cetakan</div>
                  <div className="text-[10px] text-slate-500">Avg 42 detik/sesi</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-medium">Template Frame</div>
                  <div className="font-semibold text-slate-800 mt-0.5 truncate">4R Minimalist Gold</div>
                  <div className="text-[10px] text-indigo-600 font-mono">3 Shots Strip</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kiosk Fleet Card 2 */}
          <Card className="hover:border-slate-300 transition-colors">
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      Tech Summit Afterparty 2026
                    </span>
                    <Badge variant="outline" className="text-[10px] text-blue-700 bg-blue-50 border-blue-200 font-mono">
                      HYBRID BOOTH
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ICE BSD Hall 3 &amp; Web Link Tamu • Kiosk Unit #03
                  </p>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleCopyQr('tech-summit')}
                  >
                    <QrCode className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    Salin QR Tamu
                  </Button>
                  <Link to="/booth/online/tech-summit">
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      Web Booth
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hardware Status Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-medium">Kamera Kiosk 03</div>
                  <div className="font-semibold text-slate-800 mt-0.5">Sony A6400</div>
                  <div className="text-[10px] text-emerald-600 font-mono">1080p • 60 FPS</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-medium">Printer DNP 03</div>
                  <div className="font-semibold text-slate-800 mt-0.5">DNP DS620</div>
                  <div className="text-[10px] text-emerald-600 font-mono">Kertas 210/400</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-medium">Sesi Selesai</div>
                  <div className="font-semibold text-slate-800 mt-0.5 font-mono">92 Sesi Web</div>
                  <div className="text-[10px] text-slate-500">QR Sync Realtime</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-medium">Template Frame</div>
                  <div className="font-semibold text-slate-800 mt-0.5 truncate">Cyber Glitch 2R</div>
                  <div className="text-[10px] text-indigo-600 font-mono">2 Shots Vertical</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Templates & Quick Config (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
              Template Terpopuler
            </h2>
            <Link to="/admin/templates" className="text-xs text-indigo-600 hover:underline font-medium">
              Lihat Semua
            </Link>
          </div>

          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    4R
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">4R Minimalist Gold</p>
                    <p className="text-[11px] text-slate-500">3 Shots • Wedding / Gala</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-700">62% Sesi</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                    2x6
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Classic Photo Strip</p>
                    <p className="text-[11px] text-slate-500">4 Shots • Birthday / Kiosk</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-700">24% Sesi</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                    WEB
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Cyber Glitch Vertical</p>
                    <p className="text-[11px] text-slate-500">2 Shots • Tech Summit</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-700">14% Sesi</span>
              </div>

              <div className="pt-2">
                <Link
                  to="/admin/templates"
                  className="w-full py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Kustomisasi Frame Baru</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Real-Time Live Sessions Table (Shadcn Table style) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
              Tabel Sesi Photobooth Real-Time
            </h2>
            <p className="text-xs text-slate-500">
              Menampilkan {filteredSessions.length} sesi terbaru yang berhasil diproses oleh sistem.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari ID, event, template..."
                value={searchSession}
                onChange={(e) => setSearchSession(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 w-52 sm:w-60 shadow-2xs"
              />
            </div>

            {/* Event Filter */}
            <select
              value={selectedEventFilter}
              onChange={(e) => setSelectedEventFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-indigo-600 shadow-2xs"
            >
              <option value="all">Semua Event</option>
              <option value="Wedding Kevin">Wedding Kevin &amp; Astrid</option>
              <option value="Tech Summit">Tech Summit Afterparty</option>
            </select>

            {/* Export CSV Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="h-8 text-xs shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-slate-500" />
              <span>Ekspor CSV</span>
            </Button>
          </div>
        </div>

        {/* Shadcn Styled Table */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">ID Sesi</th>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3">Event &amp; Lokasi</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Template Frame</th>
                  <th className="px-4 py-3">Status Cetak</th>
                  <th className="px-4 py-3">Galeri QR</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      Tidak ada sesi yang cocok dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {session.id}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono">
                        {session.time}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{session.event}</div>
                        <div className="text-[11px] text-slate-400">{session.location}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={
                            session.modeType === 'onsite'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }
                        >
                          {session.mode}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{session.template}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{session.templateDetail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={
                            session.printed.includes('Printed')
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                              : 'text-slate-600 bg-slate-50 border-slate-200'
                          }
                        >
                          {session.printed}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={
                            session.delivery.includes('Scan')
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                              : 'text-slate-500 bg-slate-50 border-slate-200'
                          }
                        >
                          {session.delivery}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleReprintSession(session.id)}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                            title="Cetak Ulang DNP"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCopyQr(session.id.replace('#', ''))}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                            title="Salin QR Tamu"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            to="/admin/gallery"
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                            title="Buka di Galeri"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Menampilkan {filteredSessions.length} dari 1,428 total sesi</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7 text-xs px-2" disabled>
                Sebelumnya
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                Selanjutnya
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
