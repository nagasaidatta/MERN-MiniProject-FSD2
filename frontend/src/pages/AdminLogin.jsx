import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBanner from '../components/NotificationBanner';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide administrative email and password.');
      return;
    }

    try {
      setLoading(true);
      const loggedUser = await login(email.trim(), password, 'admin');

      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('Access Denied: This account does not possess administrative privileges.');
      }
    } catch (err) {
      setError(err.message || 'Invalid administrative credentials. Please verify.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-wrapper" style={{ maxWidth: '500px' }}>
      {/* Official Security Header */}
      <div className="card" style={{ borderTop: '4px solid #ef4444' }}>
        <div className="card-header" style={{ textAlign: 'center', backgroundColor: '#0a192f', color: '#ffffff', padding: '2rem 1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏛️</div>
          <span style={{
            display: 'inline-block',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            color: '#fca5a5',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            fontSize: '0.68rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            marginBottom: '0.75rem'
          }}>
            🔒 Official Government Use Only
          </span>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.35rem', color: '#ffffff' }}>
            Administrative Portal
          </h2>
          <p style={{ fontSize: 'var(--font-size-xs)', color: '#94a3b8', margin: 0 }}>
            Restricted access for nodal welfare officers & system administrators.
          </p>
        </div>

        <div className="card-body" style={{ padding: '2rem 1.75rem' }}>
          {error && (
            <NotificationBanner
              type="danger"
              message={error}
              onClose={() => setError('')}
            />
          )}

          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            fontSize: 'var(--font-size-xs)',
            marginBottom: '1.5rem',
            lineHeight: 1.5
          }}>
            <strong>Security Notice:</strong> All administrative login sessions and verification actions are cryptographically logged for audit compliance.
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">
                Officer / Admin Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="admin-email"
                className="form-control"
                placeholder="admin@govportal.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">
                Administrative Password <span className="required">*</span>
              </label>
              <input
                type="password"
                id="admin-password"
                className="form-control"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '0.75rem' }}
              disabled={loading}
            >
              {loading ? 'Authenticating Clearance...' : 'Secure Official Login →'}
            </button>
          </form>
        </div>

        <div className="card-footer" style={{ textAlign: 'center', fontSize: 'var(--font-size-sm)', backgroundColor: '#fafbfd' }}>
          Are you a citizen applying for welfare schemes?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
            Citizen Portal Login →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
