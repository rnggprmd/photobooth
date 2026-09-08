import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Ensure initial demo authentication is configured for seamless API integration
if (!localStorage.getItem('auth_token')) {
  localStorage.setItem('auth_token', '4|iTHTC2kvpWzdCNo1I5RQSlge7SUqrHACDBQcGoQP9c559228');
  localStorage.setItem('auth_user', JSON.stringify({
    id: 2,
    tenant_id: 1,
    name: 'Admin Lumina',
    email: 'tenant@photobooth.test',
    roles: [{ id: 2, name: 'tenant_admin' }],
  }));
  localStorage.setItem('auth_tenant', JSON.stringify({
    id: 1,
    name: 'Lumina Photobooth Studio',
    subdomain: 'lumina',
  }));
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
