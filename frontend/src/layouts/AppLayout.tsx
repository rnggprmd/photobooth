import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Layers,
  Palette,
  Users,
  Tv,
  Image as ImageIcon,
  Printer,
  Receipt,
  Settings,
  CreditCard,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  ChevronsUpDown,
  LogOut,
  ExternalLink,
  Store,
  Shield,
  MonitorPlay,
  SlidersHorizontal,
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { notificationsApi, type NotificationItem } from '../api/notifications';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const AppLayout: React.FC = () => {
  const { user, tenant, clearAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      type: 'printer_warning',
      channel: 'in_app',
      title: 'Peringatan Stok Kertas Rendah',
      message: 'Sisa kertas DNP DS620 di Kiosk 01 tersisa 38 lembar. Siapkan roll cadangan.',
      status: 'unread',
      created_at: '12 menit lalu',
    },
    {
      id: 2,
      type: 'payment_success',
      channel: 'in_app',
      title: 'Pembayaran Invoice Berhasil',
      message: 'Tagihan INV-2026-0982 senilai Rp 4.750.000 (Kevin & Astrid) telah lunas.',
      status: 'unread',
      created_at: '1 jam lalu',
    },
    {
      id: 3,
      type: 'session_complete',
      channel: 'in_app',
      title: 'Sesi Foto Baru Selesai',
      message: 'Sesi #SES-8821-0492 berhasil dicetak dan QR code siap diunduh tamu.',
      status: 'read',
      created_at: '2 jam lalu',
    },
  ]);
  const [unreadCount, setUnreadCount] = useState(2);

  useEffect(() => {
    notificationsApi
      .list()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setNotifications(res.data);
          const count = res.unread_count ?? res.data.filter((n) => n.status === 'unread').length;
          setUnreadCount(count);
        }
      })
      .catch((err) => console.warn('Notifications fetch warning:', err));
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
    } catch (e) {
      console.warn('API markAsRead error:', e);
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllRead();
    } catch (e) {
      console.warn('API markAllRead error:', e);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read' })));
    setUnreadCount(0);
  };

  const handleDeleteNotification = async (id: number) => {
    try {
      await notificationsApi.delete(id);
    } catch (e) {
      console.warn('API delete error:', e);
    }
    const item = notifications.find((n) => n.id === id);
    if (item && item.status === 'unread') {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/auth/login');
  };

  const isSuperAdmin = Boolean(
    user?.roles?.some((r: any) => (typeof r === 'string' ? r === 'super_admin' : r.name === 'super_admin'))
  );

  const navGroups: NavGroup[] = isSuperAdmin
    ? [
        {
          title: 'Ikhtisar',
          items: [
            { label: 'Platform Dashboard', path: '/admin', icon: LayoutDashboard },
            { label: 'Laporan & Telemetri', path: '/admin/reports', icon: SlidersHorizontal },
          ],
        },
        {
          title: 'Manajemen SaaS',
          items: [
            { label: 'Kelola Tenant Studio', path: '/admin/superadmin/tenants', icon: Store },
            { label: 'Paket Langganan', path: '/admin/superadmin/plans', icon: Shield },
            { label: 'Semua Event', path: '/admin/events', icon: Calendar },
            { label: 'Frame & Template', path: '/admin/templates', icon: Palette },
            { label: 'Database Kru & Klien', path: '/admin/customers', icon: Users },
          ],
        },
        {
          title: 'Sesi & Armada',
          items: [
            { label: 'Monitoring Sesi', path: '/admin/sessions', icon: Tv },
            { label: 'Galeri Foto Global', path: '/admin/gallery', icon: ImageIcon },
            { label: 'Hardware Kiosk', path: '/admin/settings?tab=hardware', icon: Printer },
          ],
        },
        {
          title: 'Finansial & Pengaturan',
          items: [
            { label: 'Transaksi & Billing', path: '/admin/transactions', icon: Receipt },
            { label: 'Pengaturan Platform', path: '/admin/settings?tab=tenant', icon: Settings },
          ],
        },
      ]
    : [
        {
          title: 'Utama',
          items: [
            { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
            { label: 'Laporan Operasional', path: '/admin/reports', icon: SlidersHorizontal },
          ],
        },
        {
          title: 'Manajemen Bisnis',
          items: [
            { label: 'Event & Jadwal', path: '/admin/events', icon: Calendar },
            { label: 'Paket Layanan', path: '/admin/packages', icon: Layers },
            { label: 'Template & Frame', path: '/admin/templates', icon: Palette },
            { label: 'Operator & Tamu', path: '/admin/customers', icon: Users },
          ],
        },
        {
          title: 'Sesi & Galeri',
          items: [
            { label: 'Sesi Booth Aktif', path: '/admin/sessions', icon: Tv },
            { label: 'Galeri Foto & QR', path: '/admin/gallery', icon: ImageIcon },
            { label: 'Cetak & Hardware', path: '/admin/settings?tab=hardware', icon: Printer },
          ],
        },
        {
          title: 'Finansial & Akun',
          items: [
            { label: 'Transaksi & Invoice', path: '/admin/transactions', icon: Receipt },
            { label: 'Paket Studio', path: '/admin/subscription', icon: CreditCard },
            { label: 'Pengaturan Tenant', path: '/admin/settings?tab=tenant', icon: Settings },
          ],
        },
      ];

  // Helper for Breadcrumb title
  const currentPath = location.pathname;
  let pageTitle = 'Dashboard';
  if (currentPath.includes('/events')) pageTitle = 'Event & Jadwal';
  else if (currentPath.includes('/templates')) pageTitle = 'Template & Frame';
  else if (currentPath.includes('/packages')) pageTitle = 'Paket Layanan';
  else if (currentPath.includes('/sessions')) pageTitle = 'Sesi Photobooth';
  else if (currentPath.includes('/gallery')) pageTitle = 'Galeri Foto & QR';
  else if (currentPath.includes('/customers')) pageTitle = 'Operator & Tamu';
  else if (currentPath.includes('/transactions')) pageTitle = 'Transaksi & Invoice';
  else if (currentPath.includes('/reports')) pageTitle = 'Laporan Operasional';
  else if (currentPath.includes('/settings')) pageTitle = 'Pengaturan';
  else if (currentPath.includes('/superadmin/tenants')) pageTitle = 'Kelola Tenant Studio';
  else if (currentPath.includes('/superadmin/plans')) pageTitle = 'Master Paket Langganan';

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex font-sans selection:bg-indigo-600 selection:text-white">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Shell (Shadcn Dashboard style) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200/80">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-2xs">
              <span className="material-symbols-outlined text-[17px]">photo_camera</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-slate-900">SnapStudio</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                PRO
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tenant Workspace Selector Pill */}
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors cursor-pointer group">
            <div className="flex items-center gap-2 overflow-hidden">
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isSuperAdmin
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {isSuperAdmin ? 'SA' : tenant?.name?.charAt(0) || 'L'}
              </div>
              <div className="truncate">
                <p className="text-xs truncate font-semibold text-slate-900 leading-tight">
                  {isSuperAdmin ? 'Super Admin Console' : tenant?.name || 'Lumina Photostudio'}
                </p>
                <p className="text-[10px] truncate text-slate-500 font-mono leading-tight mt-0.5">
                  {isSuperAdmin ? 'Platform Root' : 'Jakarta Main Operations'}
                </p>
              </div>
            </div>
            <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
          </div>
        </div>

        {/* Navigation Menus */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <p className="px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {group.title}
              </p>
              {group.items.map((item) => {
                const isSamePath = item.path.split('?')[0];
                const itemQuery = item.path.includes('?') ? item.path.split('?')[1] : null;
                const isDashboard = item.path === '/admin';
                const isActive = isDashboard
                  ? location.pathname === '/admin' || location.pathname === '/admin/' || location.pathname === '/admin/dashboard'
                  : itemQuery
                  ? location.pathname === isSamePath &&
                    (location.search.includes(itemQuery) || (!location.search && itemQuery === 'hardware'))
                  : location.pathname.startsWith(isSamePath);

                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-semibold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent
                        className={`w-4 h-4 ${
                          isActive ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-200 text-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer with User Profile */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/50 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Lihat Landing Page</span>
          </Link>

          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs truncate font-semibold text-slate-900 leading-tight">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] truncate text-slate-500 font-mono leading-tight mt-0.5">
                  {user?.email || 'admin@studio.test'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Sticky Header Bar (Shadcn style) */}
        <header className="sticky top-0 z-40 h-14 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Buka Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Konsol</span>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-slate-900">{pageTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Command Search Shortcut (⌘K) */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer w-60">
              <Search className="w-3.5 h-3.5" />
              <span className="text-xs text-slate-500 flex-1">Cari sesi, event...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white text-slate-400 text-[10px] font-mono border border-slate-200 shadow-2xs">
                ⌘K
              </kbd>
            </div>

            {/* Mode Booth On-Site Launch Button */}
            {isSuperAdmin ? (
              <Link
                to="/admin/superadmin/tenants"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Console Tenant</span>
              </Link>
            ) : (
              <Link
                to="/booth/onsite"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <MonitorPlay className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mode Kiosk On-Site</span>
                <span className="sm:hidden">Kiosk</span>
              </Link>
            )}

            <div className="h-4 w-[1px] bg-slate-200" />

            {/* Notifications Dropdown Popover */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                title="Pusat Notifikasi"
                aria-label="Pusat Notifikasi"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Notifikasi</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 font-mono text-[10px] font-bold">
                          {unreadCount} Baru
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                      >
                        Tandai Semua Dibaca
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        Tidak ada notifikasi aktif
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 text-xs transition-colors flex items-start gap-2.5 ${
                            n.status === 'unread' ? 'bg-indigo-50/30' : 'bg-white'
                          }`}
                        >
                          <div className="mt-0.5">
                            {n.type === 'printer_warning' ? (
                              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900 leading-snug">{n.title}</p>
                            <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{n.message}</p>
                            <span className="text-[10px] text-slate-400 font-mono mt-1 block">{n.created_at}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {n.status === 'unread' && (
                              <button
                                onClick={() => handleMarkAsRead(n.id)}
                                className="text-[10px] text-indigo-600 hover:underline"
                              >
                                Baca
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(n.id)}
                              className="text-[10px] text-slate-400 hover:text-rose-600"
                              title="Hapus"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
