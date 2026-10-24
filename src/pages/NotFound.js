import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center min-vh-100 p-4">
      <i className="bi bi-signpost-split display-3 text-success" />
      <h1 className="mt-3">Page not found</h1>
      <p className="text-body-secondary">This page does not exist or was moved.</p>
      <Link to="/" className="btn btn-success">Go to dashboard</Link>
    </div>
  );
}
