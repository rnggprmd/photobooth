import React from 'react';
import { useParams } from 'react-router-dom';

export const ResultPublicPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#090d16',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          border: '1px solid #334155',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✨</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px 0' }}>Your Photobooth Result</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '24px' }}>
          Result Token: <code style={{ color: '#38bdf8' }}>{token}</code>
        </p>
        <div
          style={{
            height: '280px',
            backgroundColor: '#0f172a',
            borderRadius: '10px',
            border: '1px dashed #475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            marginBottom: '20px',
          }}
        >
          Photo Result Image / GIF Preview
        </div>
        <button
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Download Photo
        </button>
      </div>
    </div>
  );
};

export default ResultPublicPage;
