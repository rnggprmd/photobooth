import React from 'react';

export const ReportsPage: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 6px 0' }}>Analytics & Reports</h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>Business metrics, session throughput, top templates, and revenue charts</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '48px', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#f8fafc' }}>Reports Ready</h3>
        <p style={{ color: '#94a3b8', maxWidth: '480px', margin: '0 auto', fontSize: '0.9rem' }}>
          Endpoints `api/reports/business`, `api/reports/events`, and `api/reports/sessions` are prepared for chart rendering.
        </p>
      </div>
    </div>
  );
};

export default ReportsPage;
