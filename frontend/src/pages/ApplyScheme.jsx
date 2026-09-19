import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { schemeService } from '../services/schemeService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationBanner from '../components/NotificationBanner';
import { CheckCircleIcon } from '../components/Icons';

const ApplyScheme = () => {
  const { schemeId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedApp, setSubmittedApp] = useState(null);
  const [declarationChecked, setDeclarationChecked] = useState(false);

  useEffect(() => {
    const fetchSchemeInfo = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await schemeService.getSchemeById(schemeId);
        if (res.success && res.scheme) {
          setScheme(res.scheme);
        }
      } catch (err) {
        console.error('Fetch scheme error:', err);
        setError(err.message || 'Unable to load scheme details.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchemeInfo();
  }, [schemeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!declarationChecked) {
      setError('You must certify the declaration before submitting your application.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await applicationService.applyScheme(scheme.schemeId);
      if (res.success && res.application) {
        setSubmittedApp(res.application);
      }
    } catch (err) {
      console.error('Apply scheme error:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container page-wrapper">
        <LoadingSpinner text="Preparing digital application form..." />
      </div>
    );
  }

  if (error && !scheme) {
    return (
      <div className="container page-wrapper">
        <NotificationBanner type="danger" message={error} />
        <Link to="/schemes" className="btn btn-outline btn-sm">
          ← Return to Schemes
        </Link>
      </div>
    );
  }

  return (
    <div className="container page-wrapper" style={{ maxWidth: '680px' }}>
      {/* Success View after submission */}
      {submittedApp ? (
        <div className="card" style={{ borderTop: '4px solid var(--color-success)', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5',
            color: 'var(--color-success)',
            marginBottom: '1rem'
          }}>
            <CheckCircleIcon size={36} color="var(--color-success)" />
          </div>
          <h2 style={{ color: 'var(--color-success-text)', marginBottom: '0.5rem' }}>
            Application Submitted Successfully
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto 1.75rem' }}>
            Your welfare application has been logged into the central government registry and assigned for administrative verification.
          </p>

          <div style={{ background: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'left', maxWidth: '440px', margin: '0 auto 2rem' }}>
            <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="scheme-meta-label">Application ID:</span>
              <strong style={{ fontFamily: 'monospace', color: 'var(--color-primary)', fontSize: '1.1rem' }}>
                {submittedApp.applicationId}
              </strong>
            </div>

            <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="scheme-meta-label">Government Scheme:</span>
              <strong style={{ color: 'var(--color-text-primary)' }}>
                {submittedApp.schemeName || scheme?.schemeName}
              </strong>
            </div>

            <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="scheme-meta-label">Applicant ID:</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>{user?.userId}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="scheme-meta-label">Current Status:</span>
              <StatusBadge status={submittedApp.applicationStatus || 'Pending'} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/my-applications" className="btn btn-primary btn-lg">
              Go to My Applications →
            </Link>
            <Link to="/schemes" className="btn btn-outline btn-lg">
              Explore More Schemes
            </Link>
          </div>
        </div>
      ) : (
        /* Application Form View */
        <div className="card">
          <div className="card-header" style={{ backgroundColor: '#fafbfd' }}>
            <span className="badge badge-category" style={{ marginBottom: '0.5rem' }}>
              {scheme?.schemeCategory}
            </span>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-primary)' }}>
              Application for {scheme?.schemeName}
            </h2>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.25rem' }}>
              Official Scheme ID: <strong>{scheme?.schemeId}</strong> &bull; Sanctioned Benefit: <strong>{scheme?.benefitAmount}</strong>
            </span>
          </div>

          <div className="card-body">
            {error && (
              <NotificationBanner
                type="danger"
                message={error}
                onClose={() => setError('')}
              />
            )}

            <form onSubmit={handleSubmit}>
              {/* Applicant Identity Card */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  Citizen Beneficiary Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: 'var(--font-size-sm)' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 'var(--font-size-xs)' }}>
                      Full Name
                    </span>
                    <strong>{user?.name}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 'var(--font-size-xs)' }}>
                      Registered Email
                    </span>
                    <strong>{user?.email}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 'var(--font-size-xs)' }}>
                      Citizen ID
                    </span>
                    <code>{user?.userId}</code>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 'var(--font-size-xs)' }}>
                      Application Date
                    </span>
                    <span>{new Date().toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Eligibility Confirmation Notice */}
              <div style={{ border: '1px solid #bfdbfe', background: '#eff6ff', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem', fontSize: 'var(--font-size-sm)' }}>
                <strong style={{ color: '#1e40af', display: 'block', marginBottom: '0.25rem' }}>
                  Scheme Eligibility Requirement:
                </strong>
                <p style={{ margin: 0, color: '#1e3a8a' }}>
                  {scheme?.eligibility}
                </p>
              </div>

              {/* Citizen Declaration Checkbox */}
              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={declarationChecked}
                    onChange={(e) => setDeclarationChecked(e.target.checked)}
                    style={{ marginTop: '0.25rem', width: '16px', height: '16px', cursor: 'pointer' }}
                    required
                  />
                  <span>
                    I hereby solemnly declare that I fulfill all the stipulated eligibility criteria for <strong>{scheme?.schemeName}</strong> and that all details provided in my citizen profile are true and correct.
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || !declarationChecked}
                >
                  {submitting ? 'Submitting Application...' : 'Submit Application Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyScheme;
