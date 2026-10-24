import React from 'react';

export default function EmptyState({ icon = 'bi-inbox', title = 'Nothing here yet', message, children }) {
  return (
    <div className="empty-state text-center py-5 px-3">
      <i className={`bi ${icon} display-5 text-body-tertiary`} aria-hidden="true" />
      <h3 className="h6 mt-3 mb-1">{title}</h3>
      {message && <p className="text-body-secondary small mb-3">{message}</p>}
      {children}
    </div>
  );
}
