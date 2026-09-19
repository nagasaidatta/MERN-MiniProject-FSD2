import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationBanner from '../components/NotificationBanner';
import Modal from '../components/Modal';
import { FileTextIcon } from '../components/Icons';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Status Action Modal
  const [statusAction, setStatusAction] = useState({
    isOpen: false,
    app: null,
    newStatus: '',
    loading: false
  });

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async (searchTerm = search) => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await applicationService.getApplications(params);
      if (res.success && res.applications) {
        setApplications(res.applications);
      }
    } catch (err) {
      console.error('Fetch admin applications error:', err);
      setError('Failed to fetch applications queue.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplications(search);
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

      setSuccessMsg(res.message || `Application marked as ${statusAction.newStatus}.`);
      setStatusAction({ isOpen: false, app: null, newStatus: '', loading: false });
      await fetchApplications();
    } catch (err) {
      setError(err.message || 'Status update failed.');
      setStatusAction((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Citizen Applications Queue</h1>
          <p className="page-subtitle">
            Review, verify eligibility, and adjudicate pending citizen welfare applications.
          </p>
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

      {/* Filter and Search Bar */}
      <div className="filters-bar">
        <form onSubmit={handleSearchSubmit} className="search-input-wrapper" style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Citizen Name, Email, or Application ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Filter
          </button>
        </form>

        <div className="filter-select">
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by Status"
          >
            <option value="All">Status: All</option>
            <option value="Pending">Status: Pending</option>
            <option value="Approved">Status: Approved</option>
            <option value="Rejected">Status: Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <LoadingSpinner text="Retrieving applications..." />
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileTextIcon size={40} color="var(--color-text-muted)" />
          </div>
          <h3 className="empty-state-title">No Applications Found</h3>
          <p className="empty-state-text">
            No applications matched the specified status or search criteria.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Citizen Details</th>
                <th>Government Scheme</th>
                <th>Submission Date</th>
                <th>Status</th>
                <th>Adjudication Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.applicationId}>
                  <td>
                    <code style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                      {app.applicationId}
                    </code>
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

      {/* Confirmation Modal */}
      <Modal
        isOpen={statusAction.isOpen}
        title={`Adjudicate Application: ${statusAction.newStatus}`}
        onClose={() => setStatusAction({ isOpen: false, app: null, newStatus: '', loading: false })}
        onConfirm={handleStatusConfirm}
        confirmText={`Confirm ${statusAction.newStatus}`}
        confirmVariant={statusAction.newStatus === 'Approved' ? 'success' : 'danger'}
        isLoading={statusAction.loading}
      >
        <p>
          Confirm status transition for Application <strong>{statusAction.app?.applicationId}</strong> (Citizen: <strong>{statusAction.app?.citizen?.name}</strong>) to:
        </p>
        <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', margin: '0.75rem 0', textAlign: 'center' }}>
          <StatusBadge status={statusAction.newStatus} />
        </div>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          The applicant will immediately see this updated status in their portal dashboard.
        </p>
      </Modal>
    </div>
  );
};

export default AdminApplications;
