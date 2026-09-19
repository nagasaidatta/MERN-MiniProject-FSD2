import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { schemeService } from '../services/schemeService';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationBanner from '../components/NotificationBanner';
import '../styles/schemes.css';

const SchemeDetails = () => {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { isAuthenticated, isCitizen } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await schemeService.getSchemeById(id);
        if (res.success && res.scheme) {
          setScheme(res.scheme);
        }
      } catch (err) {
        console.error('Error fetching scheme details:', err);
        setError(err.message || 'Scheme details could not be found.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleApplyNow = () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: location,
          message: `Please log in to apply for ${scheme.schemeName}.`
        }
      });
      return;
    }

    if (!isCitizen) {
      alert('Only registered citizens can apply for welfare schemes.');
      return;
    }

    navigate(`/apply/${scheme.schemeId}`);
  };

  if (loading) {
    return (
      <div className="container page-wrapper">
        <LoadingSpinner text="Retrieving official scheme guidelines..." />
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="container page-wrapper">
        <NotificationBanner type="danger" message={error || 'Scheme not found.'} />
        <div style={{ marginTop: '1rem' }}>
          <Link to="/schemes" className="btn btn-outline btn-sm">
            ← Back to All Schemes
          </Link>
        </div>
      </div>
    );
  }

  const isActive = scheme.schemeStatus === 'Active';

  return (
    <div className="container page-wrapper">
      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '1.5rem', fontSize: 'var(--font-size-sm)' }}>
        <Link to="/schemes" style={{ color: 'var(--color-text-muted)' }}>
          Schemes
        </Link>
        <span style={{ margin: '0 0.5rem', color: 'var(--color-border-dark)' }}>/</span>
        <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
          {scheme.schemeId}
        </span>
      </div>

      <div className="scheme-details-container">
        <div className="scheme-details-hero">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span className="badge badge-category" style={{ fontSize: '0.85rem' }}>
              {scheme.schemeCategory}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="scheme-id-tag" style={{ fontSize: '0.85rem' }}>
                ID: {scheme.schemeId}
              </span>
              <StatusBadge status={scheme.schemeStatus} />
            </div>
          </div>

          <h1 className="scheme-details-title">{scheme.schemeName}</h1>

          {/* Quick Metrics highlight card */}
          <div className="details-highlight-card">
            <div>
              <span className="scheme-meta-label">Benefit Grant Value</span>
              <span className="scheme-meta-value benefit" style={{ fontSize: '1.2rem' }}>
                {scheme.benefitAmount}
              </span>
            </div>
            <div>
              <span className="scheme-meta-label">Application Deadline</span>
              <span className="scheme-meta-value" style={{ fontSize: '1.2rem' }}>
                {scheme.lastDate}
              </span>
            </div>
            <div>
              <span className="scheme-meta-label">Application Mode</span>
              <span className="scheme-meta-value" style={{ fontSize: '1.2rem', color: 'var(--color-accent)' }}>
                100% Online
              </span>
            </div>
          </div>

          {/* Detailed Eligibility Section */}
          <div className="details-block">
            <h3 className="details-block-title">
              <span>📋</span> Eligibility Criteria & Requirements
            </h3>
            <div className="details-block-content" style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-accent)' }}>
              {scheme.eligibility}
            </div>
          </div>

          {/* Application Guidance */}
          <div className="details-block">
            <h3 className="details-block-title">
              <span>ℹ️</span> Submission Instructions
            </h3>
            <p className="details-block-content">
              Applicants must ensure their personal identification and banking details match official government records. Once submitted, your application will receive a unique Application Tracking ID and will be reviewed by the respective nodal welfare officer.
            </p>
          </div>

          {/* Call to action */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/schemes" className="btn btn-outline">
              ← Return to Scheme List
            </Link>

            <div>
              {!isActive && (
                <span style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)', marginRight: '1rem', fontWeight: 500 }}>
                  ⚠️ This scheme is currently closed for new applications.
                </span>
              )}
              <button
                onClick={handleApplyNow}
                disabled={!isActive}
                className="btn btn-primary btn-lg"
              >
                {isActive ? 'Apply for Scheme →' : 'Applications Closed'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetails;
