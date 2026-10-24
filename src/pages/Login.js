import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginForm from '../components/auth/LoginForm';

export default function Login() {
  const user = useSelector((s) => s.auth.user);
  const location = useLocation();
  if (user) return <Navigate to={location.state?.from?.pathname || '/'} replace />;
  return (
    <div className="login-wrap">
      <div className="login-art d-none d-md-flex">
        <div>
          <i className="bi bi-tree-fill display-4" />
          <h1>AgriManager</h1>
          <p>One screen for field conditions, crop health, harvest, orders, tasks and profit.</p>
        </div>
      </div>
      <div className="login-form-side">
        <div className="login-card">
          <h2 className="h4 mb-1">Sign in</h2>
          <p className="text-body-secondary small mb-4">Use your farm account to continue.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
