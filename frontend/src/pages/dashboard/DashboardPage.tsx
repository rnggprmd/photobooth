import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export const DashboardPage: React.FC = () => {
  const { user, tenant } = useAuthStore();
  const [showTelemetryAlert, setShowTelemetryAlert] = useState(true);
  const [eventTab, setEventTab] = useState<'all' | 'onsite' | 'hybrid'>('all');
  const [searchSession, setSearchSession] = useState('');

  // Sample real-time sessions data
  const sessions = [
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
  ];

  const filteredSessions = sessions.filter(
    (s) =>
      s.id.toLowerCase().includes(searchSession.toLowerCase()) ||
      s.event.toLowerCase().includes(searchSession.toLowerCase()) ||
      s.template.toLowerCase().includes(searchSession.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full">
      {/* Operational Alert / Hardware Health Ribbon */}
      {showTelemetryAlert && (
        <div className="mb-space-lg p-space-sm rounded-xl bg-surface-container-high shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm border border-outline-variant/30">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-tertiary shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">sensors</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-space-sm gap-y-0.5">
              <span className="font-label-md text-label-md text-on-surface font-semibold">Hardware Telemetry:</span>
              <div className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
                <span>Kiosk Terminal 01 (Pullman Jakarta)</span>
                <span className="text-outline-variant">•</span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface font-mono-data text-body-sm font-medium border border-outline-variant/20">
                  Kertas 4R: Sisa 38 Lembar
                </span>
                <span className="text-outline-variant">•</span>
                <span className="text-secondary font-medium">DNP Ribbon Tinta OK (92%)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-space-xs self-end md:self-center">
            <Link
              to="/settings"
              className="px-space-xs py-1 rounded-lg bg-surface-container-lowest text-on-surface font-label-sm text-label-sm hover:bg-surface transition-colors shadow-sm border border-outline-variant/20"
            >
              Detail Hardware
            </Link>
            <button
              onClick={() => setShowTelemetryAlert(false)}
              className="w-6 h-6 rounded flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
              title="Tutup Alert"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Header Section & Operational Status Overview */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-lg mb-space-xl">
        <div className="space-y-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold tracking-wide uppercase">
              Multi-Tenant Core
            </span>
            <span className="text-outline">•</span>
            <span className="font-mono-data text-body-sm text-on-surface-variant">Tenant #ID-8821</span>
          </div>
          <h1 className="font-display text-display text-on-surface tracking-tight font-semibold">
            Selamat Pagi, {user?.name || 'Studio Admin'}
          </h1>
          <div className="flex flex-wrap items-center gap-y-space-xs gap-x-space-md pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="font-label-md text-label-md text-on-surface font-medium">
                {tenant?.name || 'Lumina Photostudio Bali'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[16px] text-tertiary">event_available</span>
              <span>2 Event Berlangsung Hari Ini</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[16px] text-primary">desktop_windows</span>
              <span>On-Site Booth: 3 Terminal Aktif</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[16px] text-secondary">wifi_tethering</span>
              <span>Online Booth: Aktif (Web Link Terbuka)</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Group */}
        <div className="flex flex-wrap items-center gap-space-xs">
          <Link
            to="/templates"
            className="px-space-md py-2 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm hover:bg-surface-container-low transition-all flex items-center gap-1.5 border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">add_photo_alternate</span>
            <span>+ Upload Template Baru</span>
          </Link>
          <Link
            to="/booth/onsite"
            className="px-space-md py-2 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm hover:bg-surface-container-low transition-all flex items-center gap-1.5 border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">terminal</span>
            <span>Buka Kiosk On-Site</span>
          </Link>
          <Link
            to="/events"
            className="px-space-md py-2 rounded-xl bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Buat Event Baru</span>
          </Link>
        </div>
      </div>

      {/* KPI / Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-space-md mb-space-xl">
        {/* Metric 1 */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Total Sesi Bulan Ini
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">photo_camera_front</span>
            </div>
          </div>
          <div className="my-space-xs">
            <div className="font-headline-lg text-headline-lg text-on-surface font-mono-data tracking-tight font-semibold">
              1,428
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px] text-tertiary font-semibold">trending_up</span>
              <span className="font-label-sm text-label-sm text-tertiary font-semibold">+18.4%</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">vs bulan lalu</span>
            </div>
          </div>
          <div className="mt-space-xs pt-space-xs bg-surface-container-low/50 rounded-lg p-1.5 flex items-center justify-between border border-outline-variant/10">
            <span className="font-label-sm text-label-sm text-on-surface font-medium">82% Kuota</span>
            <span className="font-mono-data text-body-sm text-on-surface-variant">2,000 Maks</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Event Aktif & Terjadwal
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">event_seat</span>
            </div>
          </div>
          <div className="my-space-xs">
            <div className="font-headline-lg text-headline-lg text-on-surface font-mono-data tracking-tight font-semibold">
              14 <span className="font-headline-sm text-headline-sm text-on-surface-variant font-normal">Event</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-primary-container"></span>
              <span className="font-label-sm text-label-sm text-on-surface font-medium">3 Live Hari Ini</span>
              <span className="text-outline-variant">•</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">11 Terjadwal</span>
            </div>
          </div>
          <div className="mt-space-xs pt-space-xs flex items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            <span className="font-label-sm text-label-sm">Peak: Sabtu & Minggu Ini</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Pendapatan Sewa & Paket
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-tertiary flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
          </div>
          <div className="my-space-xs">
            <div className="font-headline-lg text-headline-lg text-on-surface font-mono-data tracking-tight leading-none font-semibold">
              Rp 42.85M
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                94% Lunas
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Bulan Berjalan</span>
            </div>
          </div>
          <div className="mt-space-xs pt-space-xs flex items-center justify-between font-mono-data text-body-sm text-on-surface-variant">
            <span>Invoice Selesai</span>
            <span className="font-medium text-on-surface">32 / 34</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Output Foto & Print
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">burst_mode</span>
            </div>
          </div>
          <div className="my-space-xs">
            <div className="font-headline-lg text-headline-lg text-on-surface font-mono-data tracking-tight font-semibold">
              4,896
            </div>
            <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mt-1">
              <span>QR Download: <strong className="text-on-surface font-medium">91.2%</strong></span>
              <span>Print: <strong className="text-on-surface font-medium">98.7%</strong></span>
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-space-xs">
            <div className="bg-primary-container h-full rounded-full" style={{ width: '94%' }}></div>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Penyimpanan Cloud
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-outline flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">cloud_queue</span>
            </div>
          </div>
          <div className="my-space-xs">
            <div className="flex items-baseline gap-1 font-mono-data">
              <span className="font-headline-lg text-headline-lg text-on-surface font-semibold">14.2</span>
              <span className="font-body-md text-body-md text-on-surface-variant">/ 25 GB</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">AWS S3 Jakarta Region</span>
          </div>
          <div className="mt-space-xs">
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-tertiary-container h-full rounded-full" style={{ width: '56.8%' }}></div>
            </div>
            <div className="flex justify-between items-center mt-1 font-mono-data text-body-sm text-on-surface-variant">
              <span>56.8% Terpakai</span>
              <span className="text-tertiary font-medium">Sehat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Monitoring & Popular Templates Mosaic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg mb-space-xl">
        {/* Left Column: Live Event & Kiosk Fleet (2 Cols Span) */}
        <div className="lg:col-span-2 space-y-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-ping"></span>
              <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-semibold">
                Live Event & Kiosk Telemetry
              </h2>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30">
              <button
                onClick={() => setEventTab('all')}
                className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm transition-all ${
                  eventTab === 'all'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Semua (3)
              </button>
              <button
                onClick={() => setEventTab('onsite')}
                className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm transition-all ${
                  eventTab === 'onsite'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                On-Site (2)
              </button>
              <button
                onClick={() => setEventTab('hybrid')}
                className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm transition-all ${
                  eventTab === 'hybrid'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Hybrid (1)
              </button>
            </div>
          </div>

          {/* Live Cards Container */}
          <div className="space-y-space-sm">
            {/* Live Card 1: Pullman Wedding */}
            {(eventTab === 'all' || eventTab === 'onsite') && (
              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-xs mb-space-xs gap-space-xs border-b border-surface-container-high/60">
                  <div className="flex items-center gap-space-xs">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-mono-data text-body-sm font-semibold">
                      EV-2026-091
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      Sedang Berlangsung
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm border border-outline-variant/20">
                      Mode: On-Site
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-mono-data text-body-sm text-on-surface-variant">Sync: 12 dtk lalu</span>
                    <button className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high">
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md my-space-xs items-center">
                  <div className="md:col-span-2">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-0.5">
                      Wedding of Kevin & Astrid
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      Ballroom 2, Pullman Jakarta Central Park
                    </p>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-space-md mt-space-xs font-body-sm text-body-sm text-on-surface-variant">
                      <span>Operator: <strong className="text-on-surface font-medium">Rian & Siti</strong></span>
                      <span>Hardware: <strong className="text-on-surface font-medium">2 Kiosk (TS-A & TS-B)</strong></span>
                      <span>
                        Template:{' '}
                        <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-mono-data text-body-sm">
                          4R Floral Gold
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Progress Telemetry */}
                  <div className="p-space-xs rounded-xl bg-surface-container-low flex flex-col justify-between border border-outline-variant/20">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Progress Sesi</span>
                      <span className="font-mono-data text-label-md text-on-surface font-semibold">184 / 200</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden mb-1.5">
                      <div className="bg-primary-container h-full rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <div className="flex justify-between text-body-sm font-body-sm text-on-surface-variant">
                      <span>92% Quota Event</span>
                      <span className="text-primary font-medium">16 Sisa</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-space-xs mt-space-xs bg-surface-container-lowest border-t border-surface-container-high/40">
                  <div className="flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">print</span>
                      DNP DS620: Ready
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">photo_camera</span>
                      Canon R100: Connected
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <button className="px-space-xs py-1 rounded-lg bg-surface-container-high text-on-surface font-label-sm text-label-sm hover:bg-surface-container-highest transition-colors">
                      Kirim Notifikasi Operator
                    </button>
                    <Link
                      to="/booth/onsite"
                      className="px-space-xs py-1 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm hover:bg-primary transition-colors flex items-center gap-1"
                    >
                      <span>Live Feed Kiosk</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Live Card 2: Tech Summit Afterparty */}
            {(eventTab === 'all' || eventTab === 'hybrid') && (
              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-xs mb-space-xs gap-space-xs border-b border-surface-container-high/60">
                  <div className="flex items-center gap-space-xs">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-mono-data text-body-sm font-semibold">
                      EV-2026-092
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      Live Hybrid
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-medium">
                      Hybrid QR + Kiosk
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-mono-data text-body-sm text-on-surface-variant">Sync: 45 dtk lalu</span>
                    <button className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high">
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md my-space-xs items-center">
                  <div className="md:col-span-2">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-0.5">
                      Tech Summit Afterparty 2026
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      ICE BSD Hall 3, Tangerang & Web Link Live
                    </p>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-space-md mt-space-xs font-body-sm text-body-sm text-on-surface-variant">
                      <span>Operator: <strong className="text-on-surface font-medium">Dimas Tri</strong></span>
                      <span>Hardware: <strong className="text-on-surface font-medium">1 Kiosk Booth + Web App</strong></span>
                      <span>
                        Template:{' '}
                        <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-mono-data text-body-sm">
                          Cyber Glitch 2R Strip
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Progress Telemetry */}
                  <div className="p-space-xs rounded-xl bg-surface-container-low flex flex-col justify-between border border-outline-variant/20">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Total Sesi Terekam</span>
                      <span className="font-mono-data text-label-md text-on-surface font-semibold">312 Sesi</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden mb-1.5">
                      <div className="bg-tertiary-container h-full rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <div className="flex justify-between text-body-sm font-body-sm text-on-surface-variant">
                      <span>Unlimited Package</span>
                      <span className="text-tertiary font-medium">QR Dominan (64%)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-space-xs mt-space-xs bg-surface-container-lowest border-t border-surface-container-high/40">
                  <div className="flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">qr_code_2</span>
                      Web Portal: lumina.snap/ts26
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">flash_on</span>
                      Auto-AI BG Removal: Aktif
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <button className="px-space-xs py-1 rounded-lg bg-surface-container-high text-on-surface font-label-sm text-label-sm hover:bg-surface-container-highest transition-colors">
                      Salin QR Landing
                    </button>
                    <Link
                      to="/events"
                      className="px-space-xs py-1 rounded-lg bg-surface-container-lowest text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high transition-colors shadow-sm border border-outline-variant/20"
                    >
                      Kelola Event
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Live Card 3: Sweet 17th Birthday Celebration */}
            {(eventTab === 'all' || eventTab === 'onsite') && (
              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm opacity-95 border border-outline-variant/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-xs mb-space-xs gap-space-xs border-b border-surface-container-high/60">
                  <div className="flex items-center gap-space-xs">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-mono-data text-body-sm font-semibold">
                      EV-2026-093
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                      Terjadwal Hari Ini
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm border border-outline-variant/20">
                      Mulai 18:30 WIB
                    </span>
                  </div>
                  <span className="font-mono-data text-body-sm text-on-surface-variant">Persiapan Standby: 2 Jam lagi</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Sweet 17th Birthday Celebration (Clara)
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      The Glass House, Dharmawangsa Jakarta • Operator: Fauzan • Template: Pastel Minimalist 4R
                    </p>
                  </div>
                  <div className="mt-space-xs sm:mt-0 flex gap-space-xs">
                    <button className="px-space-xs py-1 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high border border-outline-variant/20">
                      Checklist Hardware
                    </button>
                    <button className="px-space-xs py-1 rounded-lg bg-surface-container-high text-on-surface font-label-sm text-label-sm hover:bg-surface-container-highest">
                      Buka Pre-Session
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Popular Templates & Visual Previews */}
        <div className="space-y-space-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-semibold">
              Template Terpopuler
            </h2>
            <Link to="/templates" className="font-label-sm text-label-sm text-primary hover:underline flex items-center gap-0.5">
              <span>Semua Galeri</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm space-y-space-md border border-outline-variant/20">
            {/* Item 1: Classic 4R Strip */}
            <div className="p-space-xs rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low transition-colors border border-outline-variant/15">
              <div className="flex items-start gap-space-sm">
                <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container shadow-sm relative group">
                  <img
                    className="w-full h-full object-cover"
                    alt="Classic 4R Strip Vertical"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs2uSCA_1x4egT-SWZhe80JHNnZtQf_RWXoZP9HFCIZSnvDBE0wCW_2GExbQU9cvJ3o5K7MAHq0osFLPXxDfMlacpRHG_6T3YmiIDGOcVbJkPACrm8FDvEmTZQiJgwzFe-UElfHdSmaY8qdpQiKhN_4MkU8UkbIiB0gOLDnNz6SRO68OqdgpG7mBMBpAlM7xjQRAaNKCD-gTzAGuXzATSBV0YArRZbDBZF8zkQEWN0OV8HrdOtMZk"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="material-symbols-outlined text-white text-[16px]">visibility</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface font-mono-data text-body-sm font-semibold border border-outline-variant/20">
                      4R Strip
                    </span>
                    <span className="font-mono-data text-label-md text-primary font-semibold">640 Sesi</span>
                  </div>
                  <h4 className="font-label-md text-label-md text-on-surface font-semibold truncate mt-0.5">
                    Classic 4R Strip Vertical
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">3 Slots • Portrait • Auto Cut Ready</p>
                  <div className="mt-1.5 flex items-center gap-space-xs">
                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      Wedding
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      Formal
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Item 2: 2R Dual Bookmark */}
            <div className="p-space-xs rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low transition-colors border border-outline-variant/15">
              <div className="flex items-start gap-space-sm">
                <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container shadow-sm relative group">
                  <img
                    className="w-full h-full object-cover"
                    alt="2R Dual Photo Bookmark"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn6RypqRpe0zNin65jrmHHkTekkXH95Lm84ZrjQMK6gMlaTpCzgFzqBF3gFm9ydHNCPZ5x_mYQvVaz9lS-LOQEPF5ZN4iNIYPVQOCSOHoxbLgtKNh_opFW2xnKtVjw2LTbYs1GI9IkArkTMWbSons0k4o6kAnEbHYWiNEwSsBj9f1BGzT0Mm5Bh-lEwfMOuERXqqtIH_3DZmrUNIVBaiv7KbImFkkm7kXiGQPgsOf2PHqbBo01Hpk"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="material-symbols-outlined text-white text-[16px]">visibility</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface font-mono-data text-body-sm font-semibold border border-outline-variant/20">
                      2R Bookmark
                    </span>
                    <span className="font-mono-data text-label-md text-primary font-semibold">480 Sesi</span>
                  </div>
                  <h4 className="font-label-md text-label-md text-on-surface font-semibold truncate mt-0.5">
                    2R Dual Photo Bookmark
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">2 Slots • Bookmark Format • Double Print</p>
                  <div className="mt-1.5 flex items-center gap-space-xs">
                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      Birthday
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      Graduation
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Item 3: Modern Minimalist Polar */}
            <div className="p-space-xs rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low transition-colors border border-outline-variant/15">
              <div className="flex items-start gap-space-sm">
                <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container shadow-sm relative group">
                  <img
                    className="w-full h-full object-cover"
                    alt="Modern Minimalist Polar"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpAGZtOm17wycIerHTgdH7FyM51LWNir4jFGBcscgziwxz8mPhX5A1orXqA4lpyNw7FlELsq2PoK5fmuN7nwn85kKUGo90O_j0viK9-M8gqZQp5rLbsLInNNW3omOe3SGnUE9JhtgC7m0r_I2s3ei7YjUnNFitT4IQwwz8emca1-GDZhhXgI8cCuU3xB0j4BeVPvUimJ7Asli0OeckdS3GlZA79EADV4KqpxxU_vyE5bMafJ3EY20"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="material-symbols-outlined text-white text-[16px]">visibility</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface font-mono-data text-body-sm font-semibold border border-outline-variant/20">
                      4R Grid
                    </span>
                    <span className="font-mono-data text-label-md text-primary font-semibold">308 Sesi</span>
                  </div>
                  <h4 className="font-label-md text-label-md text-on-surface font-semibold truncate mt-0.5">
                    Modern Minimalist Polar
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">4 Slots Grid • Custom Overlay Text</p>
                  <div className="mt-1.5 flex items-center gap-space-xs">
                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      Corporate
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      Festival
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Slot Allocation Banner */}
            <div className="p-space-sm rounded-xl bg-secondary-container/40 flex items-center justify-between border border-secondary-container">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-on-secondary-fixed text-[18px]">auto_awesome</span>
                <span className="font-label-sm text-label-sm text-on-secondary-fixed font-medium">Auto-Layout Generator Siap</span>
              </div>
              <Link to="/templates" className="font-label-sm text-label-sm text-primary font-semibold hover:underline">
                Coba Buat
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Photo Sessions Log Table */}
      <div className="flex flex-col space-y-space-md mb-space-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs">
            <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-semibold">
              Log Sesi & Real-Time Capture Stream
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-mono-data text-body-sm font-semibold border border-outline-variant/30">
              Live Socket On
            </span>
          </div>

          {/* Table Filters & Search */}
          <div className="flex flex-wrap items-center gap-space-xs">
            <div className="flex items-center bg-surface-container-lowest px-2.5 py-1.5 rounded-xl shadow-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-outline text-[16px] mr-2">search</span>
              <input
                value={searchSession}
                onChange={(e) => setSearchSession(e.target.value)}
                className="bg-transparent text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm focus:outline-none w-48"
                placeholder="Cari Sesi ID, Tamu, Event..."
                type="text"
              />
            </div>
            <select className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm focus:outline-none border border-outline-variant/30">
              <option>Semua Event</option>
              <option>Wedding Kevin & Astrid</option>
              <option>Tech Summit 2026</option>
            </select>
            <button className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm shadow-sm flex items-center gap-1 border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Filter</span>
            </button>
            <button className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm hover:bg-surface-container-low flex items-center gap-1 border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* The Data Table */}
        <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden border border-outline-variant/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-surface-container-high">
                  <th className="py-3 px-space-md font-semibold">ID Sesi</th>
                  <th className="py-3 px-space-md font-semibold">Waktu Sesi</th>
                  <th className="py-3 px-space-md font-semibold">Event Studio</th>
                  <th className="py-3 px-space-md font-semibold">Mode Terminal</th>
                  <th className="py-3 px-space-md font-semibold">Template</th>
                  <th className="py-3 px-space-md font-semibold">Captures</th>
                  <th className="py-3 px-space-md font-semibold">Output & Delivery</th>
                  <th className="py-3 px-space-md font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low font-body-md text-body-md text-on-surface">
                {filteredSessions.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3 px-space-md font-mono-data text-body-sm font-semibold text-primary">
                      {row.id}
                    </td>
                    <td className="py-3 px-space-md font-mono-data text-body-sm text-on-surface-variant">
                      {row.time}
                    </td>
                    <td className="py-3 px-space-md">
                      <span className="font-medium text-on-surface block">{row.event}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{row.location}</span>
                    </td>
                    <td className="py-3 px-space-md">
                      {row.modeType === 'onsite' ? (
                        <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          {row.mode}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-semibold inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          {row.mode}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-space-md font-body-sm text-body-sm">
                      <span className="font-medium">{row.template}</span>
                      <span className="text-on-surface-variant block">{row.templateDetail}</span>
                    </td>
                    <td className="py-3 px-space-md font-mono-data text-body-sm">{row.captures}</td>
                    <td className="py-3 px-space-md">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-tertiary">
                            {row.printed.includes('Cloud') ? 'cloud_done' : 'print'}
                          </span>
                          {row.printed}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-primary">
                            {row.delivery.includes('Saved') ? 'download' : 'qr_code'}
                          </span>
                          {row.delivery}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-space-md text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to="/gallery"
                          className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                          title="Lihat Hasil Foto"
                        >
                          <span className="material-symbols-outlined text-[18px]">photo_library</span>
                        </Link>
                        <Link
                          to="/results/RESULT-LUMINA-DEMO-001"
                          className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                          title="Salin QR Link"
                        >
                          <span className="material-symbols-outlined text-[18px]">link</span>
                        </Link>
                        <button
                          className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                          title="Cetak Ulang"
                        >
                          <span className="material-symbols-outlined text-[18px]">print</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Bar */}
          <div className="px-space-md py-space-sm bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-xs font-body-sm text-body-sm text-on-surface-variant border-t border-surface-container-high">
            <div className="flex items-center gap-2">
              <span>Menampilkan 1-4 dari 1,428 Sesi</span>
              <span className="text-outline-variant">•</span>
              <span className="font-mono-data">WebSocket: Latency 24ms</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface hover:bg-surface shadow-sm disabled:opacity-50 border border-outline-variant/30" disabled>
                Sebelumnya
              </button>
              <span className="px-2 py-1 font-mono-data text-on-surface font-semibold">1</span>
              <button className="px-2 py-1 hover:bg-surface-container rounded">2</button>
              <button className="px-2 py-1 hover:bg-surface-container rounded">3</button>
              <span className="px-1">...</span>
              <button className="px-2 py-1 hover:bg-surface-container rounded">72</button>
              <button className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface hover:bg-surface shadow-sm border border-outline-variant/30">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Tenant Bottom Quick Status & Hardware Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-lg">
        {/* Hardware Status 1 */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center gap-space-md hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">print_connect</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">
                DNP DS620 Fleet Status
              </h4>
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">3 Printer Siap • 0 Antrean Error</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface font-label-sm text-label-sm font-medium border border-outline-variant/20">
                Thermal Head: Optimal (32°C)
              </span>
            </div>
          </div>
        </div>

        {/* Hardware Status 2 */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center gap-space-md hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-tertiary flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">camera</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">
                Canon EDSDK Connection
              </h4>
              <span className="w-2 h-2 rounded-full bg-tertiary-container flex-shrink-0"></span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">2 EOS R100 • 1 EOS 200D II</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface font-label-sm text-label-sm font-medium border border-outline-variant/20">
                LiveView Stream: 60 FPS Stable
              </span>
            </div>
          </div>
        </div>

        {/* Hardware Status 3 */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center gap-space-md hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="w-12 h-12 rounded-xl bg-secondary-container/40 flex items-center justify-center text-on-secondary-fixed flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">
                Paket Pro Studio Tenant
              </h4>
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Aktif s/d 14 November 2026</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-medium">
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
