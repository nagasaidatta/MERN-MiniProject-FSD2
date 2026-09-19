import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isCitizen, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-link" onClick={closeMenu}>
          <div className="brand-emblem">🏛️</div>
          <div>
            <span className="brand-text-title">GovBeneficiary Portal</span>
            <span className="brand-text-sub">Ministry of Public Welfare</span>
          </div>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="nav-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Menu */}
        <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            {/* Public Links */}
            {!isAuthenticated && (
              <>
                <li>
                  <NavLink to="/" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/schemes" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    Government Schemes
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    About Portal
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin-login" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    🔒 Admin Portal
                  </NavLink>
                </li>
                <li>
                  <Link to="/login" className="btn btn-primary btn-sm" onClick={closeMenu} style={{ marginLeft: '0.25rem' }}>
                    Citizen Login / Register
                  </Link>
                </li>
              </>
            )}

            {/* Citizen Links */}
            {isAuthenticated && isCitizen && (
              <>
                <li>
                  <NavLink to="/citizen/dashboard" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/schemes" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    Schemes
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/my-applications" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    My Applications
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/profile" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    Profile
                  </NavLink>
                </li>
              </>
            )}

            {/* Admin Links */}
            {isAuthenticated && isAdmin && (
              <>
                <li>
                  <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/schemes" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    Manage Schemes
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/applications" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    Applications
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/beneficiaries" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    Beneficiaries
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/reports" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    Reports
                  </NavLink>
                </li>
              </>
            )}

            {/* Authenticated User Status & Logout */}
            {isAuthenticated && (
              <li className="nav-user-info">
                <span className="nav-user-name">
                  {user?.name}
                  <span className={`nav-role-badge ${user?.role}`}>
                    {user?.role}
                  </span>
                </span>
                <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
