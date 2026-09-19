import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationBanner from '../components/NotificationBanner';

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await applicationService.getBeneficiaries();
      if (res.success && res.beneficiaries) {
        setBeneficiaries(res.beneficiaries);
      }
    } catch (err) {
      console.error('Fetch beneficiaries error:', err);
      setError('Failed to retrieve sanctioned beneficiary roll.');
    } finally {
      setLoading(false);
    }
  };

  const filteredBeneficiaries = beneficiaries.filter((b) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const citizenName = b.citizen?.name?.toLowerCase() || '';
    const citizenEmail = b.citizen?.email?.toLowerCase() || '';
    const schemeName = b.scheme?.schemeName?.toLowerCase() || '';
    const appId = b.applicationId?.toLowerCase() || '';
    return (
      citizenName.includes(term) ||
      citizenEmail.includes(term) ||
      schemeName.includes(term) ||
      appId.includes(term)
    );
  });

  return (
    <div className="container page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sanctioned Beneficiary Register</h1>
          <p className="page-subtitle">
            Official government ledger of citizens with sanctioned welfare grants and benefits.
          </p>
        </div>
      </div>

      {error && <NotificationBanner type="danger" message={error} />}

      {/* Search Bar */}
      <div className="filters-bar">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Search beneficiaries by citizen name, email, scheme, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          Total Beneficiaries: <strong>{filteredBeneficiaries.length}</strong>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving verified beneficiary register..." />
      ) : filteredBeneficiaries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3 className="empty-state-title">No Beneficiary Records</h3>
          <p className="empty-state-text">
            No approved citizen beneficiaries match the current criteria.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Beneficiary Citizen</th>
                <th>Citizen ID</th>
                <th>Sanctioned Scheme</th>
                <th>Category</th>
                <th>Benefit Disbursed / Value</th>
                <th>Sanction Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBeneficiaries.map((b) => (
                <tr key={b.applicationId}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                      {b.citizen?.name || 'Citizen'}
                    </div>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      {b.citizen?.email || b.citizenId}
                    </span>
                  </td>
                  <td>
                    <code>{b.citizenId}</code>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.scheme?.schemeName || b.schemeId}</div>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      App ID: {b.applicationId}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-category">
                      {b.scheme?.schemeCategory || 'General'}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--color-success)' }}>
                      {b.scheme?.benefitAmount || 'Direct Benefit'}
                    </strong>
                  </td>
                  <td>
                    {new Date(b.updatedAt || b.applicationDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td>
                    <span className="badge badge-approved">
                      <span className="badge-dot"></span>
                      Sanctioned
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Beneficiaries;
