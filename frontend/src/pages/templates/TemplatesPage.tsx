import React from 'react';

export const TemplatesPage: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 6px 0' }}>Frame Templates</h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>Manage photobooth templates, versions, slots, and overlay elements</p>
        </div>
        <button
          style={{
            padding: '10px 18px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + New Template
        </button>
      </div>

      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '48px', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#f8fafc' }}>Template Canvas Studio Ready</h3>
        <p style={{ color: '#94a3b8', maxWidth: '480px', margin: '0 auto', fontSize: '0.9rem' }}>
          Supports custom slot coordinates, rotations, overlays, and background assets matching the Template versioning model.
        </p>
      </div>
    </div>
  );
};

export default TemplatesPage;
