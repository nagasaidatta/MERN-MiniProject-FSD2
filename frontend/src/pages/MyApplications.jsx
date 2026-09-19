import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationBanner from '../components/NotificationBanner';
import Modal from '../components/Modal';
import { FileTextIcon } from '../components/Icons';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Cancel modal state
  const [selectedApp, setSelectedApp] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchMyApplications();
  }, [statusFilter]);

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter !== 'All') {
        params.status = statusFilter;
      }
      const res = await applicationService.getApplications(params);
      if (res.success && res.applications) {
        setApplications(res.applications);
      }
    } catch (err) {
      console.error('Error fetching citizen applications:', err);
      setError('Failed to fetch your applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!selectedApp) return;

    try {
      setCancelling(true);
      const res = await applicationService.cancelApplication(selectedApp.applicationId);
      setSuccessMsg(res.message || 'Application cancelled successfully.');
      setSelectedApp(null);
      await fetchMyApplications();
    } catch (err) {
      setError(err.message || 'Failed to cancel application.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Applications Tracker</h1>
          <p className="page-subtitle">
            Track real-time status and historical submissions for government welfare benefits.
          </p>
        </div>
        <Link to="/schemes" className="btn btn-primary btn-sm">
          + Apply for New Scheme
        </Link>
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

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`btn btn-sm ${statusFilter === status ? 'btn-secondary' : 'btn-outline'}`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving your applications..." />
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileTextIcon size={40} color="var(--color-text-muted)" />
          </div>
          <h3 className="empty-state-title">No Applications Found</h3>
          <p className="empty-state-text">
            {statusFilter === 'All'
              ? 'You have not submitted any government welfare applications yet.'
              : `You have no applications currently marked as '${statusFilter}'.`}
          </p>
          <Link to="/schemes" className="btn btn-primary btn-sm">
            Discover Eligible Schemes
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
              {applications.map((app) => (
                <tr key={app.applicationId}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {app.applicationId}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                      {app.scheme?.schemeName || app.schemeId}
                    </div>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      Sanctioned Aid: {app.scheme?.benefitAmount || 'Direct Benefit'}
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
                        View Details
                      </Link>
                      {app.applicationStatus === 'Pending' && (
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="btn btn-danger btn-sm"
                          title="Cancel this pending application"
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

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!selectedApp}
        title="Cancel Application Confirmation"
        onClose={() => setSelectedApp(null)}
        onConfirm={handleConfirmCancel}
        confirmText="Yes, Cancel Application"
        cancelText="Close"
        confirmVariant="danger"
        isLoading={cancelling}
      >
        <p>
          Are you sure you want to cancel application <strong>{selectedApp?.applicationId}</strong> for{' '}
          <strong>{selectedApp?.scheme?.schemeName || selectedApp?.schemeId}</strong>?
        </p>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)', marginTop: '0.5rem' }}>
          This cancellation will immediately revoke this application from officer review.
        </p>
      </Modal>
    </div>
  );
};

export default MyApplications;
