import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const SchemeCard = ({ scheme, onApply }) => {
  const {
    schemeId,
    schemeName,
    schemeCategory,
    eligibility,
    benefitAmount,
    lastDate,
    schemeStatus
  } = scheme;

  const isActive = schemeStatus === 'Active';

  return (
    <div className="card card-hover scheme-card">
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Top bar with category and schemeId */}
        <div className="scheme-card-header">
          <span className="badge badge-category">{schemeCategory}</span>
          <span className="scheme-id-tag">{schemeId}</span>
        </div>

        {/* Scheme Name */}
        <h3 className="scheme-card-title">{schemeName}</h3>

        {/* Eligibility excerpt */}
        <p className="scheme-card-eligibility" title={eligibility}>
          {eligibility}
        </p>

        {/* Meta details */}
        <div className="scheme-meta-grid">
          <div>
            <span className="scheme-meta-label">Benefit Value</span>
            <span className="scheme-meta-value benefit">{benefitAmount}</span>
          </div>
          <div>
            <span className="scheme-meta-label">Last Date</span>
            <span className="scheme-meta-value">{lastDate}</span>
          </div>
        </div>

        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="scheme-meta-label">Status</span>
          <StatusBadge status={schemeStatus} />
        </div>

        {/* Actions */}
        <div className="scheme-card-actions">
          <Link to={`/schemes/${schemeId}`} className="btn btn-outline btn-sm">
            View Details
          </Link>
          <button
            onClick={() => onApply && onApply(scheme)}
            disabled={!isActive}
            className="btn btn-primary btn-sm"
          >
            {isActive ? 'Apply Now' : 'Closed'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchemeCard;
