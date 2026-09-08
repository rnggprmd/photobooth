import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('tenant@photobooth.test');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>Sign in to your account</h2>
      {error && (
        <div style={{ padding: '10px 12px', borderRadius: '6px', backgroundColor: '#ef444420', color: '#f87171', border: '1px solid #ef4444', marginBottom: '16px', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: '#cbd5e1' }}>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: '#cbd5e1' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: '8px', padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Quick Demo Accounts Selection */}
      <div style={{ marginTop: '20px', padding: '12px', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid #334155' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          ⚡ 1-Click Demo Accounts (Pass: password)
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => handleQuickFill('tenant@photobooth.test')}
            style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #3b82f6', backgroundColor: '#1d4ed820', color: '#60a5fa', cursor: 'pointer' }}
          >
            🏢 Tenant Admin
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('superadmin@photobooth.test')}
            style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #a855f7', backgroundColor: '#7e22ce20', color: '#c084fc', cursor: 'pointer' }}
          >
            👑 Super Admin
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('operator@photobooth.test')}
            style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #10b981', backgroundColor: '#05966920', color: '#34d399', cursor: 'pointer' }}
          >
            📸 Operator
          </button>
        </div>
      </div>

      <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
        Don't have an account?{' '}
        <Link to="/auth/register" style={{ color: '#38bdf8', textDecoration: 'none' }}>
          Register Tenant
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
