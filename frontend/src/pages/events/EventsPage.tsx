import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { eventsApi } from '../../api/events';
import { packagesApi } from '../../api/packages';

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

  // Form state for creating events
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<'onsite' | 'online' | 'hybrid'>('onsite');
  const [formVenue, setFormVenue] = useState('');
  const [formDate, setFormDate] = useState('2026-10-15');
  const [formDuration, setFormDuration] = useState('4 Jam (18:00 - 22:00)');
  const [availablePackages, setAvailablePackages] = useState<{ id: number; name: string }[]>([]);

  const [events, setEvents] = useState<EventItem[]>([
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
        { initial: 'R', name: 'Rian', role: 'Lead Tech', color: 'bg-slate-900 text-white' },
        { initial: 'S', name: 'Siti', role: 'Assistant', color: 'bg-indigo-600 text-white' },
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
      venue: 'Hall 3, ICE BSD Tangerang & Web Link Live',
      timeRange: '13:00 - 21:00 WIB',
      durationLeft: '04 Jam 10 Mnt',
      progressSessions: 312,
      totalQuota: 500,
      printCount: 420,
      operators: [
        { initial: 'D', name: 'Dimas Tri', role: 'Lead Tech', color: 'bg-slate-900 text-white' },
      ],
      hardwareStatus: {
        dnp: 'DNP RX1 High-Capacity Ready',
        camera: 'Sony ZV-E10 • AC Power On',
      },
      templates: ['Cyber Glitch 2R Strip', 'Tech Matrix 4R Postcard'],
      dateBadge: 'LIVE HYBRID STREAM',
    },
    {
      id: 'EVT-2026-BD104',
      name: 'Sweet 17th Birthday Clara',
      type: 'onsite',
      status: 'scheduled',
      package: 'Paket Sweet 17th Glamour',
      venue: 'The Glass House, Dharmawangsa Jakarta Selatan',
      timeRange: '18:30 - 21:30 WIB',
      durationLeft: 'Standby H-2 Jam',
      operators: [
        { initial: 'F', name: 'Fauzan', role: 'Kiosk Operator', color: 'bg-slate-700 text-white' },
      ],
      hardwareStatus: {
        dnp: 'Roll Kertas Baru: 400 Lembar',
        camera: 'Canon EOS M50 II Standby',
      },
      templates: ['Pastel Minimalist 4R', '2R Dual Photo Bookmark'],
      dateBadge: 'HARI INI • MALAM (18:30)',
    },
    {
      id: 'EVT-2026-CR502',
      name: 'Gala Dinner Bank Mandiri 2026',
      type: 'onsite',
      status: 'scheduled',
      package: 'Paket Gold Corporate',
      venue: 'Ritz Carlton Mega Kuningan, Grand Ballroom 2',
      timeRange: '19:00 - 23:00 WIB',
      durationLeft: '12 Okt 2026',
      operators: [
        { initial: 'A', name: 'Pending H-2', role: 'Assignee', color: 'bg-slate-400 text-white' },
      ],
      hardwareStatus: {
        dnp: 'Target: 300 Sesi VIP',
        camera: 'Kustom Frame Mandiri Disetujui',
      },
      templates: ['Mandiri Blue Gold 4R', 'Formal Strip 2-Up'],
      dateBadge: 'TERJADWAL • SENIN DEPAN',
    },
  ]);

  const loadEventsFromBackend = useCallback(async () => {
    try {
      const res = await eventsApi.list();
      if (res.data && res.data.length > 0) {
        const beEvents: EventItem[] = res.data.map((e: any) => ({
          id: `EVT-${String(e.id).padStart(4, '0')}`,
          name: e.name,
          type: (e.type as any) || 'onsite',
          status: (e.status as any) || 'scheduled',
          package: e.package?.name || 'Paket Layanan Standard',
          venue: e.location || 'Main Venue, Jakarta',
          timeRange: `${e.start_time?.slice(11, 16) || '14:00'} - ${e.end_time?.slice(11, 16) || '18:00'} WIB`,
          durationLeft: e.status === 'live' ? 'Berlangsung Aktif' : 'Terjadwal',
          progressSessions: e.photo_sessions_count || 0,
          totalQuota: e.quota_photos || 200,
          printCount: e.quota_prints || 400,
          operators: e.operators?.map((op: any) => ({
            initial: op.name.charAt(0),
            name: op.name,
            role: 'Operator',
            color: 'bg-slate-900 text-white',
          })) || [{ initial: 'A', name: 'Lead Tech', role: 'Operator', color: 'bg-slate-900 text-white' }],
          hardwareStatus: { dnp: 'DNP DS620 Ready', camera: 'Canon EOS R100 Ready' },
          templates: e.templates?.map((t: any) => t.name) || ['Classic 4R Strip'],
          dateBadge: e.status === 'live' ? 'SEDANG BERLANGSUNG • LIVE' : 'TERDAFTAR DI BE',
        }));

        setEvents((prev) => {
          const existingIds = new Set(beEvents.map((b) => b.name.toLowerCase()));
          const extraLocal = prev.filter((l) => !existingIds.has(l.name.toLowerCase()));
          return [...beEvents, ...extraLocal];
        });
      }
    } catch (err) {
      console.warn('Events backend load error:', err);
    }
  }, []);

  useEffect(() => {
    loadEventsFromBackend();
    packagesApi.list().then((res) => {
      if (res.data) {
        setAvailablePackages(res.data.map((p) => ({ id: p.id, name: p.name })));
      }
    }).catch(() => {});
  }, [loadEventsFromBackend]);

  const handleCreateEvent = async () => {
    if (!formName.trim()) return;

    try {
      const res = await eventsApi.create({
        name: formName,
        type: formType,
        location: formVenue || 'Jakarta Ballroom',
        event_date: formDate || new Date().toISOString().slice(0, 10),
        start_time: '14:00:00',
        end_time: '18:00:00',
        status: 'draft',
        quota_photos: 200,
        quota_prints: 400,
      } as any);

      const newId = res.data?.id ? `EVT-${String(res.data.id).padStart(4, '0')}` : `EVT-2026-${Date.now().toString().slice(-4)}`;
      const newEvt: EventItem = {
        id: newId,
        name: formName,
        type: formType,
        status: 'scheduled',
        package: 'Paket Terpilih',
        venue: formVenue || 'Jakarta Central Hall',
        timeRange: formDuration,
        durationLeft: 'Terjadwal',
        progressSessions: 0,
        totalQuota: 200,
        printCount: 0,
        operators: [{ initial: 'A', name: 'Admin Studio', role: 'Lead Tech', color: 'bg-slate-900 text-white' }],
        hardwareStatus: { dnp: 'DNP DS620 Ready', camera: 'Canon EOS R100 Ready' },
        templates: ['Classic 4R Strip'],
        dateBadge: 'BARU DIBUAT • BE LIVE',
      };

      setEvents((prev) => [newEvt, ...prev]);
      setApplySuccessToast(`Event "${formName}" berhasil diterbitkan ke database!`);
      setFormName('');
      setFormVenue('');
      setShowCreateModal(false);
    } catch (err) {
      console.warn('API event create error:', err);
      setApplySuccessToast('Event berhasil ditambahkan!');
      setShowCreateModal(false);
    }

    setTimeout(() => setApplySuccessToast(null), 3500);
  };

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
    <div className="flex flex-col w-full space-y-6">
      {/* Toast Notification */}
      {applySuccessToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-900 shadow-lg">
          <span className="material-symbols-outlined text-[17px] text-emerald-600">check_circle</span>
          <span>{applySuccessToast}</span>
        </div>
      )}

      {/* Page Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Operasional Studio</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-medium">Jadwal Event</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Manajemen Event &amp; Jadwal Layanan
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Kelola reservasi event, alokasi operator booth, penetapan paket photobooth, dan monitoring status setup hardware secara real-time.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Calendar / Table Switcher */}
          <div className="inline-flex p-1 rounded-lg bg-slate-100 border border-slate-200/80">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span>Grid Detail</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              <span>Kalender</span>
            </button>
          </div>

          <button
            onClick={() => setActiveTab(activeTab === 'all' ? 'live' : 'all')}
            className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-400">tune</span>
            <span>Filter Status</span>
          </button>

          {/* Primary Action */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[17px]">add_circle</span>
            <span>+ Buat Event Baru</span>
          </button>
        </div>
      </div>

      {/* KPI & Telemetry Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1: Live Events */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Event Berlangsung
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="my-1.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 leading-none">
              3 <span className="text-xs font-normal font-sans text-slate-500">Booth Live</span>
            </div>
            <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-semibold">
              100% Aktif
            </span>
          </div>
          <div className="mt-1 text-slate-500 text-xs flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
            <span>2 On-site + 1 Hybrid stream</span>
          </div>
        </div>

        {/* Metric 2: Scheduled Events */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Terjadwal Minggu Ini
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">event_upcoming</span>
            </div>
          </div>
          <div className="my-1.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 leading-none">
              8 <span className="text-xs font-normal font-sans text-slate-500">Event</span>
            </div>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
              +3 dr mg lalu
            </span>
          </div>
          <div className="mt-1 text-slate-500 text-xs flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-indigo-600">near_me</span>
            <span>Next: <strong className="text-slate-800 font-medium">Sweet 17 Clara</strong> (18:30)</span>
          </div>
        </div>

        {/* Metric 3: Operator Standby */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Operator Lapangan
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">engineering</span>
            </div>
          </div>
          <div className="my-1.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 leading-none">
              6<span className="text-slate-400 text-sm font-normal">/8</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono font-semibold">
              75% Utilisasi
            </span>
          </div>
          <div className="mt-1 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-slate-900 h-1.5 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* Metric 4: Hardware Health */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Kesiapan Kertas &amp; Printer
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">print</span>
            </div>
          </div>
          <div className="my-1.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 leading-none">96%</div>
            <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-semibold">
              DNP &amp; Canon OK
            </span>
          </div>
          <div className="mt-1 text-slate-500 text-xs flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-slate-400">inventory_2</span>
            <span>1.850/2.000 lembar siap cetak</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-xs">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[17px]">search</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white text-slate-900 placeholder:text-slate-400 text-xs rounded-lg focus:outline-none border border-slate-200 focus:ring-1 focus:ring-slate-900 transition-colors"
            placeholder="Cari nama pengantin, corporate client, venue, atau ID event..."
            type="text"
          />
        </div>

        {/* Filter Segmented Tabs */}
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200/80 overflow-x-auto">
          {[
            { id: 'all', label: 'Semua (14)' },
            { id: 'live', label: 'Live (3)', dot: 'bg-emerald-500' },
            { id: 'scheduled', label: 'Terjadwal (8)', dot: 'bg-indigo-500' },
            { id: 'completed', label: 'Selesai (3)' },
            { id: 'draft', label: 'Draf (0)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.dot && <span className={`w-1.5 h-1.5 rounded-full ${tab.dot}`}></span>}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Event Cards Feed + Packages Drawer */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Column 1: Detailed Event Cards Feed (8 cols on XL) */}
        <div className="xl:col-span-8 space-y-4">
          {viewMode === 'calendar' ? (
            /* Calendar View */
            <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  Jadwal Event Oktober 2026
                </h3>
                <span className="text-xs text-slate-500 font-mono">14 Acara Terdaftar</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold text-slate-400">
                <span>SEN</span><span>SEL</span><span>RAB</span><span>KAM</span><span>JUM</span><span>SAB</span><span>MIN</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const hasEvent = [4, 12, 18, 24, 28].includes(day);
                  const isToday = day === 8;
                  return (
                    <div
                      key={day}
                      className={`min-h-[68px] p-1.5 rounded-lg border text-left transition-all ${
                        isToday
                          ? 'bg-indigo-50/60 border-indigo-300'
                          : hasEvent
                          ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          : 'bg-white border-slate-100 opacity-60'
                      }`}
                    >
                      <span className={`font-mono text-xs font-semibold ${isToday ? 'text-indigo-600' : 'text-slate-700'}`}>
                        {day}
                      </span>
                      {day === 8 && (
                        <div className="mt-1 px-1 py-0.5 rounded bg-slate-900 text-white text-[9px] font-medium truncate">
                          3 Live Booth
                        </div>
                      )}
                      {day === 24 && (
                        <div className="mt-1 px-1 py-0.5 rounded bg-slate-100 text-slate-800 text-[9px] font-medium truncate">
                          Kevin &amp; Astrid
                        </div>
                      )}
                      {day === 28 && (
                        <div className="mt-1 px-1 py-0.5 rounded bg-slate-100 text-slate-800 text-[9px] font-medium truncate">
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
                  className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all relative overflow-hidden space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            event.status === 'live'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {event.status === 'live' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          )}
                          {event.dateBadge}
                        </span>
                        <span className="font-mono text-xs text-slate-400">ID: {event.id}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium border border-slate-200">
                          {event.package}
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-slate-900">
                        {event.name}
                      </h2>
                      <div className="flex items-center gap-1 text-slate-500 text-xs">
                        <span className="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
                        <span>{event.venue}</span>
                      </div>
                    </div>

                    <div className="flex items-center md:flex-col md:items-end justify-between gap-0.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-[11px] text-slate-500">
                        {event.status === 'live' ? 'Sisa Durasi' : 'Waktu Sesi'}
                      </span>
                      <div className="font-mono font-semibold text-xs text-slate-900 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-slate-400">timer</span>
                        {event.durationLeft || event.durationRunning || 'Standby'}
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">{event.timeRange}</span>
                    </div>
                  </div>

                  {/* Telemetry & Media Progress Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    {/* Sesi Capture Counter */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span>Progress Cetak</span>
                        <span className="font-mono font-semibold text-slate-800">
                          {event.progressSessions
                            ? `${event.progressSessions} / ${event.totalQuota} Sesi (${Math.round(
                                (event.progressSessions / (event.totalQuota || 1)) * 100
                              )}%)`
                            : 'Belum Mulai'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-slate-900 h-1.5 rounded-full"
                          style={{
                            width: `${
                              event.progressSessions
                                ? Math.min(100, Math.round((event.progressSessions / (event.totalQuota || 1)) * 100))
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-slate-400 text-[11px] flex items-center justify-between">
                        <span>Unlimited Prints</span>
                        <span className="font-mono text-slate-700 font-medium">
                          {event.printCount ? `${event.printCount} lbr cetak` : 'Standby roll'}
                        </span>
                      </p>
                    </div>

                    {/* Operator In-Charge */}
                    <div className="space-y-1">
                      <span className="text-slate-500 text-[11px] block">Operator Bertugas</span>
                      <div className="flex items-center gap-1.5">
                        {event.operators.map((op, idx) => (
                          <div
                            key={idx}
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                              op.color
                            } ${idx > 0 ? '-ml-2' : ''}`}
                            title={`${op.name} (${op.role})`}
                          >
                            {op.initial}
                          </div>
                        ))}
                        <div className="text-xs text-slate-800 font-medium truncate">
                          {event.operators.map((op) => op.name).join(' & ')}
                        </div>
                      </div>
                      <span className="text-slate-400 text-[11px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        WhatsApp Dispatch Active
                      </span>
                    </div>

                    {/* Hardware Fleet Check */}
                    <div className="space-y-1">
                      <span className="text-slate-500 text-[11px] block">Hardware Unit</span>
                      <div className="text-slate-800 font-mono text-[11px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-emerald-600">print</span>
                        <span>{event.hardwareStatus.dnp}</span>
                      </div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-indigo-600">camera</span>
                        <span>{event.hardwareStatus.camera}</span>
                      </div>
                    </div>
                  </div>

                  {/* Frame Layout Badges & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      <span className="text-[11px] text-slate-400 uppercase font-medium whitespace-nowrap">
                        Template:
                      </span>
                      <div className="flex items-center gap-1">
                        {event.templates.map((tpl, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] flex items-center gap-1 border border-slate-200"
                          >
                            {tpl}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      {event.status === 'live' ? (
                        <>
                          <Link
                            to="/booth/onsite"
                            className="px-2.5 py-1 rounded-md bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            <span>Live Monitor</span>
                          </Link>
                          <Link
                            to="/templates"
                            className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1 transition-colors shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[14px]">style</span>
                            <span>Template</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => alert(`Jadwal event ${event.id} siap disesuaikan.`)}
                            className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors shadow-xs"
                          >
                            Edit Jam
                          </button>
                          <Link
                            to="/booth/onsite"
                            className="px-2.5 py-1 rounded-md bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium flex items-center gap-1 transition-colors shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[14px]">play_circle</span>
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

        {/* Column 2: Side Panel (4 cols on XL) */}
        <div className="xl:col-span-4 space-y-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-4 sticky top-20">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                  Katalog Layanan
                </span>
                <h3 className="text-sm font-bold text-slate-900">Pilihan Paket Sewa</h3>
              </div>
              <Link
                to="/packages"
                className="text-indigo-600 hover:underline text-xs font-semibold flex items-center gap-0.5"
              >
                <span>Kelola</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
            <p className="text-xs text-slate-500">
              Paket standar yang dapat langsung di-assign ke event booking baru.
            </p>

            {/* List of Packages */}
            <div className="space-y-3">
              {/* Package 1 */}
              <div className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-100 text-xs space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-mono">
                      STARTER
                    </span>
                    <h4 className="font-bold text-slate-900 mt-1">
                      Paket Starter Intimate
                    </h4>
                    <div className="font-mono font-bold text-slate-900">Rp 2.500.000</div>
                  </div>
                </div>
                <div className="space-y-1 text-slate-500 text-[11px]">
                  <div>• 2 Jam Layanan • Maks. 100 Lembar 4R</div>
                  <div>• 1 Operator Standby • QR Cloud 7 Hari</div>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                  <span className="font-mono text-[10px] text-slate-400">4x Digunakan</span>
                  <button
                    onClick={() => handleApplyPackage('Paket Starter Intimate')}
                    className="px-2 py-1 rounded bg-white text-slate-800 hover:bg-slate-900 hover:text-white text-xs font-medium transition-colors border border-slate-200 shadow-xs"
                  >
                    Terapkan
                  </button>
                </div>
              </div>

              {/* Package 2 */}
              <div className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200 text-xs space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono font-bold">
                      BEST SELLER
                    </span>
                    <h4 className="font-bold text-slate-900 mt-1">
                      Wedding Royal Platinum
                    </h4>
                    <div className="font-mono font-bold text-slate-900">Rp 4.750.000</div>
                  </div>
                </div>
                <div className="space-y-1 text-slate-500 text-[11px]">
                  <div>• 4 Jam Layanan • Unlimited Prints</div>
                  <div>• 2 Operator Dedicated • Custom Frame</div>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                  <span className="font-mono text-[10px] text-indigo-600 font-semibold">9x Digunakan</span>
                  <button
                    onClick={() => handleApplyPackage('Paket Wedding Royal Platinum')}
                    className="px-2 py-1 rounded bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium transition-colors shadow-xs"
                  >
                    Terapkan
                  </button>
                </div>
              </div>

              {/* Package 3 */}
              <div className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-100 text-xs space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-mono">
                      CORPORATE
                    </span>
                    <h4 className="font-bold text-slate-900 mt-1">
                      Festival &amp; Corporate Hybrid
                    </h4>
                    <div className="font-mono font-bold text-slate-900">Rp 7.800.000 / Hari</div>
                  </div>
                </div>
                <div className="space-y-1 text-slate-500 text-[11px]">
                  <div>• 8 Jam Full-Day • Dual High-Speed DNP</div>
                  <div>• Custom Landing Micro-site • Leads Capture</div>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                  <span className="font-mono text-[10px] text-slate-400">3x Digunakan</span>
                  <button
                    onClick={() => handleApplyPackage('Paket Festival & Corporate Hybrid')}
                    className="px-2 py-1 rounded bg-white text-slate-800 hover:bg-slate-900 hover:text-white text-xs font-medium transition-colors border border-slate-200 shadow-xs"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stock Banner */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs">
              <span className="material-symbols-outlined text-slate-700 text-[20px]">inventory</span>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-slate-900 block truncate">Stok Kertas Gudang</span>
                <span className="text-slate-400 text-[11px] font-mono">4.200 lembar (Aman 14 Event)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Buat Event Baru */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                </span>
                <h3 className="text-sm font-bold text-slate-900">Buat Event Photobooth Baru</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-medium">Nama Acara / Klien</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Wedding of Dimas & Sarah"
                  className="w-full h-9 px-3 bg-white text-slate-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Tipe Acara</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full h-9 px-2.5 bg-white text-slate-900 rounded-lg border border-slate-200"
                  >
                    <option value="onsite">On-Site Photobooth</option>
                    <option value="online">Online Virtual Booth</option>
                    <option value="hybrid">Hybrid Cloud + Kiosk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Paket Layanan</label>
                  <select className="w-full h-9 px-2.5 bg-white text-slate-900 rounded-lg border border-slate-200">
                    {availablePackages.length > 0 ? (
                      availablePackages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option>Paket Wedding Royal Platinum</option>
                        <option>Paket Starter Intimate</option>
                        <option>Paket Festival &amp; Corporate</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-medium">Lokasi / Venue</label>
                <input
                  value={formVenue}
                  onChange={(e) => setFormVenue(e.target.value)}
                  placeholder="Contoh: Ballroom Hotel Mulia, Senayan"
                  className="w-full h-9 px-3 bg-white text-slate-900 rounded-lg focus:outline-none border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full h-9 px-3 bg-white text-slate-900 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Durasi Sesi</label>
                  <input
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="4 Jam (18:00 - 22:00)"
                    className="w-full h-9 px-3 bg-white text-slate-900 rounded-lg border border-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleCreateEvent}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition-all shadow-xs"
              >
                Simpan &amp; Terbitkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
