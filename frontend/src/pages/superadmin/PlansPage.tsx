import React from 'react';

export const SuperAdminPlansPage: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 6px 0' }}>Subscription Plans Master</h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>Configure SaaS pricing tiers, limits, and feature lists</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '48px', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#f8fafc' }}>Plans Master Console</h3>
        <p style={{ color: '#94a3b8', maxWidth: '480px', margin: '0 auto', fontSize: '0.9rem' }}>
          Endpoints `api/superadmin/subscription-plans` allow CRUD for Free, Starter, Business, and Enterprise plans.
        </p>
      </div>
    </div>
  );
};

export default SuperAdminPlansPage;
