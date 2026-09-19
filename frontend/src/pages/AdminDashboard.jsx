import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import { applicationService } from '../services/applicationService';
import DashboardCard from '../components/DashboardCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationBanner from '../components/NotificationBanner';
import Modal from '../components/Modal';
import {
  UsersIcon,
  BuildingIcon,
  FileTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  BarChartIcon,
  PlusIcon
} from '../components/Icons';
import '../styles/dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Status modification confirmation modal
  const [statusAction, setStatusAction] = useState({
    isOpen: false,
    app: null,
    newStatus: '',
    loading: false
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [summaryRes, appsRes] = await Promise.all([
        reportService.getReportSummary(),
        applicationService.getApplications()
      ]);

      if (summaryRes.success && summaryRes.summary) {
        setSummary(summaryRes.summary);
      }

      if (appsRes.success && appsRes.applications) {
        setRecentApplications(appsRes.applications.slice(0, 6));
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      setError('Failed to load administrative portal telemetry.');
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (app, newStatus) => {
    setStatusAction({
      isOpen: true,
      app,
      newStatus,
      loading: false
    });
  };

  const handleStatusConfirm = async () => {
    if (!statusAction.app || !statusAction.newStatus) return;

    try {
      setStatusAction((prev) => ({ ...prev, loading: true }));
      const res = await applicationService.updateApplicationStatus(
        statusAction.app.applicationId,
        statusAction.newStatus
      );

      setFeedback({
        type: 'success',
        message: res.message || `Application status updated to ${statusAction.newStatus}.`
      });

      setStatusAction({ isOpen: false, app: null, newStatus: '', loading: false });
      await fetchDashboardData();
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.message || 'Failed to update application status.'
      });
      setStatusAction((prev) => ({ ...prev, loading: false }));
    }
  };

  if (loading) {
    return (
      <div className="container page-wrapper">
        <LoadingSpinner text="Loading Administrative Governance Console..." />
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      {/* Admin Welcome Header */}
      <div className="dashboard-welcome">
        <div>
          <h2>Government Administrative Console</h2>
          <p>
            Logged in as <strong>{user?.name}</strong> &bull; Super Admin Clearance &bull; ID: <code>{user?.userId}</code>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/schemes" className="btn btn-white" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <PlusIcon size={16} /> Create New Scheme
          </Link>
          <Link to="/admin/reports" className="btn btn-outline-light" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <BarChartIcon size={16} /> View Reports
          </Link>
        </div>
      </div>

      {feedback.message && (
        <NotificationBanner
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback({ type: '', message: '' })}
        />
      )}

      {error && <NotificationBanner type="danger" message={error} />}

      {/* 6 Macro Overview Cards */}
      <div className="metrics-grid">
        <DashboardCard
          title="Total Citizens"
          value={summary?.totalCitizens || 0}
          caption="Registered citizens"
          icon={<UsersIcon size={20} />}
          color="blue"
        />
        <DashboardCard
          title="Total Schemes"
          value={summary?.totalSchemes || 0}
          caption="Active welfare programs"
          icon={<BuildingIcon size={20} />}
          color="blue"
        />
        <DashboardCard
          title="Total Applications"
          value={summary?.totalApplications || 0}
          caption="Submitted claims"
          icon={<FileTextIcon size={20} />}
          color="blue"
        />
        <DashboardCard
          title="Approved Benefits"
          value={summary?.statusCounts?.Approved || 0}
          caption="Sanctioned beneficiaries"
          icon={<CheckCircleIcon size={20} />}
          color="green"
        />
        <DashboardCard
          title="Pending Applications"
          value={summary?.statusCounts?.Pending || 0}
          caption="Awaiting departmental review"
          icon={<ClockIcon size={20} />}
          color="amber"
        />
        <DashboardCard
          title="Rejected Applications"
          value={summary?.statusCounts?.Rejected || 0}
          caption="Ineligible submissions"
          icon={<XCircleIcon size={20} />}
          color="red"
        />
      </div>

      {/* Recent Applications Management Table */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h3 className="dashboard-section-title">Recent Citizen Submissions</h3>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Direct application queue with one-click administrative verification
            </span>
          </div>
          <Link to="/admin/applications" className="btn btn-outline btn-sm">
            View All Applications Queue →
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileTextIcon size={40} color="var(--color-text-muted)" />
            </div>
            <h4 className="empty-state-title">No Applications Found</h4>
            <p className="empty-state-text">No citizen applications have been received yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Citizen Applicant</th>
                  <th>Government Scheme</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th>Administrative Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app) => (
                  <tr key={app.applicationId}>
                    <td>
                      <strong style={{ fontFamily: 'monospace', color: 'var(--color-primary)' }}>
                        {app.applicationId}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.citizen?.name || 'Citizen'}</div>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                        {app.citizen?.email || app.citizenId}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.scheme?.schemeName || app.schemeId}</div>
                      <span className="badge badge-category" style={{ fontSize: '0.65rem' }}>
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
                        {app.applicationStatus !== 'Approved' && (
                          <button
                            onClick={() => openStatusModal(app, 'Approved')}
                            className="btn btn-success btn-sm"
                          >
                            Approve
                          </button>
                        )}
                        {app.applicationStatus !== 'Rejected' && (
                          <button
                            onClick={() => openStatusModal(app, 'Rejected')}
                            className="btn btn-danger btn-sm"
                          >
                            Reject
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

      {/* Confirmation Modal for Approve / Reject */}
      <Modal
        isOpen={statusAction.isOpen}
        title={`Confirm Application ${statusAction.newStatus}`}
        onClose={() => setStatusAction({ isOpen: false, app: null, newStatus: '', loading: false })}
        onConfirm={handleStatusConfirm}
        confirmText={`Confirm ${statusAction.newStatus}`}
        confirmVariant={statusAction.newStatus === 'Approved' ? 'success' : 'danger'}
        isLoading={statusAction.loading}
      >
        <p>
          Are you sure you want to mark application{' '}
          <strong>{statusAction.app?.applicationId}</strong> submitted by{' '}
          <strong>{statusAction.app?.citizen?.name || statusAction.app?.citizenId}</strong> as{' '}
          <strong style={{ color: statusAction.newStatus === 'Approved' ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {statusAction.newStatus}
          </strong>?
        </p>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          This will immediately update the citizen's application tracker and sanctioning reports.
        </p>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
