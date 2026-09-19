import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import NotificationBanner from '../components/NotificationBanner';

const Profile = () => {
  const { user, updateCurrentUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setErrorMsg('New password must be at least 6 characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('New password and confirmation do not match.');
        return;
      }
    }

    try {
      setLoading(true);
      const payload = { name: name.trim() };
      if (newPassword) {
        payload.password = newPassword;
      }

      const res = await authService.updateProfile(payload);
      if (res.success && res.user) {
        updateCurrentUser(res.user);
        setSuccessMsg('Profile updated successfully.');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-wrapper" style={{ maxWidth: '600px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Citizen Profile</h1>
          <p className="page-subtitle">View and update your registered citizen credentials</p>
        </div>
      </div>

      {successMsg && (
        <NotificationBanner
          type="success"
          message={successMsg}
          onClose={() => setSuccessMsg('')}
        />
      )}

      {errorMsg && (
        <NotificationBanner
          type="danger"
          message={errorMsg}
          onClose={() => setErrorMsg('')}
        />
      )}

      <div className="card">
        {/* Profile Card Header */}
        <div style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff', padding: '2rem 1.5rem', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 700, margin: '0 auto 0.75rem', border: '2px solid rgba(255,255,255,0.3)' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.25rem' }}>{user?.name}</h3>
          <span style={{ fontSize: 'var(--font-size-xs)', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem', display: 'inline-block' }}>
            Role: <strong>{user?.role}</strong> &bull; User ID: <strong>{user?.userId}</strong>
          </span>
        </div>

        <div className="card-body">
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-userId">
                Citizen ID (Immutable)
              </label>
              <input
                type="text"
                id="profile-userId"
                className="form-control"
                value={user?.userId || ''}
                disabled
                style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
              />
              <span className="form-hint">Unique identification generated upon official registration.</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">
                Registered Email (Immutable)
              </label>
              <input
                type="email"
                id="profile-email"
                className="form-control"
                value={user?.email || ''}
                disabled
                style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
              />
              <span className="form-hint">Email is linked to application alerts and cannot be altered online.</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="profile-name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '1.5rem 0' }} />

            <h4 style={{ fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Change Password (Optional)
            </h4>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-newpass">
                New Password
              </label>
              <input
                type="password"
                id="profile-newpass"
                className="form-control"
                placeholder="Leave blank to keep existing password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            {newPassword && (
              <div className="form-group">
                <label className="form-label" htmlFor="profile-confirmpass">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="profile-confirmpass"
                  className="form-control"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Saving Changes...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
