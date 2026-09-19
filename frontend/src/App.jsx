import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Schemes from './pages/Schemes';
import SchemeDetails from './pages/SchemeDetails';
import About from './pages/About';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';

// Citizen Pages
import CitizenDashboard from './pages/CitizenDashboard';
import ApplyScheme from './pages/ApplyScheme';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageSchemes from './pages/ManageSchemes';
import AdminApplications from './pages/AdminApplications';
import Beneficiaries from './pages/Beneficiaries';
import Reports from './pages/Reports';

const NotFound = () => (
  <div className="container page-wrapper" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
    <h1 style={{ fontSize: '4rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>404</h1>
    <h2 style={{ marginBottom: '1rem' }}>Government Portal Resource Not Found</h2>
    <p style={{ maxWidth: '480px', margin: '0 auto 1.5rem' }}>
      The requested portal page does not exist or has been relocated to another department directory.
    </p>
    <Link to="/" className="btn btn-primary">
      Return to Home Portal
    </Link>
  </div>
);

function App() {
  return (
    <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flex: '1 0 auto' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/schemes/:id" element={<SchemeDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/citizen-login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />

          {/* Citizen Protected Routes */}
          <Route
            path="/citizen/dashboard"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apply/:schemeId"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <ApplyScheme />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schemes"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageSchemes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/beneficiaries"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Beneficiaries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
