import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastSync('Barusan');
      showToast('Telemetri perangkat berhasil disinkronkan');
    }, 900);
  };

  const handleExport = () => {
    showToast('Laporan Operasional PDF & CSV berhasil diunduh');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredIncidents = selectedCategory === 'Semua'
    ? incidentsData
    : incidentsData.filter((item) => item.kategori === selectedCategory);

  // Dynamic values based on time range
  const metrics = timeRange === 'today'
    ? {
        sessions: '496',
        sessionsChange: '+14.2%',
        sessionsVs: 'vs 434 sesi hari kemarin',
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
    <div className="flex flex-col w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-inverse-surface text-inverse-on-surface rounded-xl shadow-lg border border-outline-variant/30 text-body-sm animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span>Utama</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-medium">Ringkasan Operasional</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Ringkasan Operasional &amp; Telemetri Perangkat
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            Pantau performa armada photobooth, konsumsi kertas &amp; ribbon tinta, utilisasi kuota SaaS, dan stabilitas jaringan seluruh terminal event aktif secara real-time.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-space-xs">
          {/* Time Range Filter */}
          <div className="flex items-center rounded-xl bg-surface-container-low p-1 shadow-sm">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-space-sm py-1 rounded-lg font-label-sm text-label-sm font-medium transition-all ${
                timeRange === 'today'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-space-sm py-1 rounded-lg font-label-sm text-label-sm font-medium transition-all ${
                timeRange === '7d'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-space-sm py-1 rounded-lg font-label-sm text-label-sm font-medium transition-all ${
                timeRange === '30d'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              30 Hari
            </button>
          </div>

          {/* Refresh Button */}
          <button
            id="refresh-telemetry-btn"
            onClick={handleRefresh}
            className="flex items-center gap-space-2xs px-space-sm py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors shadow-sm cursor-pointer"
          >
            <span
              id="refresh-icon"
              className={`material-symbols-outlined text-[16px] text-primary ${isRefreshing ? 'animate-spin' : ''}`}
            >
              sync
            </span>
            <span>Refresh</span>
          </button>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-space-2xs px-space-sm py-2 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export Laporan</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-lg">
        {/* KPI 1: Sesi Terproses Hari Ini */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-primary/5 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">
              Sesi Terproses Hari Ini
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">photo_camera_front</span>
            </span>
          </div>
          <div className="my-space-xs">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-display text-display text-on-surface font-semibold tracking-tight">
                {metrics.sessions}
              </span>
              <span className="font-label-sm text-label-sm text-tertiary font-semibold flex items-center">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span> {metrics.sessionsChange}
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{metrics.sessionsVs}</p>
          </div>
          <div className="pt-space-xs mt-space-2xs flex items-center justify-between text-on-surface-variant font-mono-data text-body-sm border-t border-surface-container-high/50">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary"></span> On-Site: <strong>{metrics.onsite}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span> Online: <strong>{metrics.online}</strong>
            </span>
          </div>
        </div>

        {/* KPI 2: Kertas & Ribbon Terpakai */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-secondary/5 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">
              Kertas &amp; Ribbon Terpakai
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">print</span>
            </span>
          </div>
          <div className="my-space-xs">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-display text-display text-on-surface font-semibold tracking-tight">
                {metrics.paper}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant font-normal">Lembar</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">DNP DS620 &amp; DS-RX1 Fleet</p>
          </div>
          <div className="pt-space-xs mt-space-2xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-surface-container-high/50">
            <span className="text-on-surface">Stok Gudang: {metrics.paperStock}</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-tertiary font-mono-data">
              {metrics.paperSafe}
            </span>
          </div>
        </div>

        {/* KPI 3: Utilisasi Kuota SaaS */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-tertiary/5 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">
              Utilisasi Kuota SaaS
            </span>
            <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[18px]">data_usage</span>
            </span>
          </div>
          <div className="my-space-xs">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-display text-on-surface font-semibold tracking-tight">
                {metrics.quotaPercent}%
              </span>
              <span className="font-label-sm text-label-sm text-error font-medium px-2 py-0.5 rounded bg-error-container/40">
                Mendekati Batas
              </span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-primary-container h-full rounded-full transition-all duration-500" style={{ width: `${metrics.quotaPercent}%` }}></div>
            </div>
          </div>
          <div className="pt-space-xs mt-space-2xs flex items-center justify-between font-mono-data text-body-sm text-on-surface-variant border-t border-surface-container-high/50">
            <span>{metrics.quotaUsed} / {metrics.quotaTotal} Sesi</span>
            <span>Reset: 9 hari lagi</span>
          </div>
        </div>

        {/* KPI 4: Uptime & Latensi Armada */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-tertiary/10 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">
              Uptime &amp; Latensi Armada
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[18px]">router</span>
            </span>
          </div>
          <div className="my-space-xs">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-display text-display text-on-surface font-semibold tracking-tight">
                {metrics.uptime}
              </span>
              <span className="font-label-sm text-label-sm text-tertiary font-medium">{metrics.latency}</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">4 Node Terhubung Real-Time</p>
          </div>
          <div className="pt-space-xs mt-space-2xs flex items-center justify-between font-label-sm text-label-sm border-t border-surface-container-high/50">
            <span className="flex items-center gap-1.5 text-on-surface font-medium">
              <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span> 4 Aktif / 0 Disconnect
            </span>
            <span className="text-on-surface-variant font-mono-data">Sync {lastSync}</span>
          </div>
        </div>
      </div>

      {/* Hardware Telemetry Section Header */}
      <div className="flex flex-col gap-space-xs mb-space-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Telemetri Hardware &amp; Printer Fleet</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Status hardware level komponen real-time pada setiap unit photobooth event.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-mono-data text-body-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span> 3 Node Terpasang
          </span>
        </div>
      </div>

      {/* 3 Hardware Node Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-lg">
        {/* NODE-01 */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-start justify-between mb-space-sm">
              <div>
                <span className="font-mono-data text-label-sm text-on-surface-variant">NODE-01</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Pullman Grand Wedding</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Ballroom 1, Pullman Thamrin</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span> Live
              </span>
            </div>

            <div className="space-y-space-xs pt-space-xs">
              {/* Printer Box */}
              <div className="p-space-xs rounded-lg bg-surface-container-low flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">print</span> DNP DS620 (4R Strip)
                  </span>
                  <span className="font-mono-data font-semibold text-error">Sisa 38 lbr</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                  <div className="bg-error h-full rounded-full" style={{ width: '15%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] text-on-surface-variant font-mono-data">
                  <span>Ribbon Sisa 92%</span>
                  <span>Kapasitas 400</span>
                </div>
              </div>

              {/* Sub-grid: Camera & Network */}
              <div className="grid grid-cols-2 gap-space-xs">
                <div className="p-space-xs rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-tertiary">photo_camera</span> Kamera
                  </span>
                  <span className="font-label-md text-label-md font-medium text-on-surface mt-1">Canon EOS R100</span>
                  <span className="font-mono-data text-body-sm text-on-surface-variant">Bat. 98% • USB Tether</span>
                </div>
                <div className="p-space-xs rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-tertiary">wifi</span> Jaringan
                  </span>
                  <span className="font-label-md text-label-md font-medium text-on-surface mt-1">Telkomsel Orbit 5G</span>
                  <span className="font-mono-data text-body-sm text-on-surface-variant">42 Mbps • 14ms</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface-variant font-mono-data text-body-sm bg-surface-container-low/50 -mx-space-md -mb-space-md px-space-md py-2 rounded-b-xl border-t border-surface-container-high/40">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">device_thermostat</span> 34°C Normal
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">account_circle</span> Aris (Lead)
            </span>
          </div>
        </div>

        {/* NODE-02 */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-start justify-between mb-space-sm">
              <div>
                <span className="font-mono-data text-label-sm text-on-surface-variant">NODE-02</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">ICE BSD Tech Summit</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Hall 3A Booth #82, BSD Tangerang</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span> Live
              </span>
            </div>

            <div className="space-y-space-xs pt-space-xs">
              {/* Printer Box */}
              <div className="p-space-xs rounded-lg bg-surface-container-low flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">print</span> DNP DS-RX1 (2R Mini)
                  </span>
                  <span className="font-mono-data font-semibold text-on-surface">Sisa 140 lbr</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary-container h-full rounded-full" style={{ width: '52%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] text-on-surface-variant font-mono-data">
                  <span>Ribbon Sisa 86%</span>
                  <span>Kapasitas 700</span>
                </div>
              </div>

              {/* Sub-grid: Camera & Network */}
              <div className="grid grid-cols-2 gap-space-xs">
                <div className="p-space-xs rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-tertiary">photo_camera</span> Kamera
                  </span>
                  <span className="font-label-md text-label-md font-medium text-on-surface mt-1">Sony ZV-E10</span>
                  <span className="font-mono-data text-body-sm text-on-surface-variant">AC Adapter • Dummy Bat</span>
                </div>
                <div className="p-space-xs rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-tertiary">lan</span> Jaringan
                  </span>
                  <span className="font-label-md text-label-md font-medium text-on-surface mt-1">Dedicated LAN ICE</span>
                  <span className="font-mono-data text-body-sm text-on-surface-variant">100 Mbps • 8ms</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface-variant font-mono-data text-body-sm bg-surface-container-low/50 -mx-space-md -mb-space-md px-space-md py-2 rounded-b-xl border-t border-surface-container-high/40">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">device_thermostat</span> 36°C Normal
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">account_circle</span> Dika Pratama
            </span>
          </div>
        </div>

        {/* NODE-03 */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-start justify-between mb-space-sm">
              <div>
                <span className="font-mono-data text-label-sm text-on-surface-variant">NODE-03</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">The Glass House Private</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Garden Pavilion, Menteng</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Standby
              </span>
            </div>

            <div className="space-y-space-xs pt-space-xs">
              {/* Printer Box */}
              <div className="p-space-xs rounded-lg bg-surface-container-low flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">print</span> DNP DS620 Standby
                  </span>
                  <span className="font-mono-data font-semibold text-tertiary">Penuh (400 lbr)</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                  <div className="bg-tertiary h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] text-on-surface-variant font-mono-data">
                  <span>Ribbon Baru 100%</span>
                  <span>Siap Event 18:30 WIB</span>
                </div>
              </div>

              {/* Sub-grid: Camera & Operator */}
              <div className="grid grid-cols-2 gap-space-xs">
                <div className="p-space-xs rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-tertiary">photo_camera</span> Kamera
                  </span>
                  <span className="font-label-md text-label-md font-medium text-on-surface mt-1">Canon EOS M50 II</span>
                  <span className="font-mono-data text-body-sm text-on-surface-variant">Baterai 100% Terisi</span>
                </div>
                <div className="p-space-xs rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-tertiary">checklist</span> Operator
                  </span>
                  <span className="font-label-md text-label-md font-medium text-on-surface mt-1">Checklist OK</span>
                  <span className="font-mono-data text-body-sm text-tertiary">Verified by Fauzan</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface-variant font-mono-data text-body-sm bg-surface-container-low/50 -mx-space-md -mb-space-md px-space-md py-2 rounded-b-xl border-t border-surface-container-high/40">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span> Mulai dlm 2 jam
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">account_circle</span> Fauzan H.
            </span>
          </div>
        </div>
      </div>

      {/* Hourly Volume Chart & Popular Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md mb-space-lg">
        {/* Left (2 cols): Hourly Session Volume */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs mb-space-md">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Volume Sesi per Jam (Hari Ini)
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Distribusi beban sesi on-site kiosk vs online web photobooth 09:00 - 21:00
                </p>
              </div>
              <div className="flex items-center gap-space-md font-label-sm text-label-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-primary"></span> On-Site Kiosk
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-tertiary-fixed-dim"></span> Online Web Booth
                </span>
              </div>
            </div>

            {/* Custom Bar Chart Canvas */}
            <div className="relative w-full h-64 flex flex-col justify-end pt-4">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-outline-variant w-full h-0"></div>
                <div className="border-b border-outline-variant w-full h-0"></div>
                <div className="border-b border-outline-variant w-full h-0"></div>
                <div className="border-b border-outline-variant w-full h-0"></div>
              </div>

              {/* Interactive Bars */}
              <div className="flex items-end justify-between h-48 gap-2 relative z-10 px-2">
                {hourlyVolumeData.map((slot) => (
                  <div key={slot.time} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer relative">
                    {/* Hover Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 bg-inverse-surface text-inverse-on-surface text-[11px] font-mono-data px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap">
                      <div>On-Site: <strong>{slot.onsite}</strong></div>
                      <div>Online: <strong>{slot.online}</strong></div>
                      <div className="border-t border-outline-variant/40 mt-0.5 pt-0.5 font-bold">Total: {slot.total}</div>
                    </div>

                    <div className="w-full max-w-[20px] flex flex-col gap-0.5 justify-end">
                      <div
                        className="w-full bg-tertiary-fixed-dim rounded-t-sm transition-all duration-300 group-hover:brightness-110"
                        style={{ height: slot.onlineH }}
                        title={`Online: ${slot.online}`}
                      ></div>
                      <div
                        className="w-full bg-primary rounded-t-sm transition-all duration-300 group-hover:brightness-110"
                        style={{ height: slot.onsiteH }}
                        title={`On-Site: ${slot.onsite}`}
                      ></div>
                    </div>

                    <span
                      className={`font-mono-data text-[11px] ${
                        slot.peak
                          ? 'text-primary font-bold'
                          : slot.time === '17:00'
                          ? 'text-on-surface font-medium'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      {slot.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-space-sm pt-space-xs flex flex-wrap items-center justify-between font-body-sm text-body-sm text-on-surface-variant border-t border-surface-container-high/40">
            <span>
              Puncak trafik tertinggi: <strong className="text-on-surface">19:00 - 20:00 (133 Total Sesi)</strong>
            </span>
            <span className="text-tertiary font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">cloud_sync</span> Auto-scaling Cloud Ready
            </span>
          </div>
        </div>

        {/* Right (1 col): Popular Formats & Templates */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-space-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Format &amp; Template Populer
              </h3>
              <span className="font-mono-data text-body-sm text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded">
                Hari Ini
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Proporsi cetak fisik dan aset digital terdistribusi ke audiens.
            </p>

            <div className="space-y-space-sm">
              {/* Item 1 */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface font-medium">4R Strip (2x6" 3-Frame)</span>
                  <span className="font-mono-data text-on-surface">54% (298 lbr)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '54%' }}></div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface font-medium">4R Single Postcard (4x6")</span>
                  <span className="font-mono-data text-on-surface">26% (143 lbr)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: '26%' }}></div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface font-medium">2R Mini Bookmark Cut</span>
                  <span className="font-mono-data text-on-surface">14% (77 lbr)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-tertiary h-full rounded-full" style={{ width: '14%' }}></div>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface font-medium">Cyber Glitch Digital-Only (QR)</span>
                  <span className="font-mono-data text-on-surface">6% (34 sesi)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-surface-tint h-full rounded-full" style={{ width: '6%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation Box */}
          <div className="mt-space-md p-space-xs rounded-xl bg-surface-container-low flex items-center gap-space-xs border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0">recommend</span>
            <span className="font-body-sm text-body-sm text-on-surface">
              Kombinasi <strong>4R Strip Classic</strong> memberi konversi cetak fisik tertinggi di pernikahan.
            </span>
          </div>
        </div>
      </div>

      {/* Field Incidents & Activity Log Table */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm mb-space-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs mb-space-md">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Log Insiden &amp; Aktivitas Operator Lapangan
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Catatan kendala teknis perangkat fisik, penggantian roll ribbon, serta pemulihan jaringan kiosk.
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className="flex items-center gap-1 px-space-xs py-1 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface text-body-sm transition-colors cursor-pointer border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              <span>{selectedCategory === 'Semua' ? 'Semua Kategori' : selectedCategory}</span>
              <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
            </button>

            {filterDropdownOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-1 z-30">
                {['Semua', 'Hardware', 'Jaringan', 'Setup Sesi'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-body-sm hover:bg-surface-container-low transition-colors flex items-center justify-between ${
                      selectedCategory === cat ? 'text-primary font-semibold bg-surface-container-low/50' : 'text-on-surface'
                    }`}
                  >
                    <span>{cat === 'Semua' ? 'Semua Kategori' : cat}</span>
                    {selectedCategory === cat && (
                      <span className="material-symbols-outlined text-[14px] text-primary">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-md font-body-md">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-2.5 px-space-sm rounded-l-lg">Waktu</th>
                <th className="py-2.5 px-space-sm">Lokasi / Event</th>
                <th className="py-2.5 px-space-sm">Operator</th>
                <th className="py-2.5 px-space-sm">Kategori</th>
                <th className="py-2.5 px-space-sm">Status</th>
                <th className="py-2.5 px-space-sm rounded-r-lg">Tindakan Lapangan</th>
              </tr>
            </thead>
            <tbody className="divide-y-0">
              {filteredIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-surface-container-low/50 transition-colors border-b border-surface-container-high/30">
                  <td className="py-space-xs px-space-sm font-mono-data text-body-sm text-on-surface font-medium whitespace-nowrap">
                    {inc.waktu}
                  </td>
                  <td className="py-space-xs px-space-sm font-body-sm text-body-sm text-on-surface font-medium">
                    {inc.lokasi}
                  </td>
                  <td className="py-space-xs px-space-sm font-body-sm text-body-sm text-on-surface-variant">
                    {inc.operator}
                  </td>
                  <td className="py-space-xs px-space-sm">
                    {inc.kategori === 'Hardware' ? (
                      <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-medium">
                        Hardware
                      </span>
                    ) : inc.kategori === 'Jaringan' ? (
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-medium">
                        Jaringan
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-medium">
                        Setup Sesi
                      </span>
                    )}
                  </td>
                  <td className="py-space-xs px-space-sm">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> {inc.status}
                    </span>
                  </td>
                  <td className="py-space-xs px-space-sm font-body-sm text-body-sm text-on-surface">
                    {inc.tindakan}
                  </td>
                </tr>
              ))}
              {filteredIncidents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-on-surface-variant font-body-sm">
                    Tidak ada log insiden untuk kategori "{selectedCategory}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SaaS Quota Warning & Upgrade Banner */}
      <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-space-md border border-outline-variant/20">
        <div className="flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">bolt</span>
          </div>
          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Butuh penambahan kuota sesi sebelum weekend?
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Starter Plan tersisa 360 sesi (18%). Upgrade ke Pro Plan untuk unmetered sync dan multi-node tanpa batas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-space-xs flex-shrink-0">
          <button
            onClick={() => showToast('Membuka rincian konsumsi kuota...')}
            className="px-space-sm py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors shadow-sm cursor-pointer"
          >
            Rincian Penggunaan
          </button>
          <button
            onClick={() => navigate('/superadmin/plans')}
            className="px-space-md py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-label-md text-label-md transition-colors shadow-sm cursor-pointer"
          >
            Upgrade Paket SaaS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
