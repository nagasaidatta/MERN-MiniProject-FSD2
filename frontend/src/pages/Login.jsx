import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBanner from '../components/NotificationBanner';

const Login = ({ initialMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Determine active tab from prop, path, or query
  const getInitialTab = () => {
    if (initialMode === 'register' || location.pathname === '/register' || location.search.includes('tab=register')) {
      return 'register';
    }
    return 'login';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    if (location.pathname === '/register' || location.search.includes('tab=register')) {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [location.pathname, location.search]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regErrors, setRegErrors] = useState({});

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectMessage = location.state?.message;

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginEmail.trim() || !loginPassword) {
      setError('Please provide both email address and password.');
      return;
    }

    try {
      setLoading(true);
      const loggedUser = await login(loginEmail.trim(), loginPassword, 'citizen');

      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        const destination = location.state?.from?.pathname || '/citizen/dashboard';
        navigate(destination);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Validate Register form
  const validateRegister = () => {
    const errs = {};
    if (!regName.trim()) errs.name = 'Full name is required.';
    if (!regEmail.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(regEmail.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!regPassword) {
      errs.password = 'Password is required.';
    } else if (regPassword.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (regPassword !== regConfirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    setRegErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle Register submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateRegister()) return;

    try {
      setLoading(true);
      await register(regName.trim(), regEmail.trim(), regPassword);
      navigate('/citizen/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-wrapper" style={{ maxWidth: '520px' }}>
      <div className="card">
        {/* Card Header */}
        <div className="card-header" style={{ textAlign: 'center', backgroundColor: '#fafbfd', paddingBottom: '1rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>🏛️</div>
          <span style={{
            display: 'inline-block',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            fontSize: '0.68rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            marginBottom: '0.5rem'
          }}>
            Citizen Welfare Portal
          </span>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '0.25rem', color: 'var(--color-primary)' }}>
            Citizen Portal Access
          </h2>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
            {activeTab === 'login'
              ? 'Sign in to access welfare schemes and monitor your applications.'
              : 'Create your beneficiary account to begin applying for welfare schemes.'}
          </p>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: '#f8fafc'
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); }}
            style={{
              padding: '0.875rem 1rem',
              border: 'none',
              borderBottom: activeTab === 'login' ? '3px solid var(--color-accent)' : '3px solid transparent',
              backgroundColor: activeTab === 'login' ? '#ffffff' : 'transparent',
              color: activeTab === 'login' ? 'var(--color-accent)' : 'var(--color-text-muted)',
              fontWeight: 700,
              fontSize: 'var(--font-size-sm)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            🔑 Citizen Login
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(''); }}
            style={{
              padding: '0.875rem 1rem',
              border: 'none',
              borderBottom: activeTab === 'register' ? '3px solid var(--color-accent)' : '3px solid transparent',
              backgroundColor: activeTab === 'register' ? '#ffffff' : 'transparent',
              color: activeTab === 'register' ? 'var(--color-accent)' : 'var(--color-text-muted)',
              fontWeight: 700,
              fontSize: 'var(--font-size-sm)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            📝 Register Account
          </button>
        </div>

        {/* Card Body */}
        <div className="card-body">
          {redirectMessage && (
            <NotificationBanner type="info" message={redirectMessage} />
          )}

          {error && (
            <NotificationBanner
              type="danger"
              message={error}
              onClose={() => setError('')}
            />
          )}

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">
                  Citizen Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="login-email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-password">
                  Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="login-password"
                  className="form-control"
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Citizen Sign In →'}
              </button>
            </form>
          )}

          {/* TAB 2: REGISTRATION FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="reg-name"
                  className="form-control"
                  placeholder="e.g. Ramesh Kumar"
                  value={regName}
                  onChange={(e) => {
                    setRegName(e.target.value);
                    if (regErrors.name) setRegErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  required
                />
                {regErrors.name && <span className="form-error">{regErrors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="reg-email"
                  className="form-control"
                  placeholder="ramesh.kumar@example.com"
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (regErrors.email) setRegErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  required
                  autoComplete="email"
                />
                {regErrors.email && <span className="form-error">{regErrors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">
                  Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="reg-password"
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={regPassword}
                  onChange={(e) => {
                    setRegPassword(e.target.value);
                    if (regErrors.password) setRegErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  required
                  autoComplete="new-password"
                />
                {regErrors.password && <span className="form-error">{regErrors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm-password">
                  Confirm Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="reg-confirm-password"
                  className="form-control"
                  placeholder="Re-enter password"
                  value={regConfirmPassword}
                  onChange={(e) => {
                    setRegConfirmPassword(e.target.value);
                    if (regErrors.confirmPassword) setRegErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }}
                  required
                  autoComplete="new-password"
                />
                {regErrors.confirmPassword && (
                  <span className="form-error">{regErrors.confirmPassword}</span>
                )}
              </div>

              <div style={{ backgroundColor: '#f1f5f9', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                🔒 All registrations are automatically assigned the verified <strong>Citizen</strong> role.
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Creating Citizen Account...' : 'Register Citizen Account →'}
              </button>
            </form>
          )}
        </div>

        {/* Card Footer */}
        <div className="card-footer" style={{ textAlign: 'center', fontSize: 'var(--font-size-sm)', backgroundColor: '#fafbfd' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            {activeTab === 'login' ? (
              <span>
                New citizen to the portal?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setError(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Create account here
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            Are you a department administrator?{' '}
            <Link to="/admin-login" style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
              Official Admin Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
