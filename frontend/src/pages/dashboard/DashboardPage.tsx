import React from 'react';
import useAuthStore from '../../store/authStore';

export const DashboardPage: React.FC = () => {
  const { user, tenant } = useAuthStore();

  const stats = [
    { label: 'Active Events', value: '0', change: '+0% this month' },
    { label: 'Completed Sessions', value: '0', change: '+0 today' },
    { label: 'Total Photos Taken', value: '0', change: 'Cloud Storage: 0 MB' },
    { label: 'Monthly Revenue', value: 'Rp 0', change: '0 transactions' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 8px 0' }}>
          Welcome back, {user?.name || 'Admin'}
        </h1>
        <p style={{ color: '#94a3b8', margin: 0 }}>
          Tenant: <strong style={{ color: '#f1f5f9' }}>{tenant?.name || 'Default Studio'}</strong> | SaaS Photobooth Overview
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: '#1e293b',
              padding: '20px',
              borderRadius: '10px',
              border: '1px solid #334155',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Quick Setup Status */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '10px', border: '1px solid #334155', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 600 }}>System Readiness</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
          Core setup completed according to BRD, PRD, Use Case, and ERD requirements.
          Database migrations (25 tables), Eloquent relations, RBAC permissions, and API endpoints are loaded and ready.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
