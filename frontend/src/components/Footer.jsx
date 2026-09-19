import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <h4>🏛️ Government Scheme Beneficiary Portal</h4>
            <p className="footer-desc">
              An integrated digital public-service portal empowering citizens to discover eligible welfare schemes, apply online seamlessly, and monitor real-time application statuses with complete transparency.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h5>Navigation</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/schemes">Government Schemes</Link></li>
              <li><Link to="/about">About the Portal</Link></li>
              <li><Link to="/login">Citizen Login / Register</Link></li>
              <li><Link to="/admin-login">Official Admin Login</Link></li>
            </ul>
          </div>

          {/* Scheme Categories */}
          <div className="footer-col">
            <h5>Key Categories</h5>
            <ul className="footer-links">
              <li><Link to="/schemes?category=Students">Student Scholarships</Link></li>
              <li><Link to="/schemes?category=Farmers">Farmer Welfare</Link></li>
              <li><Link to="/schemes?category=Women">Women Empowerment</Link></li>
              <li><Link to="/schemes?category=Senior%20Citizens">Senior Citizen Health</Link></li>
              <li><Link to="/schemes?category=Economically%20Weaker%20Sections">EWS Support</Link></li>
            </ul>
          </div>

          {/* Official Helpline / Support */}
          <div className="footer-col">
            <h5>Citizen Support</h5>
            <ul className="footer-links">
              <li><span style={{ color: '#ffffff' }}>Toll Free:</span> 1800-111-0022</li>
              <li><span style={{ color: '#ffffff' }}>Helpdesk:</span> support@govportal.in</li>
              <li><span style={{ color: '#ffffff' }}>Hours:</span> 09:00 AM - 06:00 PM</li>
              <li><span style={{ color: '#ffffff' }}>Grievance Cell:</span> Room 204, Central Secretariat</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Government Scheme Beneficiary Portal. All Rights Reserved.</p>
          <p className="footer-disclaimer">
            Demonstration MERN Stack Project. Designed for transparency, accessibility, and public benefit.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
