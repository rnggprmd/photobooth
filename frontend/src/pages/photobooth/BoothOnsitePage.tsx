import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const BoothOnsitePage: React.FC = () => {
  const [stage, setStage] = useState<'select_event' | 'ready' | 'countdown' | 'captured' | 'generating'>('select_event');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#090d16', color: '#f8fafc', padding: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8' }}>📸 On-Site Photobooth</span>
          <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#059669', fontSize: '0.75rem', fontWeight: 600 }}>
            OPERATOR MODE
          </span>
        </div>
        <Link
          to="/"
          style={{
            color: '#94a3b8',
            textDecoration: 'none',
            fontSize: '0.875rem',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: '#1e293b',
          }}
        >
          Exit to Dashboard
        </Link>
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
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📷</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Camera Viewport & Session Flow</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
            Ready for hardware/webcam integration, photo sequencing, countdown timer, and template composite rendering.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => setStage(stage === 'ready' ? 'select_event' : 'ready')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Toggle Stage ({stage})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoothOnsitePage;
