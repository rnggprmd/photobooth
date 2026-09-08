import React from 'react';
import useAuthStore from '../../store/authStore';

export const SettingsPage: React.FC = () => {
  const { tenant } = useAuthStore();

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 6px 0' }}>Business & Tenant Settings</h1>
        <p style={{ color: '#94a3b8', margin: 0 }}>Configure business profile, branding logos, QRIS, and subscription plans</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem' }}>Business Profile</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '16px' }}>
            Tenant: {tenant?.name || 'My Photobooth Business'}
          </p>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Form fields for company name, brand logo, Instagram, TikTok, and bank accounts are mapped to `api/business`.
          </p>
        </div>

        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem' }}>Subscription & Limits</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '8px' }}>
            Current Plan: <strong style={{ color: '#38bdf8' }}>Free Tier / Starter</strong>
          </p>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Upgrade plan via `api/subscription/select` to increase operator seats and storage quota.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
