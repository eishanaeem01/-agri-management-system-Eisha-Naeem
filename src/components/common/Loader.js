import React from 'react';

export default function Loader({ text = 'Loading...', size = '' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-4 text-body-secondary" role="status">
      <div className={`spinner-border text-success ${size}`} aria-hidden="true" />
      <span className="mt-2 small">{text}</span>
    </div>
  );
}
