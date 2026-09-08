import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export const RegisterPage: React.FC = () => {
  const [tenantName, setTenantName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register({
        tenant_name: tenantName,
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>Register New Tenant</h2>
      {error && (
        <div style={{ padding: '10px 12px', borderRadius: '6px', backgroundColor: '#ef444420', color: '#f87171', border: '1px solid #ef4444', marginBottom: '16px', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: '#cbd5e1' }}>Business / Brand Name</label>
          <input
            type="text"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: '#cbd5e1' }}>Admin Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: '#cbd5e1' }}>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: '#cbd5e1' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: '#cbd5e1' }}>Confirm Password</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: '10px', padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Creating Account...' : 'Register Account'}
        </button>
      </form>
      <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
        Already have an account?{' '}
        <Link to="/auth/login" style={{ color: '#38bdf8', textDecoration: 'none' }}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
