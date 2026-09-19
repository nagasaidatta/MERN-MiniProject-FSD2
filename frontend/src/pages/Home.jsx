import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { schemeService } from '../services/schemeService';
import { reportService } from '../services/reportService';
import { useAuth } from '../context/AuthContext';
import SchemeCard from '../components/SchemeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationBanner from '../components/NotificationBanner';
import { ShieldIcon, BuildingIcon } from '../components/Icons';
import '../styles/home.css';
import '../styles/schemes.css';

const Home = () => {
  const [stats, setStats] = useState({
    availableSchemes: 8,
    applicationsSubmitted: 24,
    applicationsApproved: 18,
    citizensServed: 42
  });
  const [featuredSchemes, setFeaturedSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, isCitizen } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Fetch public statistics
        const [statsRes, schemesRes] = await Promise.allSettled([
          reportService.getPublicStats(),
          schemeService.getSchemes({ status: 'Active' })
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value?.stats) {
          setStats(statsRes.value.stats);
        }

        if (schemesRes.status === 'fulfilled' && schemesRes.value?.schemes) {
          // Take top 3-4 featured schemes
          setFeaturedSchemes(schemesRes.value.schemes.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Failed to load real-time portal statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleApplyClick = (scheme) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: `Please log in to apply for ${scheme.schemeName}.` } });
    } else if (isCitizen) {
      navigate(`/apply/${scheme.schemeId}`);
    } else {
      navigate('/schemes');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-pill">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldIcon size={15} color="var(--color-accent)" />
              National Citizen Welfare Gateway
            </span>
          </div>
          <h1 className="hero-title">
            Access Government Schemes, <span>Simply.</span>
          </h1>
          <p className="hero-subtitle">
            A centralized digital portal where citizens can discover eligible welfare schemes, submit online applications with ease, and track live verification statuses from a single transparent platform.
          </p>
          <div className="hero-actions">
            <Link to="/schemes" className="btn btn-primary btn-lg">
              Explore Schemes →
            </Link>
            {!isAuthenticated && (
              <Link to="/login" className="btn btn-outline-light btn-lg">
                Citizen Login / Register
              </Link>
            )}
            {isAuthenticated && (
              <Link to={isCitizen ? "/citizen/dashboard" : "/admin/dashboard"} className="btn btn-outline-light btn-lg">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Dynamic Statistics Bar */}
      <div className="container">
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.availableSchemes}</div>
              <div className="stat-label">Available Schemes</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.applicationsSubmitted}</div>
              <div className="stat-label">Applications Submitted</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.applicationsApproved}</div>
              <div className="stat-label">Applications Approved</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.citizensServed}</div>
              <div className="stat-label">Citizens Served</div>
            </div>
          </div>
        </section>
      </div>

      {/* Featured Schemes Section */}
      <section className="container" style={{ marginBottom: '4.5rem' }}>
        <div className="section-header">
          <div className="section-tag">Direct Benefit Programs</div>
          <h2 className="section-title">Featured Government Schemes</h2>
          <p className="section-desc">
            Explore active public welfare programs offering direct financial aid, educational scholarships, and healthcare subsidies.
          </p>
        </div>

        {error && <NotificationBanner type="danger" message={error} />}

        {loading ? (
          <LoadingSpinner text="Fetching active schemes from database..." />
        ) : (
          <>
            <div className="schemes-grid">
              {featuredSchemes.map((scheme) => (
                <SchemeCard
                  key={scheme.schemeId}
                  scheme={scheme}
                  onApply={handleApplyClick}
                />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link to="/schemes" className="btn btn-secondary">
                View All Government Schemes ({stats.availableSchemes}) →
              </Link>
            </div>
          </>
        )}
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Simplified Process</div>
            <h2 className="section-title">How It Works</h2>
            <p className="section-desc">
              Four streamlined steps designed to deliver welfare benefits directly to deserving beneficiaries.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h4 className="step-title">Register</h4>
              <p className="step-desc">
                Create a verified citizen account with your email and basic details in under 2 minutes.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h4 className="step-title">Find a Scheme</h4>
              <p className="step-desc">
                Search schemes categorized by students, farmers, women, senior citizens, and EWS groups.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h4 className="step-title">Apply Online</h4>
              <p className="step-desc">
                Review eligibility criteria and submit your digital application directly through the portal.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h4 className="step-title">Track Status</h4>
              <p className="step-desc">
                Monitor live review updates from Pending to Approved with immediate status transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <section className="container trust-section">
        <div className="trust-box">
          <div className="trust-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BuildingIcon size={32} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="trust-title">Centralized & Accountable Public Service Delivery</h3>
            <p className="trust-text">
              The Government Scheme Beneficiary Portal provides direct access to state and central welfare initiatives. Every application is tracked via unique tracking IDs, ensuring administrative accountability, zero unauthorized intermediaries, and expedited benefit disbursement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
