import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import NotificationBanner from '../components/NotificationBanner';
import { BuildingIcon, ShieldIcon } from '../components/Icons';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    try {
      setLoading(true);
      await register(formData.name, formData.email, formData.password);
      navigate('/citizen/dashboard');
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-wrapper" style={{ maxWidth: '520px' }}>
      <div className="card">
        <div className="card-header" style={{ textAlign: 'center', backgroundColor: '#fafbfd', paddingBottom: '1rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            marginBottom: '0.5rem',
            color: 'var(--color-primary)'
          }}>
            <BuildingIcon size={24} color="var(--color-primary)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Citizen Registration</h2>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
            Create an official beneficiary account to access government welfare schemes.
          </p>
        </div>

        <div className="card-body">
          {serverError && (
            <NotificationBanner
              type="danger"
              message={serverError}
              onClose={() => setServerError('')}
            />
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="e.g. Ramesh Kumar"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="ramesh.kumar@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password <span className="required">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password <span className="required">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && (
                <span className="form-error">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Notice regarding default role */}
            <div style={{
              backgroundColor: '#f1f5f9',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <ShieldIcon size={14} color="var(--color-primary)" />
              <span><strong>Official Role Policy:</strong> Public registrations are provisioned with the verified <strong>Citizen</strong> role.</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Creating Citizen Account...' : 'Register Citizen Account'}
            </button>
          </form>
        </div>

        <div className="card-footer" style={{ textAlign: 'center', fontSize: 'var(--font-size-sm)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
