import React from 'react';

// Reusable KPI card: icon, title, value and small trend text
export default function StatCard({ icon, title, value, trend, variant = 'success' }) {
  return (
    <div className={`stat-card stat-${variant}`}>
      <div className="stat-icon"><i className={`bi ${icon}`} aria-hidden="true" /></div>
      <div className="stat-body">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {trend && <div className="stat-trend">{trend}</div>}
      </div>
    </div>
  );
}
