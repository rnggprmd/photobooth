import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface EventItem {
  id: string;
  name: string;
  type: 'onsite' | 'hybrid' | 'online';
  status: 'live' | 'scheduled' | 'completed' | 'draft';
  package: string;
  venue: string;
  timeRange: string;
  durationLeft?: string;
  durationRunning?: string;
  progressSessions?: number;
  totalQuota?: number;
  printCount?: number;
  operators: { initial: string; name: string; role: string; color: string }[];
  hardwareStatus: { dnp: string; camera: string };
  templates: string[];
  dateBadge: string;
  metricsText?: string;
}

export const EventsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'scheduled' | 'completed' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [applySuccessToast, setApplySuccessToast] = useState<string | null>(null);

  const events: EventItem[] = [
    {
      id: 'EVT-2026-WD098',
      name: 'Wedding of Kevin & Astrid',
      type: 'onsite',
      status: 'live',
      package: 'Paket Platinum Wedding',
      venue: 'Grand Ballroom, Pullman Central Park (Jakarta Barat)',
      timeRange: '14:00 - 18:00 WIB',
      durationLeft: '01 Jam 45 Mnt',
      progressSessions: 184,
      totalQuota: 200,
      printCount: 368,
      operators: [
        { initial: 'R', name: 'Rian', role: 'Lead Tech', color: 'bg-primary text-on-primary' },
        { initial: 'S', name: 'Siti', role: 'Assistant', color: 'bg-secondary text-on-secondary' },
      ],
      hardwareStatus: {
        dnp: 'DNP DS620 Ready',
        camera: 'Canon EOS R100 • 98% Batt',
      },
      templates: ['4R Floral Gold Luxury', '2R Strip Classic 3-Pose'],
      dateBadge: 'SEDANG BERLANGSUNG • LIVE',
    },
    {
      id: 'EVT-2026-CP412',
      name: 'Tech Summit Afterparty 2026',
      type: 'hybrid',
      status: 'live',
      package: 'Enterprise Corporate Hybrid',
      venue: 'ICE BSD Hall 3 (Tangerang) & Web Link Live Sync',
      timeRange: '10:00 - 21:00 WIB',
      durationRunning: '03 Jam 10 Mnt',
      progressSessions: 312,
      totalQuota: 500,
      printCount: 112,
      operators: [
        { initial: 'D', name: 'Dimas Tri', role: 'Standalone Ops', color: 'bg-tertiary text-on-tertiary' },
      ],
      hardwareStatus: {
        dnp: 'Terminal #03 Online (5G Mod)',
        camera: 'Live Sync Web App',
      },
      templates: ['Cyber Glitch 2R Strip', 'Modern Minimalist Polar'],
      dateBadge: 'SEDANG BERLANGSUNG • HYBRID CLOUD',
    },
    {
      id: 'EVT-2026-BD044',
      name: 'Sweet 17th Birthday Celebration (Clara)',
      type: 'onsite',
      status: 'scheduled',
      package: 'Paket Sweet Glam 3 Jam',
      venue: 'The Glass House, Dharmawangsa (Jakarta Selatan)',
      timeRange: '18:30 - 21:30 WIB',
      durationLeft: 'Mulai 18:30 WIB',
      operators: [
        { initial: 'F', name: 'Fauzan', role: 'Field Operator', color: 'bg-primary text-on-primary' },
      ],
      hardwareStatus: {
        dnp: 'Roll Baru DNP DS-RX1 (700 Lbr)',
        camera: 'Telkomsel Orbit 42 Mbps Ready',
      },
      templates: ['Pastel Minimalist 4R', '2R Dual Photo Bookmark'],
      dateBadge: 'TERJADWAL HARI INI • STANDBY',
    },
    {
      id: 'EVT-2026-CP780',
      name: 'Corporate Gala Dinner Bank Mandiri',
      type: 'onsite',
      status: 'scheduled',
      package: 'Paket Gold Corporate',
      venue: 'Ritz Carlton Mega Kuningan, Grand Ballroom 2',
      timeRange: '19:00 - 23:00 WIB',
      durationLeft: '12 Okt 2026',
      operators: [
        { initial: 'A', name: 'Pending H-2', role: 'Assignee', color: 'bg-outline text-surface-container-lowest' },
      ],
      hardwareStatus: {
        dnp: 'Target: 300 Sesi VIP',
        camera: 'Kustom Frame Mandiri Disetujui',
      },
      templates: ['Mandiri Blue Gold 4R', 'Formal Strip 2-Up'],
      dateBadge: 'TERJADWAL • SENIN DEPAN',
    },
  ];

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'live') return evt.status === 'live';
    if (activeTab === 'scheduled') return evt.status === 'scheduled';
    if (activeTab === 'completed') return evt.status === 'completed';
    if (activeTab === 'draft') return evt.status === 'draft';
    return true;
  });

  const handleApplyPackage = (packageName: string) => {
    setApplySuccessToast(`Paket "${packageName}" berhasil diterapkan ke event!`);
    setTimeout(() => setApplySuccessToast(null), 3000);
  };

  return (
    <div className="flex flex-col w-full space-y-space-lg">
      {/* Toast Notification */}
      {applySuccessToast && (
        <div className="fixed bottom-6 right-6 bg-primary text-on-primary px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md">{applySuccessToast}</span>
        </div>
      )}

      {/* Page Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
        <div className="flex flex-col space-y-space-2xs">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-mono-data text-label-sm uppercase tracking-wider">
            <span>PRD 8.6 & 8.7</span>
            <span>•</span>
            <span>BRD 10.2 Operations</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">
            Manajemen Event & Jadwal Layanan
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Kelola reservasi event, alokasi operator booth, assign paket photobooth, dan monitoring status setup hardware secara real-time.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center flex-wrap gap-space-xs">
          {/* Calendar / Table Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/20">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-space-sm py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1 transition-all ${
                viewMode === 'grid'
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
              <span>Grid Detail</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-space-sm py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1 transition-all ${
                viewMode === 'calendar'
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>Kalender</span>
            </button>
          </div>

          {/* Filter button */}
          <button
            onClick={() => setActiveTab(activeTab === 'all' ? 'live' : 'all')}
            className="px-space-sm py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-space-2xs transition-colors shadow-sm border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">tune</span>
            <span>Filter Status</span>
          </button>

          {/* Primary Action */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-space-md py-2 rounded-xl bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-space-2xs hover:bg-primary transition-all shadow-md font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Buat Event Baru</span>
          </button>
        </div>
      </div>

      {/* KPI & Telemetry Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Metric 1: Live Events */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
              Event Berlangsung Hari Ini
            </span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-container opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary-container"></span>
            </span>
          </div>
          <div className="mt-space-sm flex items-baseline justify-between">
            <div className="text-[28px] font-bold tracking-tight text-on-surface leading-none">
              3 <span className="text-sm font-normal text-on-surface-variant">Booth Live</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-tertiary font-mono-data text-[11px] font-semibold">
              100% Aktif
            </span>
          </div>
          <div className="mt-space-xs pt-1 text-on-surface-variant text-body-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
            <span>2 On-site venue + 1 Hybrid stream</span>
          </div>
        </div>

        {/* Metric 2: Scheduled Events */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between transition-all hover:shadow-md border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
              Event Terjadwal Minggu Ini
            </span>
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">event_upcoming</span>
            </div>
          </div>
          <div className="mt-space-sm flex items-baseline justify-between">
            <div className="text-[28px] font-bold tracking-tight text-on-surface leading-none">
              8 <span className="text-sm font-normal text-on-surface-variant">Event</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-mono-data text-[11px] font-medium">
              +3 dr mg lalu
            </span>
          </div>
          <div className="mt-space-xs pt-1 text-on-surface-variant text-body-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">near_me</span>
            <span>Next: <strong className="text-on-surface font-medium">Sweet 17th Clara</strong> (18:30 WIB)</span>
          </div>
        </div>

        {/* Metric 3: Operator Standby */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between transition-all hover:shadow-md border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
              Operator Standby & On-Duty
            </span>
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[18px]">engineering</span>
            </div>
          </div>
          <div className="mt-space-sm flex items-baseline justify-between">
            <div className="text-[28px] font-bold tracking-tight text-on-surface leading-none">
              6<span className="text-on-surface-variant text-lg font-normal">/8</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-mono-data font-semibold">
              75% Utilisasi
            </span>
          </div>
          <div className="mt-space-xs pt-1 w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* Metric 4: Hardware Health */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between transition-all hover:shadow-md border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
              Kesiapan Hardware & Kertas
            </span>
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[18px]">print</span>
            </div>
          </div>
          <div className="mt-space-sm flex items-baseline justify-between">
            <div className="text-[28px] font-bold tracking-tight text-on-surface leading-none">96%</div>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-tertiary font-mono-data text-[11px] font-semibold">
              DNP & Canon OK
            </span>
          </div>
          <div className="mt-space-xs pt-1 text-on-surface-variant text-body-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">inventory_2</span>
            <span>1,850/2,000 lembar thermo siap cetak</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-surface-container-high">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">search</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-space-md py-2 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant text-body-sm font-body-sm rounded-xl focus:outline-none focus:bg-surface-container-lowest transition-colors shadow-inner border border-outline-variant/20"
            placeholder="Cari nama pengantin, corporate client, venue, atau ID event..."
            type="text"
          />
        </div>

        {/* Filter Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl font-label-md text-label-md whitespace-nowrap shadow-sm transition-all ${
              activeTab === 'all'
                ? 'bg-primary-container text-on-primary font-semibold'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Semua (14)
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`px-3 py-1.5 rounded-xl font-label-md text-label-md whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'live'
                ? 'bg-primary-container text-on-primary font-semibold'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
            <span>Sedang Berlangsung (3)</span>
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`px-3 py-1.5 rounded-xl font-label-md text-label-md whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'scheduled'
                ? 'bg-primary-container text-on-primary font-semibold'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span>Terjadwal (8)</span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-xl font-label-md text-label-md whitespace-nowrap transition-all ${
              activeTab === 'completed'
                ? 'bg-primary-container text-on-primary font-semibold'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Selesai (3)
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`px-3 py-1.5 rounded-xl font-label-md text-label-md whitespace-nowrap transition-all ${
              activeTab === 'draft'
                ? 'bg-primary-container text-on-primary font-semibold'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Draf (0)
          </button>
        </div>
      </div>

      {/* Layout Main Content: Event Feed + Service Packages Sidebar Drawer */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Column 1: Detailed Event Cards Feed (8 cols on XL) */}
        <div className="xl:col-span-8 space-y-space-md">
          {viewMode === 'calendar' ? (
            /* Calendar View Mockup */
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container-high space-y-space-md">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  Jadwal Event Oktober 2026
                </h3>
                <span className="text-body-sm text-on-surface-variant font-mono-data">Total 14 Acara Terdaftar</span>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center font-label-sm text-label-sm font-semibold text-on-surface-variant">
                <span>SEN</span><span>SEL</span><span>RAB</span><span>KAM</span><span>JUM</span><span>SAB</span><span>MIN</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const hasEvent = [4, 12, 18, 24, 28].includes(day);
                  const isToday = day === 8;
                  return (
                    <div
                      key={day}
                      className={`min-h-[72px] p-1.5 rounded-lg border text-left transition-all ${
                        isToday
                          ? 'bg-primary-fixed/30 border-primary'
                          : hasEvent
                          ? 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                          : 'bg-surface-container-lowest border-outline-variant/10 opacity-70'
                      }`}
                    >
                      <span className={`font-mono-data text-body-sm font-semibold ${isToday ? 'text-primary' : 'text-on-surface'}`}>
                        {day}
                      </span>
                      {day === 8 && (
                        <div className="mt-1 px-1 py-0.5 rounded bg-primary text-on-primary text-[10px] font-medium truncate">
                          3 Live Booth
                        </div>
                      )}
                      {day === 24 && (
                        <div className="mt-1 px-1 py-0.5 rounded bg-secondary-container text-tertiary text-[10px] font-medium truncate">
                          Kevin & Astrid
                        </div>
                      )}
                      {day === 28 && (
                        <div className="mt-1 px-1 py-0.5 rounded bg-surface-container-highest text-on-surface text-[10px] font-medium truncate">
                          Sweet 17 Clara
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Grid Detail View */
            <>
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border border-surface-container-high"
                >
                  {/* Live Accent Bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${
                      event.status === 'live'
                        ? 'bg-gradient-to-r from-tertiary to-primary'
                        : 'bg-surface-container-highest'
                    }`}
                  ></div>

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-space-xs flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                            event.status === 'live'
                              ? 'bg-secondary-container text-tertiary'
                              : 'bg-primary-fixed text-on-primary-fixed'
                          }`}
                        >
                          {event.status === 'live' && (
                            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                          )}
                          {event.dateBadge}
                        </span>
                        <span className="font-mono-data text-body-sm text-on-surface-variant">ID: {event.id}</span>
                        <span className="text-outline-variant">•</span>
                        <span className="font-label-sm text-label-sm bg-surface-container px-2 py-0.5 rounded text-on-surface font-medium">
                          {event.package}
                        </span>
                      </div>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                        {event.name}
                      </h2>
                      <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[16px] text-tertiary">location_on</span>
                        <span>{event.venue}</span>
                      </div>
                    </div>

                    <div className="flex items-center md:flex-col md:items-end justify-between gap-1 bg-surface-container-low p-space-xs rounded-lg border border-outline-variant/15">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {event.status === 'live' ? 'Sisa Durasi Sewa' : 'Waktu Sesi'}
                      </span>
                      <div className="font-mono-data font-semibold text-headline-sm text-tertiary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">timer</span>
                        {event.durationLeft || event.durationRunning || 'Standby'}
                      </div>
                      <span className="font-mono-data text-label-sm text-on-surface-variant">{event.timeRange}</span>
                    </div>
                  </div>

                  {/* Telemetry & Media Progress Grid */}
                  <div className="mt-space-md grid grid-cols-1 md:grid-cols-3 gap-space-sm p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/20">
                    {/* Sesi Capture Counter */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                        <span>Progress Sesi Cetak</span>
                        <span className="font-mono-data font-semibold text-on-surface">
                          {event.progressSessions
                            ? `${event.progressSessions} / ${event.totalQuota} Sesi (${Math.round(
                                (event.progressSessions / (event.totalQuota || 1)) * 100
                              )}%)`
                            : 'Belum Mulai'}
                        </span>
                      </div>
                      <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${
                              event.progressSessions
                                ? Math.min(100, Math.round((event.progressSessions / (event.totalQuota || 1)) * 100))
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-on-surface-variant font-body-sm text-body-sm flex items-center justify-between">
                        <span>Unlimited Duplicate Prints</span>
                        <span className="font-mono-data text-primary font-medium">
                          {event.printCount ? `${event.printCount} lbr keluar` : 'Standby roll'}
                        </span>
                      </p>
                    </div>

                    {/* Operator In-Charge */}
                    <div className="space-y-1">
                      <span className="text-on-surface-variant font-label-sm text-label-sm block">Operator Bertugas</span>
                      <div className="flex items-center gap-space-xs">
                        {event.operators.map((op, idx) => (
                          <div
                            key={idx}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              op.color
                            } ${idx > 0 ? '-ml-2' : ''}`}
                            title={`${op.name} (${op.role})`}
                          >
                            {op.initial}
                          </div>
                        ))}
                        <div className="text-body-sm font-body-sm text-on-surface font-medium truncate">
                          {event.operators.map((op) => op.name).join(' & ')}
                        </div>
                      </div>
                      <span className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                        WhatsApp Active Dispatch
                      </span>
                    </div>

                    {/* Hardware Fleet Check */}
                    <div className="space-y-1">
                      <span className="text-on-surface-variant font-label-sm text-label-sm block">Hardware Node</span>
                      <div className="flex items-center gap-2 text-on-surface font-mono-data text-body-sm">
                        <span className="inline-flex items-center gap-1 text-tertiary font-medium">
                          <span className="material-symbols-outlined text-[14px]">print</span>
                          {event.hardwareStatus.dnp}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[14px] text-primary">camera</span>
                        <span>{event.hardwareStatus.camera}</span>
                      </div>
                    </div>
                  </div>

                  {/* Frame Layout Badges & Actions */}
                  <div className="mt-space-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-xs overflow-x-auto">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-medium whitespace-nowrap">
                        Template Aktif:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {event.templates.map((tpl, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px] text-primary">crop_portrait</span>
                            {tpl}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-space-xs">
                      {event.status === 'live' ? (
                        <>
                          <Link
                            to="/booth/onsite"
                            className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            <span>Live Monitor</span>
                          </Link>
                          <Link
                            to="/templates"
                            className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1 transition-colors border border-outline-variant/20"
                          >
                            <span className="material-symbols-outlined text-[16px]">style</span>
                            <span>Kelola Template</span>
                          </Link>
                          <button
                            onClick={() => alert(`Log sesi ${event.id} berhasil diunduh.`)}
                            className="p-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/20"
                            title="Download Log"
                          >
                            <span className="material-symbols-outlined text-[18px]">cloud_download</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => alert(`Jadwal event ${event.id} siap disesuaikan.`)}
                            className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1 transition-colors border border-outline-variant/20"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                            <span>Edit Jam</span>
                          </button>
                          <Link
                            to="/booth/onsite"
                            className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md flex items-center gap-1 transition-colors shadow-sm font-semibold"
                          >
                            <span className="material-symbols-outlined text-[16px]">play_circle</span>
                            <span>Aktivasi Kiosk</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Column 2: Side Panel / Drawer "Katalog Paket Layanan Tersedia" (4 cols on XL) */}
        <div className="xl:col-span-4 space-y-space-md">
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm space-y-space-md sticky top-20 border border-surface-container-high">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono-data text-label-sm uppercase tracking-wider text-on-surface-variant">
                  PRD Section 8.7
                </span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Pilihan Paket Layanan</h3>
              </div>
              <Link
                to="/packages"
                className="text-primary hover:text-primary-container font-label-sm text-label-sm font-semibold flex items-center gap-0.5"
              >
                <span>+ Buat Paket</span>
              </Link>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Template paket standar yang dapat langsung di-assign ke event booking baru.
            </p>

            {/* List of Packages */}
            <div className="space-y-space-sm">
              {/* Package 1: Basic Tier */}
              <div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors relative border border-outline-variant/20">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono-data text-[11px] px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-medium">
                      BASIC TIER
                    </span>
                    <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">
                      Paket Starter Intimate
                    </h4>
                    <div className="font-mono-data font-bold text-primary text-body-lg mt-0.5">Rp 2.500.000</div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">photo_library</span>
                </div>
                <div className="mt-space-xs space-y-1 text-on-surface-variant font-body-sm text-body-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-tertiary">check</span>
                    <span>Durasi: <strong>2 Jam Layanan</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-tertiary">check</span>
                    <span>Maks. 100 Lembar Cetak 4R</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-tertiary">check</span>
                    <span>1 Operator Standby</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-tertiary">check</span>
                    <span>QR Galeri Cloud 7 Hari</span>
                  </div>
                </div>
                <div className="mt-space-sm pt-space-xs flex items-center justify-between border-t border-outline-variant/10">
                  <span className="font-mono-data text-label-sm text-on-surface-variant">Digunakan 4x Bln ini</span>
                  <button
                    onClick={() => handleApplyPackage('Paket Starter Intimate')}
                    className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-on-primary font-label-sm text-label-sm font-medium transition-colors shadow-sm border border-outline-variant/20"
                  >
                    Terapkan ke Event
                  </button>
                </div>
              </div>

              {/* Package 2: Most Popular Wedding Royal */}
              <div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-md relative overflow-hidden border border-primary/30">
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-primary-fixed rounded-full flex items-end justify-start p-1.5">
                  <span className="material-symbols-outlined text-on-primary-fixed text-[16px]">star</span>
                </div>
                <div>
                  <span className="font-mono-data text-[11px] px-1.5 py-0.5 rounded bg-primary text-on-primary font-semibold">
                    BEST SELLER
                  </span>
                  <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">
                    Paket Wedding Royal Platinum
                  </h4>
                  <div className="font-mono-data font-bold text-primary text-body-lg mt-0.5">Rp 4.750.000</div>
                </div>
                <div className="mt-space-xs space-y-1 text-on-surface font-body-sm text-body-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>
                    <span>Durasi: <strong>4 Jam Layanan</strong> (Siang / Malam)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>
                    <span>Unlimited Prints (Max 250 Sesi Foto)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>
                    <span>2 Operator Dedicated (Lead + Assistant)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>
                    <span>Kustom Frame Design + Guestbook Kayu</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>
                    <span>Cloud Storage 30 Hari & Live Slideshow</span>
                  </div>
                </div>
                <div className="mt-space-sm pt-space-xs flex items-center justify-between border-t border-outline-variant/10">
                  <span className="font-mono-data text-label-sm text-primary font-semibold">Digunakan 9x Bln ini</span>
                  <button
                    onClick={() => handleApplyPackage('Paket Wedding Royal Platinum')}
                    className="px-2.5 py-1 rounded bg-primary-container text-on-primary hover:bg-primary font-label-sm text-label-sm font-semibold transition-colors shadow-sm"
                  >
                    Terapkan ke Event
                  </button>
                </div>
              </div>

              {/* Package 3: Corporate Festival Unlimited */}
              <div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors relative border border-outline-variant/20">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono-data text-[11px] px-1.5 py-0.5 rounded bg-secondary-container text-tertiary font-medium">
                      CORPORATE SCALE
                    </span>
                    <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">
                      Paket Festival & Corporate Hybrid
                    </h4>
                    <div className="font-mono-data font-bold text-tertiary text-body-lg mt-0.5">
                      Rp 7.800.000 / Hari
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">corporate_fare</span>
                </div>
                <div className="mt-space-xs space-y-1 text-on-surface-variant font-body-sm text-body-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-tertiary">check</span>
                    <span>Durasi: <strong>8 Jam Full-Day</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-tertiary">check</span>
                    <span>Dual Printer High-Speed Sublimation</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-tertiary">check</span>
                    <span>Custom Micro-site & Data Leads Collector</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-tertiary">check</span>
                    <span>Direct WhatsApp & Email Delivery</span>
                  </div>
                </div>
                <div className="mt-space-sm pt-space-xs flex items-center justify-between border-t border-outline-variant/10">
                  <span className="font-mono-data text-label-sm text-on-surface-variant">Digunakan 3x Bln ini</span>
                  <button
                    onClick={() => handleApplyPackage('Paket Festival & Corporate Hybrid')}
                    className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-on-primary font-label-sm text-label-sm font-medium transition-colors shadow-sm border border-outline-variant/20"
                  >
                    Terapkan ke Event
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Summary Hardware Allocation Banner */}
            <div className="p-space-sm rounded-xl bg-surface-container flex items-center gap-space-xs border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-[24px]">inventory</span>
              <div className="text-body-sm flex-1">
                <span className="font-semibold text-on-surface block">Stok Kertas Gudang Utama</span>
                <span className="text-on-surface-variant font-mono-data text-label-sm">
                  4.200 Sisa Cetak (Aman untuk 14 Event)
                </span>
              </div>
              <button
                onClick={() => alert('Pemesanan refill roll kertas thermal DNP DS620 dibuka.')}
                className="px-2 py-1 rounded bg-surface-container-lowest text-primary font-label-sm text-label-sm hover:underline shadow-xs border border-outline-variant/20"
              >
                Refill
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Buat Event Baru */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-space-lg shadow-2xl border border-surface-container-high space-y-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                </span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Buat Event Photobooth Baru</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-space-xs">
              <div>
                <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-medium">Nama Acara / Klien</label>
                <input
                  placeholder="Contoh: Wedding of Dimas & Sarah"
                  className="w-full h-9 px-3 bg-surface-container-low text-on-surface font-body-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-space-xs">
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-medium">Tipe Acara</label>
                  <select className="w-full h-9 px-2 bg-surface-container-low text-on-surface font-body-sm rounded-lg border border-outline-variant/20">
                    <option>On-Site Photobooth</option>
                    <option>Online Virtual Booth</option>
                    <option>Hybrid Cloud + Kiosk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-medium">Paket Layanan</label>
                  <select className="w-full h-9 px-2 bg-surface-container-low text-on-surface font-body-sm rounded-lg border border-outline-variant/20">
                    <option>Paket Wedding Royal Platinum</option>
                    <option>Paket Starter Intimate</option>
                    <option>Paket Festival & Corporate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-medium">Lokasi / Venue</label>
                <input
                  placeholder="Contoh: Ballroom Hotel Mulia, Senayan"
                  className="w-full h-9 px-3 bg-surface-container-low text-on-surface font-body-sm rounded-lg focus:outline-none border border-outline-variant/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-space-xs">
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-medium">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    defaultValue="2026-10-15"
                    className="w-full h-9 px-3 bg-surface-container-low text-on-surface font-body-sm rounded-lg border border-outline-variant/20"
                  />
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-medium">Durasi Sesi</label>
                  <input
                    defaultValue="4 Jam (18:00 - 22:00)"
                    className="w-full h-9 px-3 bg-surface-container-low text-on-surface font-body-sm rounded-lg border border-outline-variant/20"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setApplySuccessToast('Event baru berhasil didaftarkan ke jadwal!');
                  setTimeout(() => setApplySuccessToast(null), 3000);
                }}
                className="px-4 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold transition-all shadow-sm"
              >
                Simpan & Terbitkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
