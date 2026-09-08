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
        { label: 'Ringkasan Operasional', path: '/reports', icon: 'monitoring' },
      ],
    },
    {
      title: 'Manajemen Bisnis',
      items: [
        { label: 'Event & Jadwal', path: '/events', icon: 'calendar_month' },
        { label: 'Paket Layanan', path: '/packages', icon: 'loyalty' },
        { label: 'Template & Frame Studio', path: '/templates', icon: 'crop_portrait' },
        { label: 'Kelola Operator', path: '/customers', icon: 'badge' },
      ],
    },
    {
      title: 'Sesi & Galeri',
      items: [
        { label: 'Sesi Photobooth Aktif', path: '/sessions', icon: 'live_tv' },
        { label: 'Galeri Foto & QR', path: '/gallery', icon: 'qr_code_scanner' },
        { label: 'Cetak & Hardware', path: '/settings', icon: 'print' },
      ],
    },
    {
      title: 'Finansial & Akun',
      items: [
        { label: 'Transaksi & Invoice', path: '/transactions', icon: 'receipt_long' },
        { label: 'Paket Langganan SaaS', path: '/superadmin/plans', icon: 'stars' },
        { label: 'Pengaturan Tenant', path: '/settings', icon: 'settings' },
      ],
    },
  ];

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen">
      {/* Fixed Left Navigation Rail */}
      <aside className="fixed left-0 top-0 h-full w-sidebar-width bg-surface-container-lowest z-50 flex flex-col shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-outline-variant/40">
        {/* Brand Header */}
        <div className="h-16 px-space-md flex items-center justify-between bg-surface-container-low/40 border-b border-surface-container-high">
          <div className="flex items-center gap-space-xs">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-on-primary text-[18px]">photo_camera</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface font-semibold">SnapStudio</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono-data">Cloud Core v2.4</span>
            </div>
          </div>
          <button className="w-6 h-6 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" title="Switch Environment">
            <span className="material-symbols-outlined text-[16px]">unfold_more</span>
          </button>
        </div>

        {/* Tenant Selector Box */}
        <div className="px-space-md py-space-xs bg-surface-container-low">
          <div className="flex items-center justify-between p-space-xs rounded-xl bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.02)] border border-outline-variant/30">
            <div className="flex items-center gap-space-xs overflow-hidden">
              <div className="w-6 h-6 rounded bg-primary-fixed flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-primary-fixed text-[14px]">storefront</span>
              </div>
              <div className="truncate">
                <p className="font-label-md text-label-md truncate text-on-surface font-medium">{tenant?.name || 'Lumina Studio & Co.'}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant truncate">Jakarta Branch</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[16px]">expand_more</span>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-space-sm py-space-md space-y-space-md">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-space-2xs">
              <p className="px-space-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                {group.title}
              </p>
              {group.items.map((item) => {
                const isActive = item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.label + item.path}
                    to={item.path}
                    className={`flex items-center gap-space-xs px-space-xs py-space-xs transition-all ${
                      isActive
                        ? 'bg-primary-container text-on-primary font-medium rounded-xl shadow-sm'
                        : 'rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span className="font-label-md text-label-md">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sync Telemetry Status Footer */}
        <div className="p-space-sm bg-surface-container-low border-t border-surface-container-high">
          <div className="p-space-xs rounded-xl bg-surface-container-lowest flex items-center justify-between border border-outline-variant/30">
            <div className="flex items-center gap-space-xs">
              <div className="w-2 h-2 rounded-full bg-tertiary-container animate-ping"></div>
              <span className="font-label-sm text-label-sm text-on-surface font-medium">Booth API Synced</span>
            </div>
            <span className="font-mono-data text-body-sm text-on-surface-variant">99.9%</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-sidebar-width">
        {/* Fixed Top Header */}
        <header className="fixed top-0 left-sidebar-width right-0 h-16 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-space-lg flex items-center justify-between border-b border-outline-variant/30">
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-fixed">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="font-label-sm text-label-sm font-semibold">Starter Plan</span>
              <span className="text-outline">•</span>
              <span className="font-mono-data text-body-sm">82% Quota Sesi</span>
            </div>
            <div className="hidden md:flex items-center gap-space-xs px-space-sm py-1.5 rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20">
              <span className="material-symbols-outlined text-[16px]">search</span>
              <span className="font-body-sm text-body-sm">Cari data booth, event, frame...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-outline text-[10px] font-mono-data shadow-2xs">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <div className="hidden lg:flex items-center gap-space-2xs px-space-xs py-1 rounded-lg bg-surface-container-low border border-outline-variant/20">
              <span className="material-symbols-outlined text-[16px] text-tertiary">cloud_done</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Auto-Sync Aktif</span>
            </div>

            <Link
              to="/booth/onsite"
              className="px-space-sm py-1.5 rounded-xl bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-space-2xs shadow-sm hover:bg-primary transition-all text-decoration-none"
            >
              <span className="material-symbols-outlined text-[18px]">fullscreen</span>
              <span>Mode Booth On-Site</span>
            </Link>

            <div className="h-6 w-[1px] bg-outline-variant"></div>

            <button
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
              title="Notifikasi"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span>
            </button>

            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
              title="Bantuan"
            >
              <span className="material-symbols-outlined text-[20px]">help_outline</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <div
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-space-xs cursor-pointer p-1 rounded-xl hover:bg-surface-container-low transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="font-label-md text-label-md text-on-surface leading-none font-medium">
                    {user?.name || 'Admin Studio'}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {user?.roles?.[0]?.name ? user.roles[0].name.replace('_', ' ') : 'Superuser'}
                  </span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[16px]">arrow_drop_down</span>
              </div>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-1 z-50">
                  <div className="px-4 py-2 border-b border-surface-container-high">
                    <p className="text-body-sm font-semibold text-on-surface">{user?.name || 'Admin Studio'}</p>
                    <p className="text-body-sm text-on-surface-variant truncate">{user?.email || 'admin@photobooth.test'}</p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-body-sm text-on-surface hover:bg-surface-container-low"
                  >
                    Pengaturan Akun
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-body-sm text-error hover:bg-error-container/20 flex items-center gap-2"
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
        <main className="relative pt-16 bg-surface min-h-screen w-full px-gutter-desktop py-space-lg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
