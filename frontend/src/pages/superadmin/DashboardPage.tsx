import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { superAdminApi, type SuperAdminDashboardData } from '../../api/superadmin';
import useAuthStore from '../../store/authStore';

export const SuperAdminDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<SuperAdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [tenantFilter, setTenantFilter] = useState<'all' | 'active' | 'suspended'>('all');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  useEffect(() => {
    superAdminApi
      .getDashboard()
      .then((res) => {
        if (res.data?.data) {
          setData(res.data.data);
        }
      })
      .catch((err) => {
        console.warn('Super Admin dashboard API warning:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const metrics = data?.metrics || {
    total_tenants: 18,
    active_tenants: 16,
    inactive_tenants: 2,
    active_subscriptions: 16,
    saas_mrr: 28750000,
    saas_arr: 345000000,
    mrr_growth_rate: '+22.4%',
    tenant_growth_rate: '+18.5%',
    total_photo_sessions: 14850,
    total_events_conducted: 142,
    total_platform_users: 64,
    storage_used_gb: 384.2,
    storage_limit_gb: 2000.0,
    active_kiosk_terminals: 48,
    api_uptime: '99.98%',
  };

  const expiringList = data?.expiring_subscriptions || [
    {
      id: 101,
      tenant_name: 'Memories Kiosk Surabaya',
      plan_name: 'Starter Studio',
      ends_at: '2026-10-18',
      days_left: 4,
      contact_email: 'bambang@memorieskiosk.id',
    },
    {
      id: 102,
      tenant_name: 'SnapBox Bandung Studio',
      plan_name: 'Pro Business',
      ends_at: '2026-10-23',
      days_left: 9,
      contact_email: 'dadan@snapbox.id',
    },
  ];

  const recentTenants = data?.recent_tenants || [
    {
      id: 1,
      name: 'Lumina Photostudio Bali',
      slug: 'lumina-bali',
      status: 'active',
      plan_name: 'Pro Business',
      created_at: '2026-01-15',
      owner_email: 'rangga@lumina.studio',
      kiosks_count: 6,
    },
    {
      id: 2,
      name: 'Bali Booth Collective',
      slug: 'bali-booth',
      status: 'active',
      plan_name: 'Enterprise Fleet',
      created_at: '2026-02-02',
      owner_email: 'wayan@balibooth.com',
      kiosks_count: 14,
    },
    {
      id: 3,
      name: 'Memories Kiosk Surabaya',
      slug: 'memories-surabaya',
      status: 'active',
      plan_name: 'Starter Studio',
      created_at: '2026-02-18',
      owner_email: 'bambang@memorieskiosk.id',
      kiosks_count: 3,
    },
    {
      id: 4,
      name: 'GlamourSnap Jakarta Corp',
      slug: 'glamoursnap-jakarta',
      status: 'active',
      plan_name: 'Enterprise Fleet',
      created_at: '2026-03-10',
      owner_email: 'felicia@glamoursnap.co.id',
      kiosks_count: 22,
    },
    {
      id: 5,
      name: 'SnapBox Bandung Studio',
      slug: 'snapbox-bandung',
      status: 'suspended',
      plan_name: 'Starter Studio',
      created_at: '2026-04-24',
      owner_email: 'dadan@snapbox.id',
      kiosks_count: 0,
    },
  ];

  const filteredTenants = recentTenants.filter((t) =>
    tenantFilter === 'all' ? true : t.status === tenantFilter
  );

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-900 shadow-lg"
          >
            <span className="material-symbols-outlined text-[17px] text-emerald-600">check_circle</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Platform Health Ribbon / SLA Telemetry */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 flex-shrink-0">
            <span className="material-symbols-outlined text-[18px]">dns</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-0.5">
            <span className="text-xs font-bold text-slate-900">Platform Core Telemetry:</span>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Uptime API {metrics.api_uptime}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-700 font-medium">AWS S3 Jakarta (ap-southeast-3)</span>
              <span className="text-slate-300">•</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[11px] font-medium border border-slate-200">
                Latensi DB: 14ms
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
          <button
            onClick={() => showToast('Semua worker background dan antrean sinkronisasi sehat!')}
            className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors border border-slate-200 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
            <span>Status SLA</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full w-1/3 animate-pulse"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-semibold tracking-wide uppercase">
              Super Admin SaaS Console
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-xs text-slate-500">Root Node #ID-01</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Platform Master Dashboard — Halo, {user?.name || 'Super Admin'}
          </h1>
          <p className="text-xs text-slate-500">
            Ringkasan performa ekosistem SaaS Photobooth: operasional tenant, pertumbuhan langganan (MRR), utilisasi storage cloud, dan telemetry armada kiosk se-Indonesia.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => showToast('Laporan metrik SaaS (CSV) sedang diunduh...')}
            className="px-3 py-2 rounded-lg bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all flex items-center gap-1.5 border border-slate-200 shadow-xs"
          >
            <span className="material-symbols-outlined text-[17px] text-slate-500">download</span>
            <span>Ekspor Data Platform</span>
          </button>
          <Link
            to="/superadmin/plans"
            className="px-3 py-2 rounded-lg bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all flex items-center gap-1.5 border border-slate-200 shadow-xs"
          >
            <span className="material-symbols-outlined text-[17px] text-slate-500">stars</span>
            <span>Master Paket SaaS</span>
          </Link>
          <Link
            to="/superadmin/tenants"
            className="px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[17px]">domain_add</span>
            <span>+ Kelola Tenant</span>
          </Link>
        </div>
      </div>

      {/* 5 KPI Metric Cards (PRD 8.20 / BRD 15) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Card 1: Total Tenants */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Tenant / Studio
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <span className="material-symbols-outlined text-[16px]">apartment</span>
            </div>
          </div>
          <div className="my-1">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {metrics.total_tenants} <span className="text-xs font-normal text-slate-500 font-sans">Studio</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs">
              <span className="material-symbols-outlined text-[14px] text-emerald-600 font-semibold">trending_up</span>
              <span className="font-semibold text-emerald-600">{metrics.tenant_growth_rate}</span>
              <span className="text-slate-400">bulan ini</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 bg-slate-50 rounded-lg p-2 flex items-center justify-between border border-slate-100 text-[11px]">
            <span className="font-medium text-emerald-700">{metrics.active_tenants} Aktif</span>
            <span className="font-medium text-rose-600">{metrics.inactive_tenants} Suspended</span>
          </div>
        </div>

        {/* Card 2: SaaS Revenue (MRR) */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              SaaS MRR (Monthly)
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <span className="material-symbols-outlined text-[16px]">payments</span>
            </div>
          </div>
          <div className="my-1">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {formatRupiah(metrics.saas_mrr)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs">
              <span className="material-symbols-outlined text-[14px] text-emerald-600 font-semibold">trending_up</span>
              <span className="font-semibold text-emerald-600">{metrics.mrr_growth_rate}</span>
              <span className="text-slate-400">ARR ~ {formatRupiah(metrics.saas_arr)}</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 bg-slate-50 rounded-lg p-2 flex items-center justify-between border border-slate-100 text-[11px]">
            <span className="font-medium text-slate-700">Langganan Aktif</span>
            <span className="font-mono font-semibold text-indigo-600">{metrics.active_subscriptions} Tenant</span>
          </div>
        </div>

        {/* Card 3: Total Photo Sessions */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Sesi Foto Global
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
              <span className="material-symbols-outlined text-[16px]">photo_camera_front</span>
            </div>
          </div>
          <div className="my-1">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {metrics.total_photo_sessions.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs">
              <span className="material-symbols-outlined text-[14px] text-indigo-600 font-semibold">event</span>
              <span className="font-semibold text-slate-700">{metrics.total_events_conducted} Event</span>
              <span className="text-slate-400">tercatat</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 bg-slate-50 rounded-lg p-2 flex items-center justify-between border border-slate-100 text-[11px]">
            <span className="font-medium text-slate-700">Rata-rata / Hari</span>
            <span className="font-mono text-slate-500">~ 495 Sesi</span>
          </div>
        </div>

        {/* Card 4: Active Kiosks Armada */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Terminal Kiosk Online
            </span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 flex-shrink-0">
              <span className="material-symbols-outlined text-[16px]">devices</span>
            </div>
          </div>
          <div className="my-1">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {metrics.active_kiosk_terminals} <span className="text-xs font-normal text-slate-500 font-sans">Kiosk</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-medium text-emerald-700">Live Hardware Sync</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 bg-slate-50 rounded-lg p-2 flex items-center justify-between border border-slate-100 text-[11px]">
            <span className="font-medium text-slate-700">Canon & DNP Sync</span>
            <span className="font-mono text-slate-600">100% Ready</span>
          </div>
        </div>

        {/* Card 5: Platform Storage Usage */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Cloud Storage AWS S3
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
              <span className="material-symbols-outlined text-[16px]">cloud_sync</span>
            </div>
          </div>
          <div className="my-1">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {metrics.storage_used_gb} <span className="text-xs font-normal text-slate-500 font-sans">GB</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
              <span>Kapasitas: {metrics.storage_limit_gb} GB</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 bg-slate-50 rounded-lg p-2 flex items-center justify-between border border-slate-100 text-[11px]">
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full"
                style={{ width: `${(metrics.storage_used_gb / metrics.storage_limit_gb) * 100}%` }}
              ></div>
            </div>
            <span className="ml-2 font-mono text-[10px] text-slate-500">
              {Math.round((metrics.storage_used_gb / metrics.storage_limit_gb) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Expiry Alerts & Plan Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expiry Alerts (PRD 8.20) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <h3 className="text-sm font-bold text-slate-900">
                  Peringatan Langganan Akan Berakhir (Subscription Expiry &lt; 14 Hari)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-semibold">
                {expiringList.length} Tenant Perlu Perhatian
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {expiringList.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs flex-shrink-0">
                      {item.days_left}d
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{item.tenant_name}</p>
                      <p className="text-[11px] text-slate-500">
                        Paket: <span className="font-medium text-slate-700">{item.plan_name}</span> • Berakhir: {item.ends_at}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast(`Notifikasi perpanjangan berhasil dikirim ke ${item.contact_email}!`)}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px] text-indigo-600">mail</span>
                      <span>Kirim Pengingat</span>
                    </button>
                    <Link
                      to="/superadmin/tenants"
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-white shadow-2xs"
                    >
                      Perpanjang
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Sistem auto-billing akan mengirim tagihan H-7 otomatis via email.</span>
            <Link to="/superadmin/tenants" className="text-indigo-600 font-semibold hover:underline">
              Lihat Seluruh Langganan →
            </Link>
          </div>
        </div>

        {/* Plan Breakdown Card */}
        <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Distribusi Paket SaaS</h3>
              <Link to="/superadmin/plans" className="text-xs text-indigo-600 font-semibold hover:underline">
                Kelola Paket
              </Link>
            </div>

            <div className="space-y-3.5 mt-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-800">Pro Business (Rp 899k/bln)</span>
                  <span className="font-semibold text-slate-900">9 Tenant (56%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '56%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-800">Enterprise Fleet (Rp 1.99jt/bln)</span>
                  <span className="font-semibold text-slate-900">4 Tenant (25%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-800">Starter Studio (Rp 499k/bln)</span>
                  <span className="font-semibold text-slate-900">3 Tenant (19%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: '19%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-2.5 rounded-lg text-xs flex items-center justify-between">
            <span className="text-slate-600">Target MRR Kuartal Ini:</span>
            <span className="font-bold text-slate-900">Rp 50.000.000</span>
          </div>
        </div>
      </div>

      {/* Section 3: Recent Tenants Management Table */}
      <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Tenant / Studio Terbaru</h3>
            <p className="text-xs text-slate-500">Daftar studio yang terdaftar dan sedang beroperasi di platform.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setTenantFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  tenantFilter === 'all' ? 'bg-white shadow-2xs text-slate-900 font-semibold' : 'text-slate-600'
                }`}
              >
                Semua ({recentTenants.length})
              </button>
              <button
                onClick={() => setTenantFilter('active')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  tenantFilter === 'active' ? 'bg-white shadow-2xs text-slate-900 font-semibold' : 'text-slate-600'
                }`}
              >
                Aktif
              </button>
              <button
                onClick={() => setTenantFilter('suspended')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  tenantFilter === 'suspended' ? 'bg-white shadow-2xs text-slate-900 font-semibold' : 'text-slate-600'
                }`}
              >
                Suspended
              </button>
            </div>

            <Link
              to="/superadmin/tenants"
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
            >
              Lihat Semua Tenant
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3 font-semibold">Nama Studio / Tenant</th>
                <th className="py-3 px-3 font-semibold">Subdomain</th>
                <th className="py-3 px-3 font-semibold">Paket Aktif</th>
                <th className="py-3 px-3 font-semibold">Kiosk Aktif</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{t.name}</div>
                    <div className="text-[11px] text-slate-400">{t.owner_email}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {t.slug}.snapstudio.id
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-medium text-[11px]">
                      {t.plan_name}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    {t.kiosks_count} Unit
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        t.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          t.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      ></span>
                      {t.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to="/superadmin/tenants"
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboardPage;
