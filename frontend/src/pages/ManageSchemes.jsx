import React, { useState, useEffect } from 'react';
import { schemeService } from '../services/schemeService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationBanner from '../components/NotificationBanner';
import Modal from '../components/Modal';
import { BuildingIcon, AlertTriangleIcon, PlusIcon } from '../components/Icons';

const CATEGORIES = [
  'Students',
  'Farmers',
  'Senior Citizens',
  'Women',
  'Economically Weaker Sections'
];

const emptySchemeForm = {
  schemeId: '',
  schemeName: '',
  schemeCategory: 'Students',
  eligibility: '',
  benefitAmount: '',
  lastDate: '',
  schemeStatus: 'Active'
};

const ManageSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add / Edit Modal state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(emptySchemeForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete Modal state
  const [deleteModalScheme, setDeleteModalScheme] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await schemeService.getSchemes();
      if (res.success && res.schemes) {
        setSchemes(res.schemes);
      }
    } catch (err) {
      console.error('Error fetching schemes for admin:', err);
      setError('Failed to fetch schemes registry.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      ...emptySchemeForm,
      schemeId: `SCH-${Math.floor(100 + Math.random() * 900)}`
    });
    setFormErrors({});
    setFormModalOpen(true);
  };

  const openEditModal = (scheme) => {
    setIsEditing(true);
    setFormData({
      schemeId: scheme.schemeId,
      schemeName: scheme.schemeName,
      schemeCategory: scheme.schemeCategory,
      eligibility: scheme.eligibility,
      benefitAmount: scheme.benefitAmount,
      lastDate: scheme.lastDate,
      schemeStatus: scheme.schemeStatus
    });
    setFormErrors({});
    setFormModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.schemeName.trim()) errs.schemeName = 'Scheme name is required.';
    if (!formData.schemeCategory.trim()) errs.schemeCategory = 'Category is required.';
    if (!formData.eligibility.trim()) errs.eligibility = 'Eligibility criteria is required.';
    if (!formData.benefitAmount.trim()) errs.benefitAmount = 'Benefit amount is required.';
    if (!formData.lastDate.trim()) errs.lastDate = 'Last date is required.';

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      if (isEditing) {
        await schemeService.updateScheme(formData.schemeId, formData);
        setSuccessMsg(`Scheme '${formData.schemeName}' updated successfully.`);
      } else {
        await schemeService.createScheme(formData);
        setSuccessMsg(`New Scheme '${formData.schemeName}' created successfully.`);
      }
      setFormModalOpen(false);
      await fetchSchemes();
    } catch (err) {
      setFormErrors((prev) => ({ ...prev, server: err.message || 'Operation failed.' }));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalScheme) return;

    try {
      setDeleting(true);
      await schemeService.deleteScheme(deleteModalScheme.schemeId);
      setSuccessMsg(`Scheme '${deleteModalScheme.schemeName}' was deleted.`);
      setDeleteModalScheme(null);
      await fetchSchemes();
    } catch (err) {
      setError(err.message || 'Failed to delete scheme.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Government Schemes</h1>
          <p className="page-subtitle">Add, update, or decommission public welfare programs</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <PlusIcon size={16} /> Add New Scheme
        </button>
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

      {loading ? (
        <LoadingSpinner text="Retrieving schemes inventory..." />
      ) : schemes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BuildingIcon size={40} color="var(--color-text-muted)" />
          </div>
          <h3 className="empty-state-title">No Schemes in Registry</h3>
          <p className="empty-state-text">
            Add the first government welfare scheme to the central portal registry.
          </p>
          <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <PlusIcon size={16} /> Add Scheme Now
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Scheme ID</th>
                <th>Scheme Name</th>
                <th>Category</th>
                <th>Benefit Grant</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schemes.map((scheme) => (
                <tr key={scheme.schemeId}>
                  <td>
                    <code style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                      {scheme.schemeId}
                    </code>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                      {scheme.schemeName}
                    </div>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {scheme.eligibility}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-category">
                      {scheme.schemeCategory}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--color-success)' }}>
                      {scheme.benefitAmount}
                    </strong>
                  </td>
                  <td>{scheme.lastDate}</td>
                  <td>
                    <StatusBadge status={scheme.schemeStatus} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => openEditModal(scheme)}
                        className="btn btn-outline btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteModalScheme(scheme)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Scheme Modal Form */}
      <Modal
        isOpen={formModalOpen}
        title={isEditing ? `Edit Scheme: ${formData.schemeId}` : 'Add New Government Scheme'}
        onClose={() => setFormModalOpen(false)}
        isLoading={saving}
      >
        {formErrors.server && (
          <NotificationBanner type="danger" message={formErrors.server} />
        )}

        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="scheme-id-input">
              Scheme ID <span className="required">*</span>
            </label>
            <input
              type="text"
              id="scheme-id-input"
              className="form-control"
              value={formData.schemeId}
              onChange={(e) => setFormData({ ...formData, schemeId: e.target.value })}
              disabled={isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="scheme-name-input">
              Scheme Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="scheme-name-input"
              className="form-control"
              placeholder="e.g. National Farmer Solar Subsidy"
              value={formData.schemeName}
              onChange={(e) => setFormData({ ...formData, schemeName: e.target.value })}
              required
            />
            {formErrors.schemeName && <span className="form-error">{formErrors.schemeName}</span>}
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="scheme-category-select">
                Target Category <span className="required">*</span>
              </label>
              <select
                id="scheme-category-select"
                className="form-control"
                value={formData.schemeCategory}
                onChange={(e) => setFormData({ ...formData, schemeCategory: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="scheme-status-select">
                Scheme Status <span className="required">*</span>
              </label>
              <select
                id="scheme-status-select"
                className="form-control"
                value={formData.schemeStatus}
                onChange={(e) => setFormData({ ...formData, schemeStatus: e.target.value })}
              >
                <option value="Active">Active (Accepting Applications)</option>
                <option value="Inactive">Inactive (Closed)</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="benefit-amount-input">
                Sanctioned Benefit Value <span className="required">*</span>
              </label>
              <input
                type="text"
                id="benefit-amount-input"
                className="form-control"
                placeholder="e.g. ₹50,000 / year"
                value={formData.benefitAmount}
                onChange={(e) => setFormData({ ...formData, benefitAmount: e.target.value })}
                required
              />
              {formErrors.benefitAmount && <span className="form-error">{formErrors.benefitAmount}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="last-date-input">
                Application Deadline <span className="required">*</span>
              </label>
              <input
                type="date"
                id="last-date-input"
                className="form-control"
                value={formData.lastDate}
                onChange={(e) => setFormData({ ...formData, lastDate: e.target.value })}
                required
              />
              {formErrors.lastDate && <span className="form-error">{formErrors.lastDate}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="eligibility-input">
              Eligibility Guidelines <span className="required">*</span>
            </label>
            <textarea
              id="eligibility-input"
              className="form-control"
              rows="3"
              placeholder="State clear applicant eligibility conditions..."
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              required
            ></textarea>
            {formErrors.eligibility && <span className="form-error">{formErrors.eligibility}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setFormModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={saving}
            >
              {saving ? 'Saving Scheme...' : isEditing ? 'Save Changes' : 'Create Scheme'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteModalScheme}
        title="Confirm Scheme Deletion"
        onClose={() => setDeleteModalScheme(null)}
        onConfirm={handleDeleteConfirm}
        confirmText="Yes, Delete Scheme"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={deleting}
      >
        <p>
          Are you sure you want to permanently delete scheme{' '}
          <strong>{deleteModalScheme?.schemeName}</strong> (<code>{deleteModalScheme?.schemeId}</code>)?
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-danger)',
          marginTop: '0.75rem',
          padding: '0.5rem 0.75rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: 'var(--radius-sm)'
        }}>
          <AlertTriangleIcon size={16} color="var(--color-danger)" />
          <span>This will remove the scheme from citizen listings. Existing applications referencing this scheme will remain archived.</span>
        </div>
      </Modal>
    </div>
  );
};

export default ManageSchemes;
