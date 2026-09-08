import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { galleryApi } from '../../api/gallery';

export const ResultPublicPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    galleryApi
      .getPublicResult(token)
      .then((res) => {
        setResult(res.data);
      })
      .catch((err) => {
        console.warn('Public result fetch warning:', err);
        setError('Foto tidak ditemukan atau link telah kedaluwarsa.');
      })
      .finally(() => setLoading(false));
  }, [token]);

  const imageUrl = result?.final_media?.file_path || result?.composite_media?.file_path || null;
  const sessionName = result?.photo_session?.customer?.name || 'Tamu';
  const eventName = result?.photo_session?.event?.name || 'Photobooth Event';

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
        {loading ? (
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '24px' }}>Memuat foto...</p>
        ) : error ? (
          <p style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '24px' }}>{error}</p>
        ) : (
          <>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '8px' }}>
              {sessionName} — {eventName}
            </p>
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '24px' }}>
              Token: <code style={{ color: '#38bdf8' }}>{token}</code>
            </p>
          </>
        )}
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
            overflow: 'hidden',
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Photobooth Result"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : loading ? (
            'Memuat...'
          ) : (
            'Photo Result Preview'
          )}
        </div>
        <button
          onClick={() => {
            if (imageUrl) {
              const a = document.createElement('a');
              a.href = imageUrl;
              a.download = `photobooth-${token}.jpg`;
              a.click();
            }
          }}
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
