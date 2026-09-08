import React from 'react';
import { Outlet } from 'react-router-dom';

export const BoothLayout: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Outlet />
    </div>
  );
};

export default BoothLayout;
