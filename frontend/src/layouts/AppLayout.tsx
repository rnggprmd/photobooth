import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export const AppLayout: React.FC = () => {
  const { user, tenant, clearAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/auth/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'Templates', path: '/templates' },
    { label: 'Packages', path: '/packages' },
    { label: 'Sessions', path: '/sessions' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Customers', path: '/customers' },
    { label: 'Transactions', path: '/transactions' },
    { label: 'Reports', path: '/reports' },
    { label: 'Settings', path: '/settings' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#38bdf8', margin: 0 }}>
            📸 Photobooth SaaS
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
            {tenant?.name || 'Tenant Workspace'}
          </p>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: isActive ? '#ffffff' : '#94a3b8',
                  backgroundColor: isActive ? '#2563eb' : 'transparent',
                  transition: 'background-color 0.15s ease',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info / Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid #334155' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>{user?.name || 'Operator / Admin'}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>{user?.email || 'admin@example.com'}</div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '6px',
              backgroundColor: '#334155',
              color: '#f8fafc',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <header style={{ height: '64px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', backgroundColor: '#0f172a' }}>
          <div style={{ fontSize: '0.95rem', color: '#94a3b8' }}>Photobooth Cloud System</div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link
              to="/booth/onsite"
              style={{
                backgroundColor: '#059669',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              Open Onsite Booth
            </Link>
          </div>
        </header>
        <div style={{ padding: '32px', flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
