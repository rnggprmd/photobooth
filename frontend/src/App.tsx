import React from 'react';

export const App: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>Photobooth Setup Ready</h1>
      <p style={{ color: '#64748b' }}>
        Backend: Laravel 13 (API) | Frontend: React 19 (Vite)
      </p>
    </div>
  );
};

export default App;
