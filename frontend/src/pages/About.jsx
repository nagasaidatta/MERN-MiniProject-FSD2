import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container page-wrapper" style={{ maxWidth: '850px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">About the Government Scheme Beneficiary Portal</h1>
          <p className="page-subtitle">Centralized Digital Public Infrastructure for Welfare Disbursement</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-body">
          <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Our Mission</h3>
          <p>
            The <strong>Government Scheme Beneficiary Portal</strong> is a unified, transparent e-governance platform designed to connect citizens directly with public welfare initiatives. Built as digital public infrastructure, the portal streamlines scheme discovery, eligibility assessment, online application submission, and transparent departmental verification.
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '1.5rem 0' }} />

          <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Core System Capabilities</h3>
          <div className="grid-2" style={{ gap: '1rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-accent)' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>Citizen Welfare Delivery</h4>
              <p style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                Instant digital application submission, elimination of physical paperwork, unique tracking identifiers, and real-time status visibility.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-success)' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>Accountable Governance</h4>
              <p style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                Role-based administrative control, verification queues, anti-duplicate application filters, and immutable audit timestamps.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-warning)' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>Demographic Reach</h4>
              <p style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                Categorized support across Students, Farmers, Senior Citizens, Women Entrepreneurs, and Economically Weaker Sections (EWS).
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-primary)' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>Telemetry & Reporting</h4>
              <p style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                MongoDB aggregation pipelines evaluating scheme uptake, approval velocities, and beneficiary rolls without third-party analytical dependencies.
              </p>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '1.5rem 0' }} />

          <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Security & Privacy Principles</h3>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.8 }}>
            <li>Passphrase hashing using salt rounds (bcrypt) prevents credential tampering.</li>
            <li>Cryptographic JSON Web Token (JWT) sessions enforce strict stateless role authorization.</li>
            <li>Database isolation using MongoDB Atlas with schema-level validation rules and dedicated indexes.</li>
            <li>Sanitized RESTful API endpoints preventing unauthorized privilege escalation.</li>
          </ul>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link to="/schemes" className="btn btn-primary btn-lg">
              Explore Active Welfare Schemes →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
