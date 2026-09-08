import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export const AppLayout: React.FC = () => {
  const { user, tenant, clearAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate('/auth/login');
  };

  const navGroups = [
    {
      title: 'Utama',
      items: [
        { label: 'Dashboard', path: '/', icon: 'space_dashboard' },
        { label: 'Ringkasan Operasional', path: '/reports', icon: 'insights' },
      ],
    },
    {
      title: 'Manajemen Bisnis',
      items: [
        { label: 'Event & Jadwal', path: '/events', icon: 'calendar_month' },
        { label: 'Paket Layanan', path: '/packages', icon: 'loyalty' },
        { label: 'Template & Frame Studio', path: '/templates', icon: 'crop_portrait' },
        { label: 'Kelola Operator & Tamu', path: '/customers', icon: 'badge' },
      ],
    },
    {
      title: 'Sesi & Galeri',
      items: [
        { label: 'Sesi Photobooth Aktif', path: '/sessions', icon: 'live_tv' },
        { label: 'Galeri Foto & QR', path: '/gallery', icon: 'qr_code_scanner' },
        { label: 'Cetak & Hardware', path: '/settings?tab=hardware', icon: 'print' },
      ],
    },
    {
      title: 'Finansial & Akun',
      items: [
        { label: 'Transaksi & Invoice', path: '/transactions', icon: 'receipt_long' },
        { label: 'Paket Langganan SaaS', path: '/superadmin/plans', icon: 'stars' },
        { label: 'Pengaturan Tenant', path: '/settings?tab=tenant', icon: 'settings' },
      ],
    },
  ];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* Fixed Left Navigation Rail */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white z-50 flex flex-col border-r border-slate-200 shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm tracking-tight text-slate-900 font-bold leading-none">SnapStudio</span>
              <span className="text-[11px] text-slate-400 font-mono tracking-tight mt-0.5">Enterprise Booth v2.4</span>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">LIVE</span>
        </div>

        {/* Tenant Selector Box */}
        <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                <span className="material-symbols-outlined text-[14px]">storefront</span>
              </div>
              <div className="truncate">
                <p className="text-xs truncate text-slate-900 font-semibold leading-tight">{tenant?.name || 'Lumina Studio & Co.'}</p>
                <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">Jakarta Main Operations</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[16px]">unfold_more</span>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {group.title}
              </p>
              {group.items.map((item) => {
                const isSamePath = item.path.split('?')[0];
                const itemQuery = item.path.includes('?') ? item.path.split('?')[1] : null;
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : itemQuery
                    ? location.pathname === isSamePath &&
                      (location.search.includes(itemQuery) || (!location.search && itemQuery === 'hardware'))
                    : location.pathname.startsWith(isSamePath);

                return (
                  <Link
                    key={item.label + item.path}
                    to={item.path}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-white' : 'text-slate-400'}`}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sync Telemetry Status Footer */}
        <div className="p-3 bg-slate-50/80 border-t border-slate-200">
          <div className="p-2 rounded-lg bg-white flex items-center justify-between border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-slate-700 font-medium">Booth API Synced</span>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-500">99.9%</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-64">
        {/* Fixed Top Header */}
        <header className="fixed top-0 left-64 right-0 h-16 bg-white/90 backdrop-blur-md z-40 px-6 flex items-center justify-between border-b border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold">Starter Plan</span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-slate-500">82% Kuota Sesi</span>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer border border-slate-200/70 w-72">
              <span className="material-symbols-outlined text-[16px]">search</span>
              <span className="text-xs text-slate-500 flex-1">Cari sesi, event, foto...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white text-slate-400 text-[10px] font-mono border border-slate-200 shadow-2xs">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
              <span className="text-[11px] font-medium">Auto-Sync Aktif</span>
            </div>

            <Link
              to="/booth/onsite"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">fullscreen</span>
              <span>Mode Booth On-Site</span>
            </Link>

            <div className="h-5 w-[1px] bg-slate-200"></div>

            <button
              className="relative w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="Notifikasi"
            >
              <span className="material-symbols-outlined text-[19px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <div
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-semibold shadow-2xs">
                  {user?.name ? user.name.charAt(0) : 'A'}
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs text-slate-900 leading-none font-semibold">
                    {user?.name || 'Admin Studio'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 leading-none">
                    {user?.roles?.[0]?.name ? user.roles[0].name.replace('_', ' ') : 'Superuser'}
                  </span>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[16px]">arrow_drop_down</span>
              </div>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">{user?.name || 'Admin Studio'}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email || 'admin@photobooth.test'}</p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Pengaturan Akun &amp; Studio
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    Keluar (Logout)
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="relative pt-20 bg-slate-50 min-h-screen w-full px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
