import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Redirects to /login when signed out, and blocks pages by role (roles prop)
export default function ProtectedRoute({ roles, children }) {
  const { user, role } = useSelector((s) => s.auth);
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !roles.includes(role)) {
    return (
      <div className="panel text-center py-5">
        <i className="bi bi-shield-lock display-5 text-danger" />
        <h1 className="h4 mt-3">Access denied</h1>
        <p className="text-body-secondary">Your role ({role}) cannot open this page.</p>
        <Link to="/" className="btn btn-success">Back to dashboard</Link>
      </div>
    );
  }
  return children;
}
