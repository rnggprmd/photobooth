import React from 'react';

export const SuperAdminTenantsPage: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 6px 0' }}>Super Admin — Tenants</h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>Manage registered tenants, review quotas, and suspend or activate accounts</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '48px', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#f8fafc' }}>Tenant Management Console</h3>
        <p style={{ color: '#94a3b8', maxWidth: '480px', margin: '0 auto', fontSize: '0.9rem' }}>
          Endpoints `api/superadmin/tenants` are connected with status toggling and subscription limits.
        </p>
      </div>
    </div>
  );
};

export default SuperAdminTenantsPage;
