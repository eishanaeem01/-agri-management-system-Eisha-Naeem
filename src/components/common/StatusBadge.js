import React from 'react';

const STYLES = {
  Healthy: 'bg-success',
  'Needs Attention': 'bg-warning text-dark',
  Critical: 'bg-danger',
  Pending: 'bg-warning text-dark',
  Delivered: 'bg-primary',
  Done: 'bg-success',
  Overdue: 'bg-danger',
  Low: 'bg-info text-dark',
  Optimal: 'bg-success',
  High: 'bg-danger',
  Admin: 'bg-dark',
  Manager: 'bg-secondary',
};

export default function StatusBadge({ status, className = '' }) {
  return <span className={`badge rounded-pill ${STYLES[status] || 'bg-secondary'} ${className}`}>{status}</span>;
}
