import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { schemeService } from '../services/schemeService';
import { useAuth } from '../context/AuthContext';
import SchemeCard from '../components/SchemeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationBanner from '../components/NotificationBanner';
import { SearchIcon } from '../components/Icons';
import '../styles/schemes.css';

const CATEGORIES = [
  'All',
  'Students',
  'Farmers',
  'Senior Citizens',
  'Women',
  'Economically Weaker Sections'
];

const Schemes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState('All');

  const { isAuthenticated, isCitizen } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchemes();
  }, [category, status]);

  const fetchSchemes = async (searchTerm = search) => {
    try {
      setLoading(true);
      setError('');
      const params = {
        category,
        status,
        search: searchTerm
      };
      const res = await schemeService.getSchemes(params);
      if (res.success && res.schemes) {
        setSchemes(res.schemes);
      }
    } catch (err) {
      console.error('Error loading schemes:', err);
      setError('Failed to fetch government schemes from the central registry.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSchemes(search);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleApply = (scheme) => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { message: `Please sign in to apply for ${scheme.schemeName}.` }
      });
    } else if (isCitizen) {
      navigate(`/apply/${scheme.schemeId}`);
    } else {
      // If admin clicks apply, inform them
      alert('Administrators cannot submit citizen applications. Please use a citizen account.');
    }
  };

  return (
    <div className="container page-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Government Welfare Schemes</h1>
          <p className="page-subtitle">
            Browse, search, and apply for government assistance programs and direct financial benefits.
          </p>
        </div>
      </div>

      {error && <NotificationBanner type="danger" message={error} />}

      {/* Filter and Search Bar */}
      <div className="filters-bar">
        <form onSubmit={handleSearchSubmit} className="search-input-wrapper" style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by scheme name, keyword, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
        </form>

        {/* Category Filter */}
        <div className="filter-select">
          <select
            className="form-control"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            aria-label="Filter by category"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-select">
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="All">Status: All Schemes</option>
            <option value="Active">Status: Active Only</option>
            <option value="Inactive">Status: Closed / Inactive</option>
          </select>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <LoadingSpinner text="Querying schemes database..." />
      ) : schemes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SearchIcon size={40} color="var(--color-text-muted)" />
          </div>
          <h3 className="empty-state-title">No Government Schemes Found</h3>
          <p className="empty-state-text">
            No active schemes matched your search criteria. Try adjusting your keyword or category filter.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setStatus('All');
              fetchSchemes('');
            }}
            className="btn btn-outline btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{schemes.length}</strong> available scheme{schemes.length !== 1 ? 's' : ''}
          </div>
          <div className="schemes-grid">
            {schemes.map((scheme) => (
              <SchemeCard
                key={scheme.schemeId}
                scheme={scheme}
                onApply={handleApply}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Schemes;
