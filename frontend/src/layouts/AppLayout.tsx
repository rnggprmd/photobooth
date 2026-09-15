import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { notificationsApi, type NotificationItem } from '../api/notifications';

export const AppLayout: React.FC = () => {
  const { user, tenant, clearAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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

  const navGroups = isSuperAdmin
    ? [
        {
          title: 'Utama',
          items: [
            { label: 'Platform Dashboard', path: '/', icon: 'space_dashboard' },
            { label: 'Ringkasan Telemetri Global', path: '/reports', icon: 'insights' },
          ],
        },
        {
          title: 'Manajemen Tenant & Paket',
          items: [
            { label: 'Kelola Armada Tenant', path: '/superadmin/tenants', icon: 'apartment' },
            { label: 'Master Paket Langganan', path: '/superadmin/plans', icon: 'admin_panel_settings' },
            { label: 'Event Seluruh Studio', path: '/events', icon: 'calendar_month' },
            { label: 'Template & Frame Global', path: '/templates', icon: 'crop_portrait' },
            { label: 'Database Kru & Tamu', path: '/customers', icon: 'badge' },
          ],
        },
        {
          title: 'Sesi & Galeri Global',
          items: [
            { label: 'Monitoring Sesi Global', path: '/sessions', icon: 'live_tv' },
            { label: 'Galeri Foto Semua Tenant', path: '/gallery', icon: 'qr_code_scanner' },
            { label: 'Hardware Fleet Kiosk', path: '/settings?tab=hardware', icon: 'print' },
          ],
        },
        {
          title: 'Finansial & Konfigurasi',
          items: [
            { label: 'Transaksi & Billing SaaS', path: '/transactions', icon: 'receipt_long' },
            { label: 'Pengaturan Platform', path: '/settings?tab=tenant', icon: 'settings' },
          ],
        },
      ]
    : [
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
            { label: 'Paket Langganan Studio', path: '/subscription', icon: 'stars' },
            { label: 'Pengaturan Tenant', path: '/settings?tab=tenant', icon: 'settings' },
          ],
        },
      ];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* Fixed Left Navigation Rail */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white z-50 flex flex-col border-r border-slate-200 shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm tracking-tight text-slate-900 font-bold leading-none">SnapStudio</span>
              <span className="text-[11px] text-slate-400 font-mono tracking-tight mt-0.5">Enterprise Booth v2.4</span>
            </div>
          </div>
        </div>

        {/* Tenant Selector Box */}
        <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer">
            <div className="flex items-center gap-2 overflow-hidden">
              <div
                className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                  isSuperAdmin ? 'bg-purple-50 border border-purple-200 text-purple-700' : 'bg-indigo-50 border border-indigo-100 text-indigo-600'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isSuperAdmin ? 'admin_panel_settings' : 'storefront'}
                </span>
              </div>
              <div className="truncate">
                <p className="text-xs truncate text-slate-900 font-semibold leading-tight">
                  {isSuperAdmin ? 'Super Admin Console' : tenant?.name || 'Lumina Studio & Co.'}
                </p>
                <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                  {isSuperAdmin ? 'Platform Root Access' : 'Jakarta Main Operations'}
                </p>
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
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 bg-slate-50/80 border-t border-slate-200">
          <div className="flex items-center justify-between px-2 py-1 text-slate-400 text-xs">
            <span className="font-mono text-[11px] text-slate-500">SnapStudio v2.4</span>
            <Link to="/settings" className="text-[11px] text-slate-500 hover:text-slate-800 transition-colors">
              Pengaturan
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-64">
        {/* Fixed Top Header */}
        <header className="fixed top-0 left-64 right-0 h-16 bg-white/95 backdrop-blur-md z-40 px-6 sm:px-8 flex items-center justify-between border-b border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer border border-slate-200/70 w-80 sm:w-96 shadow-2xs">
              <span className="material-symbols-outlined text-[16px]">search</span>
              <span className="text-xs text-slate-500 flex-1">
                {isSuperAdmin ? 'Cari tenant, paket SaaS, atau rute...' : 'Cari sesi, event, foto...'}
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-white text-slate-400 text-[10px] font-mono border border-slate-200 shadow-2xs">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            {isSuperAdmin ? (
              <Link
                to="/superadmin/tenants"
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">domain</span>
                <span>Console Tenant</span>
              </Link>
            ) : (
              <Link
                to="/booth/onsite"
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                <span>Mode Booth On-Site</span>
              </Link>
            )}

            <div className="h-5 w-[1px] bg-slate-200"></div>

            {/* Notification Bell with Dropdown Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                }}
                className="relative w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                title="Pusat Notifikasi"
                aria-label="Pusat Notifikasi"
              >
                <span className="material-symbols-outlined text-[19px]">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Pusat Notifikasi</span>
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

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-400">
                        <span className="material-symbols-outlined text-2xl block mb-1">notifications_off</span>
                        <span>Tidak ada notifikasi baru</span>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3.5 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-3 ${
                            notif.status === 'unread' ? 'bg-indigo-50/30' : ''
                          }`}
                        >
                          <div
                            className="flex items-start gap-2.5 flex-1 cursor-pointer"
                            onClick={() => handleMarkAsRead(notif.id)}
                          >
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${
                                notif.type === 'printer_warning'
                                  ? 'bg-amber-100 text-amber-700'
                                  : notif.type === 'payment_success'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : notif.type === 'session_complete'
                                  ? 'bg-indigo-100 text-indigo-700'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[15px]">
                                {notif.type === 'printer_warning'
                                  ? 'print'
                                  : notif.type === 'payment_success'
                                  ? 'payments'
                                  : notif.type === 'session_complete'
                                  ? 'photo_camera'
                                  : 'info'}
                              </span>
                            </span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4
                                  className={`text-xs ${
                                    notif.status === 'unread'
                                      ? 'font-bold text-slate-900'
                                      : 'font-medium text-slate-700'
                                  }`}
                                >
                                  {notif.title}
                                </h4>
                                {notif.status === 'unread' && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0 ml-1"></span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                {notif.message}
                              </p>
                              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                                {notif.created_at}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteNotification(notif.id)}
                            className="text-slate-300 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                            title="Hapus notifikasi"
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <Link
                      to="/reports"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[11px] font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Lihat Log Insiden &amp; Telemetri Selengkapnya</span>
                      <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

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
        <main className="relative pt-24 pb-12 px-6 sm:px-8 lg:px-10 bg-slate-50 min-h-screen w-full flex-1 max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
