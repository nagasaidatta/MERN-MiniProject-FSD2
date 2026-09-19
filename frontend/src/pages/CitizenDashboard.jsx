import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import DashboardCard from '../components/DashboardCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationBanner from '../components/NotificationBanner';
import Modal from '../components/Modal';
import { FileTextIcon, ClockIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon } from '../components/Icons';
import '../styles/dashboard.css';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Cancel application modal state
  const [cancelModalApp, setCancelModalApp] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchCitizenApplications();
  }, []);

  const fetchCitizenApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await applicationService.getApplications();
      if (res.success && res.applications) {
        setApplications(res.applications);
      }
    } catch (err) {
      console.error('Fetch citizen applications error:', err);
      setError('Unable to load your applications. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancelModalApp) return;

    try {
      setCancelling(true);
      const res = await applicationService.cancelApplication(cancelModalApp.applicationId);
      setSuccessMsg(res.message || 'Application cancelled successfully.');
      setCancelModalApp(null);
      await fetchCitizenApplications();
    } catch (err) {
      setError(err.message || 'Failed to cancel application.');
    } finally {
      setCancelling(false);
    }
  };

  // Compute status counts
  const totalApps = applications.length;
  const pendingApps = applications.filter((a) => a.applicationStatus === 'Pending').length;
  const approvedApps = applications.filter((a) => a.applicationStatus === 'Approved').length;
  const rejectedApps = applications.filter((a) => a.applicationStatus === 'Rejected').length;

  return (
    <div className="container page-wrapper">
      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <div>
          <h2>Welcome back, {user?.name}!</h2>
          <p>Citizen Beneficiary Dashboard &bull; ID: <strong>{user?.userId}</strong></p>
        </div>
        <div>
          <Link to="/schemes" className="btn btn-white btn-lg">
            Browse Government Schemes →
          </Link>
        </div>
      </div>

      {successMsg && (
        <NotificationBanner
          type="success"
          message={successMsg}
          onClose={() => setSuccessMsg('')}
        />
      )}

      {error && (
        <NotificationBanner
          type="danger"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {/* Metrics Overview Cards */}
      <div className="metrics-grid">
        <DashboardCard
          title="Total Applications"
          value={totalApps}
          caption="All submitted requests"
          icon={<FileTextIcon size={20} />}
          color="blue"
        />
        <DashboardCard
          title="Pending Verification"
          value={pendingApps}
          caption="Under department review"
          icon={<ClockIcon size={20} />}
          color="amber"
        />
        <DashboardCard
          title="Approved Benefits"
          value={approvedApps}
          caption="Sanctioned welfare grants"
          icon={<CheckCircleIcon size={20} />}
          color="green"
        />
        <DashboardCard
          title="Rejected / Ineligible"
          value={rejectedApps}
          caption="Did not meet guidelines"
          icon={<XCircleIcon size={20} />}
          color="red"
        />
      </div>

      {/* Recent Applications Section */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h3 className="dashboard-section-title">My Recent Applications</h3>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Real-time status tracking for your submitted welfare requests
            </span>
          </div>
          <Link to="/my-applications" className="btn btn-outline btn-sm">
            View All Applications →
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Retrieving your submitted applications..." />
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileTextIcon size={40} color="var(--color-text-muted)" />
            </div>
            <h4 className="empty-state-title">No Applications Found</h4>
            <p className="empty-state-text">
              You have not applied for any government schemes yet. Explore available welfare schemes to apply today.
            </p>
            <Link to="/schemes" className="btn btn-primary">
              Browse Available Schemes
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Government Scheme</th>
                  <th>Category</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.applicationId}>
                    <td>
                      <strong style={{ color: 'var(--color-primary)', fontFamily: 'monospace' }}>
                        {app.applicationId}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.scheme?.schemeName || app.schemeId}</div>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                        Benefit: {app.scheme?.benefitAmount || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-category">
                        {app.scheme?.schemeCategory || 'General'}
                      </span>
                    </td>
                    <td>
                      {new Date(app.applicationDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td>
                      <StatusBadge status={app.applicationStatus} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          to={`/schemes/${app.schemeId}`}
                          className="btn btn-outline btn-sm"
                        >
                          View Scheme
                        </Link>
                        {app.applicationStatus === 'Pending' && (
                          <button
                            onClick={() => setCancelModalApp(app)}
                            className="btn btn-danger btn-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Action Navigation Card */}
      <div className="card" style={{ padding: '1.5rem', background: '#fafbfd', border: '1px dashed var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4 style={{ margin: 0, color: 'var(--color-primary)' }}>Need to check your registered details?</h4>
            <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Keep your contact information updated to receive uninterrupted application notifications.
            </p>
          </div>
          <Link to="/profile" className="btn btn-outline btn-sm">
            Manage Profile
          </Link>
        </div>
      </div>

      {/* Confirmation Modal for Application Cancellation */}
      <Modal
        isOpen={!!cancelModalApp}
        title="Confirm Application Cancellation"
        onClose={() => setCancelModalApp(null)}
        onConfirm={handleCancelConfirm}
        confirmText="Yes, Cancel Application"
        cancelText="Keep Application"
        confirmVariant="danger"
        isLoading={cancelling}
      >
        <p>
          Are you sure you want to cancel your application for{' '}
          <strong>{cancelModalApp?.scheme?.schemeName || cancelModalApp?.schemeId}</strong>{' '}
          (Application ID: <code>{cancelModalApp?.applicationId}</code>)?
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          marginTop: '0.75rem',
          padding: '0.5rem 0.75rem',
          backgroundColor: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: 'var(--radius-sm)'
        }}>
          <AlertTriangleIcon size={16} color="var(--color-warning)" />
          <span>This action cannot be undone. A new application will be required if you reapply.</span>
        </div>
      </Modal>
    </div>
  );
};

export default CitizenDashboard;
