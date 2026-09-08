import React from 'react';
import { useParams } from 'react-router-dom';

export const BoothOnlinePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#090d16', color: '#f8fafc', padding: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8' }}>📸 Online Photobooth</span>
          <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#8b5cf6', fontSize: '0.75rem', fontWeight: 600 }}>
            VIRTUAL EVENT: {slug || 'default'}
          </span>
        </div>
      </header>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#020617',
          borderRadius: '16px',
          border: '2px dashed #334155',
          padding: '32px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌐</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Online Virtual Booth Ready</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Event slug: <strong>{slug}</strong>. Ready for mobile browser camera access, upload or capture, template preview, and digital download generation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BoothOnlinePage;
