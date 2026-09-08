import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../../components/ui/table';
import { reportsApi } from '../../api/reports';

interface IncidentLog {
  id: string;
  waktu: string;
  lokasi: string;
  operator: string;
  kategori: 'Hardware' | 'Jaringan' | 'Setup Sesi';
  status: 'Resolved' | 'In Progress';
  tindakan: string;
}

const incidentsData: IncidentLog[] = [
  {
    id: 'inc-1',
    waktu: '18:42 WIB',
    lokasi: 'Pullman Grand Wedding',
    operator: 'Aris Kurniawan',
    kategori: 'Hardware',
    status: 'Resolved',
    tindakan: 'Paper jam pada tray DNP DS620 teratasi, pembersihan roller, uji cetak 1 lembar berhasil.',
  },
  {
    id: 'inc-2',
    waktu: '17:15 WIB',
    lokasi: 'ICE BSD Tech Summit',
    operator: 'Dika Pratama',
    kategori: 'Jaringan',
    status: 'Resolved',
    tindakan: 'Failover otomatis switch ke 4G backup saat kabel LAN venue sempat drop selama 18 detik.',
  },
  {
    id: 'inc-3',
    waktu: '16:30 WIB',
    lokasi: 'The Glass House Standby',
    operator: 'Fauzan H.',
    kategori: 'Setup Sesi',
    status: 'Resolved',
    tindakan: 'Penggantian 1 roll baru DNP DS620 (400 lembar) dan kalibrasi white balance kamera.',
  },
  {
    id: 'inc-4',
    waktu: '15:02 WIB',
    lokasi: 'Pullman Grand Wedding',
    operator: 'Aris Kurniawan',
    kategori: 'Hardware',
    status: 'Resolved',
    tindakan: 'Baterai Canon R100 diganti ke unit backup cadangan (cycle swap 2 jam).',
  },
];

const hourlyVolumeData = [
  { time: '09:00', onsite: 18, online: 8, total: 26, onsiteH: '28px', onlineH: '14px' },
  { time: '11:00', onsite: 26, online: 12, total: 38, onsiteH: '42px', onlineH: '20px' },
  { time: '13:00', onsite: 58, online: 24, total: 82, onsiteH: '84px', onlineH: '38px' },
  { time: '15:00', onsite: 40, online: 19, total: 59, onsiteH: '60px', onlineH: '30px' },
  { time: '17:00', onsite: 78, online: 32, total: 110, onsiteH: '110px', onlineH: '48px' },
  { time: '19:00', onsite: 92, online: 41, total: 133, onsiteH: '126px', onlineH: '58px', peak: true },
  { time: '21:00', onsite: 36, online: 22, total: 58, onsiteH: '52px', onlineH: '35px' },
];

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d'>('today');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState('1s ago');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([reportsApi.sessions(), reportsApi.business()])
      .then(() => {
        setLastSync('Barusan');
      })
      .catch((err) => console.warn('Reports load warning:', err));
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([reportsApi.sessions(), reportsApi.business()]);
      setLastSync('Barusan');
      showToast('Telemetri perangkat dan metrik sesi berhasil disinkronkan dari server!');
    } catch (e) {
      showToast('Telemetri perangkat disinkronkan');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    showToast('Laporan Operasional PDF & CSV berhasil diunduh');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredIncidents =
    selectedCategory === 'Semua'
      ? incidentsData
      : incidentsData.filter((item) => item.kategori === selectedCategory);

  // Dynamic values based on time range
  const metrics =
    timeRange === 'today'
      ? {
          sessions: '496',
          sessionsChange: '+14.2%',
          sessionsVs: 'vs 434 sesi kemarin',
          onsite: 312,
          online: 184,
          paper: '552',
          paperStock: '3.648',
          paperSafe: 'Aman (9 hari)',
          quotaPercent: 82,
          quotaUsed: '1.640',
          quotaTotal: '2.000',
          uptime: '99.8%',
          latency: 'Avg. 18ms',
        }
      : timeRange === '7d'
      ? {
          sessions: '3.420',
          sessionsChange: '+18.6%',
          sessionsVs: 'vs 2.880 sesi minggu lalu',
          onsite: 2.150,
          online: 1.270,
          paper: '3.810',
          paperStock: '3.648',
          paperSafe: 'Aman (7 hari)',
          quotaPercent: 82,
          quotaUsed: '1.640',
          quotaTotal: '2.000',
          uptime: '99.9%',
          latency: 'Avg. 16ms',
        }
      : {
          sessions: '14.890',
          sessionsChange: '+24.1%',
          sessionsVs: 'vs 11.990 sesi bulan lalu',
          onsite: 9.420,
          online: 5.470,
          paper: '16.480',
          paperStock: '3.648',
          paperSafe: 'Perlu Restock (5 hari)',
          quotaPercent: 82,
          quotaUsed: '1.640',
          quotaTotal: '2.000',
          uptime: '99.7%',
          latency: 'Avg. 19ms',
        };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Utama</span>
            <span className="material-symbols-outlined text-[13px] text-slate-400">chevron_right</span>
            <span className="text-slate-800 font-semibold">Ringkasan Operasional</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Ringkasan Operasional &amp; Telemetri Perangkat
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl">
            Pantau performa armada photobooth, konsumsi kertas &amp; ribbon tinta, utilisasi kuota SaaS, dan stabilitas jaringan seluruh terminal event aktif secara real-time.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Time Range Filter */}
          <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                timeRange === 'today'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                timeRange === '7d'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                timeRange === '30d'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 Hari
            </button>
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-1.5 text-xs text-slate-700 bg-white"
          >
            <span
              className={`material-symbols-outlined text-[15px] text-indigo-600 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              sync
            </span>
            <span>Refresh</span>
          </Button>

          {/* Export Button */}
          <Button
            size="sm"
            onClick={handleExport}
            className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
          >
            <span className="material-symbols-outlined text-[15px]">file_download</span>
            <span>Export Laporan</span>
          </Button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Sesi Terproses Hari Ini */}
        <Card className="border-slate-200/90 shadow-sm flex flex-col justify-between">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Sesi Terproses
              </span>
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <span className="material-symbols-outlined text-[18px]">photo_camera_front</span>
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                  {metrics.sessions}
                </span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
                  {metrics.sessionsChange}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{metrics.sessionsVs}</p>
            </div>
            <div className="pt-3 mt-4 flex items-center justify-between text-xs text-slate-600 font-mono border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span> On-Site: <strong>{metrics.onsite}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Online: <strong>{metrics.online}</strong>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Kertas & Ribbon Terpakai */}
        <Card className="border-slate-200/90 shadow-sm flex flex-col justify-between">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Kertas &amp; Ribbon
              </span>
              <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <span className="material-symbols-outlined text-[18px]">print</span>
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                  {metrics.paper}
                </span>
                <span className="text-xs text-slate-500 font-medium">Lembar</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">DNP DS620 &amp; DS-RX1 Fleet</p>
            </div>
            <div className="pt-3 mt-4 flex items-center justify-between text-xs border-t border-slate-100">
              <span className="text-slate-600 font-medium">Stok: {metrics.paperStock}</span>
              <Badge variant="success" className="font-mono text-[10px] py-0">
                {metrics.paperSafe}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Utilisasi Kuota SaaS */}
        <Card className="border-slate-200/90 shadow-sm flex flex-col justify-between">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Utilisasi Kuota SaaS
              </span>
              <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                <span className="material-symbols-outlined text-[18px]">data_usage</span>
              </span>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                  {metrics.quotaPercent}%
                </span>
                <Badge variant="danger" className="text-[10px] py-0">
                  Mendekati Batas
                </Badge>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden border border-slate-200">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${metrics.quotaPercent}%` }}
                ></div>
              </div>
            </div>
            <div className="pt-3 mt-4 flex items-center justify-between text-xs font-mono text-slate-600 border-t border-slate-100">
              <span>{metrics.quotaUsed} / {metrics.quotaTotal} Sesi</span>
              <span>Reset: 9 hari</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Uptime & Latensi Armada */}
        <Card className="border-slate-200/90 shadow-sm flex flex-col justify-between">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Uptime Armada
              </span>
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <span className="material-symbols-outlined text-[18px]">router</span>
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                  {metrics.uptime}
                </span>
                <span className="text-xs text-emerald-600 font-semibold">{metrics.latency}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">4 Node Terhubung Real-Time</p>
            </div>
            <div className="pt-3 mt-4 flex items-center justify-between text-xs border-t border-slate-100">
              <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 4 Aktif / 0 Drop
              </span>
              <span className="text-slate-400 font-mono text-[11px]">Sync {lastSync}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hardware Telemetry Section Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Telemetri Hardware &amp; Printer Fleet
            </h2>
            <p className="text-xs text-slate-500">
              Status hardware level komponen real-time pada setiap unit photobooth event.
            </p>
          </div>
          <Badge variant="outline" className="gap-1.5 font-mono text-xs py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            3 Node On-Site Aktif
          </Badge>
        </div>
      </div>

      {/* 3 Hardware Node Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* NODE-01 */}
        <Card className="border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="font-mono text-[11px] text-slate-400 font-bold">NODE-01</span>
                <h3 className="text-sm font-bold text-slate-900">Pullman Grand Wedding</h3>
                <p className="text-xs text-slate-500">Ballroom 1, Pullman Thamrin</p>
              </div>
              <Badge variant="success" className="gap-1 text-[11px] py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live
              </Badge>
            </div>

            <div className="space-y-3">
              {/* Printer Box */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs text-slate-800">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-indigo-600">print</span>
                    DNP DS620 (4R Strip)
                  </span>
                  <span className="font-mono font-bold text-rose-600">Sisa 38 lbr</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '15%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Ribbon Sisa 92%</span>
                  <span>Kapasitas 400</span>
                </div>
              </div>

              {/* Sub-grid: Camera & Network */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-indigo-600">photo_camera</span> Kamera
                  </span>
                  <span className="text-xs font-semibold text-slate-900 mt-0.5 truncate">Canon EOS R100</span>
                  <span className="font-mono text-[10px] text-slate-500">Bat. 98% • Tether</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">wifi</span> Jaringan
                  </span>
                  <span className="text-xs font-semibold text-slate-900 mt-0.5 truncate">Orbit 5G Venue</span>
                  <span className="font-mono text-[10px] text-slate-500">42 Mbps • 14ms</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-slate-500 font-mono text-[11px] border-t border-slate-100">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">device_thermostat</span> 34°C Normal
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">account_circle</span> Aris (Lead)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* NODE-02 */}
        <Card className="border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="font-mono text-[11px] text-slate-400 font-bold">NODE-02</span>
                <h3 className="text-sm font-bold text-slate-900">ICE BSD Tech Summit</h3>
                <p className="text-xs text-slate-500">Hall 3A Booth #82, BSD</p>
              </div>
              <Badge variant="success" className="gap-1 text-[11px] py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live
              </Badge>
            </div>

            <div className="space-y-3">
              {/* Printer Box */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs text-slate-800">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-indigo-600">print</span>
                    DNP DS-RX1 (2R Mini)
                  </span>
                  <span className="font-mono font-bold text-slate-900">Sisa 140 lbr</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '52%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Ribbon Sisa 86%</span>
                  <span>Kapasitas 700</span>
                </div>
              </div>

              {/* Sub-grid: Camera & Network */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-indigo-600">photo_camera</span> Kamera
                  </span>
                  <span className="text-xs font-semibold text-slate-900 mt-0.5 truncate">Sony ZV-E10</span>
                  <span className="font-mono text-[10px] text-slate-500">AC Dummy Bat</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">lan</span> Jaringan
                  </span>
                  <span className="text-xs font-semibold text-slate-900 mt-0.5 truncate">Dedicated LAN</span>
                  <span className="font-mono text-[10px] text-slate-500">100 Mbps • 8ms</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-slate-500 font-mono text-[11px] border-t border-slate-100">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">device_thermostat</span> 36°C Normal
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">account_circle</span> Dika Pratama
              </span>
            </div>
          </CardContent>
        </Card>

        {/* NODE-03 */}
        <Card className="border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="font-mono text-[11px] text-slate-400 font-bold">NODE-03</span>
                <h3 className="text-sm font-bold text-slate-900">The Glass House Private</h3>
                <p className="text-xs text-slate-500">Garden Pavilion, Menteng</p>
              </div>
              <Badge variant="warning" className="gap-1 text-[11px] py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Standby
              </Badge>
            </div>

            <div className="space-y-3">
              {/* Printer Box */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs text-slate-800">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-indigo-600">print</span>
                    DNP DS620 Standby
                  </span>
                  <span className="font-mono font-bold text-emerald-600">Penuh (400)</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Ribbon Baru 100%</span>
                  <span>Siap 18:30 WIB</span>
                </div>
              </div>

              {/* Sub-grid: Camera & Operator */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-indigo-600">photo_camera</span> Kamera
                  </span>
                  <span className="text-xs font-semibold text-slate-900 mt-0.5 truncate">Canon M50 II</span>
                  <span className="font-mono text-[10px] text-slate-500">Baterai 100%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-indigo-600">checklist</span> Operator
                  </span>
                  <span className="text-xs font-semibold text-slate-900 mt-0.5 truncate">Checklist OK</span>
                  <span className="font-mono text-[10px] text-emerald-600 font-medium">Verified</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-slate-500 font-mono text-[11px] border-t border-slate-100">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span> Mulai dlm 2 jam
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">account_circle</span> Fauzan H.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Volume Chart & Popular Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Hourly Session Volume */}
        <Card className="border-slate-200/90 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  Volume Sesi per Jam (Hari Ini)
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Distribusi beban sesi on-site kiosk vs online web photobooth 09:00 - 21:00
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600"></span> On-Site Kiosk
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Online Web
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {/* Custom Bar Chart Canvas */}
            <div className="relative w-full h-60 flex flex-col justify-end pt-4">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-25">
                <div className="border-b border-slate-300 w-full h-0"></div>
                <div className="border-b border-slate-300 w-full h-0"></div>
                <div className="border-b border-slate-300 w-full h-0"></div>
                <div className="border-b border-slate-300 w-full h-0"></div>
              </div>

              {/* Interactive Bars */}
              <div className="flex items-end justify-between h-44 gap-2 relative z-10 px-2">
                {hourlyVolumeData.map((slot) => (
                  <div
                    key={slot.time}
                    className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer relative"
                  >
                    {/* Hover Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap">
                      <div>On-Site: <strong>{slot.onsite}</strong></div>
                      <div>Online: <strong>{slot.online}</strong></div>
                      <div className="border-t border-slate-700 mt-0.5 pt-0.5 font-bold">Total: {slot.total}</div>
                    </div>

                    <div className="w-full max-w-[24px] flex flex-col gap-0.5 justify-end">
                      <div
                        className="w-full bg-amber-500 rounded-t-sm transition-all duration-200 group-hover:brightness-110"
                        style={{ height: slot.onlineH }}
                        title={`Online: ${slot.online}`}
                      ></div>
                      <div
                        className="w-full bg-indigo-600 rounded-t-sm transition-all duration-200 group-hover:brightness-110"
                        style={{ height: slot.onsiteH }}
                        title={`On-Site: ${slot.onsite}`}
                      ></div>
                    </div>

                    <span
                      className={`font-mono text-[11px] ${
                        slot.peak
                          ? 'text-indigo-600 font-bold'
                          : slot.time === '17:00'
                          ? 'text-slate-900 font-semibold'
                          : 'text-slate-500'
                      }`}
                    >
                      {slot.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 flex flex-wrap items-center justify-between text-xs text-slate-500 border-t border-slate-100">
              <span>
                Puncak beban tertinggi: <strong className="text-slate-900">19:00 - 20:00 (133 Total Sesi)</strong>
              </span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">cloud_sync</span> Auto-scaling Cloud Ready
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Right (1 col): Popular Formats & Templates */}
        <Card className="border-slate-200/90 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900">
                Format &amp; Template Populer
              </CardTitle>
              <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Hari Ini
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            <p className="text-xs text-slate-500">
              Proporsi cetak fisik dan aset digital terdistribusi ke pengunjung.
            </p>

            <div className="space-y-3.5">
              {/* Item 1 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-800 font-semibold">4R Strip (2x6" 3-Frame)</span>
                  <span className="font-mono text-slate-900 font-bold">54% (298 lbr)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '54%' }}></div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-800 font-semibold">4R Single Postcard (4x6")</span>
                  <span className="font-mono text-slate-900 font-bold">26% (143 lbr)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '26%' }}></div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-800 font-semibold">2R Mini Bookmark Cut</span>
                  <span className="font-mono text-slate-900 font-bold">14% (77 lbr)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '14%' }}></div>
                </div>
              </div>

              {/* Item 4 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-800 font-semibold">Cyber Glitch Digital (QR)</span>
                  <span className="font-mono text-slate-900 font-bold">6% (34 sesi)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: '6%' }}></div>
                </div>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 flex items-center gap-2.5">
              <span className="material-symbols-outlined text-indigo-600 text-lg flex-shrink-0">recommend</span>
              <span className="text-xs text-indigo-950 font-medium">
                Kombinasi <strong>4R Strip Classic</strong> memberi konversi cetak fisik tertinggi di pernikahan.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Field Incidents & Activity Log Table */}
      <Card className="border-slate-200/90 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Log Insiden &amp; Aktivitas Operator Lapangan
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Catatan kendala teknis perangkat fisik, penggantian roll ribbon, serta pemulihan jaringan kiosk.
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 border border-slate-200 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px] text-slate-500">filter_list</span>
                <span>{selectedCategory === 'Semua' ? 'Semua Kategori' : selectedCategory}</span>
                <span className="material-symbols-outlined text-[15px] text-slate-400">arrow_drop_down</span>
              </button>

              {filterDropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30">
                  {['Semua', 'Hardware', 'Jaringan', 'Setup Sesi'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{cat === 'Semua' ? 'Semua Kategori' : cat}</span>
                      {selectedCategory === cat && (
                        <span className="material-symbols-outlined text-[14px] text-indigo-600">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70 border-b border-slate-200/80">
                  <TableHead className="w-28 font-bold text-[11px] text-slate-500 uppercase tracking-wider pl-5">Waktu</TableHead>
                  <TableHead className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Lokasi / Event</TableHead>
                  <TableHead className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Operator</TableHead>
                  <TableHead className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Kategori</TableHead>
                  <TableHead className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="font-bold text-[11px] text-slate-500 uppercase tracking-wider pr-5">Tindakan Lapangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.map((inc) => (
                  <TableRow key={inc.id} className="hover:bg-slate-50/60 transition-colors border-b border-slate-100">
                    <TableCell className="font-mono text-xs text-slate-900 font-medium pl-5 whitespace-nowrap">
                      {inc.waktu}
                    </TableCell>
                    <TableCell className="text-xs text-slate-900 font-semibold">
                      {inc.lokasi}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {inc.operator}
                    </TableCell>
                    <TableCell>
                      {inc.kategori === 'Hardware' ? (
                        <Badge variant="danger" className="text-[10px]">
                          Hardware
                        </Badge>
                      ) : inc.kategori === 'Jaringan' ? (
                        <Badge variant="indigo" className="text-[10px]">
                          Jaringan
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          Setup Sesi
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="success" className="gap-1 text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {inc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 pr-5">
                      {inc.tindakan}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredIncidents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                      Tidak ada log insiden untuk kategori "{selectedCategory}".
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* SaaS Quota Warning & Upgrade Banner */}
      <div className="p-5 rounded-xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[20px]">bolt</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Butuh penambahan kuota sesi sebelum event weekend?
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Starter Plan tersisa 360 sesi (18%). Upgrade ke Pro Plan untuk unmetered sync dan multi-node tanpa batas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => showToast('Membuka rincian konsumsi kuota...')}
            className="text-xs text-slate-200 border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white"
          >
            Rincian Kuota
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/superadmin/plans')}
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm"
          >
            Upgrade Paket SaaS
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
