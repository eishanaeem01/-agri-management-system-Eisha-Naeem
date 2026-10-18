const VARIANTS = {
  Healthy: 'success',
  'Needs Attention': 'warning',
  Critical: 'danger',
  Pending: 'warning',
  Delivered: 'success',
  Cancelled: 'secondary',
  Overdue: 'danger',
  'Due Soon': 'warning',
  Upcoming: 'info',
  Low: 'warning',
  Optimal: 'success',
  High: 'danger',
};

export default function StatusBadge({ status, variant }) {
  return <span className={`badge rounded-pill text-bg-${variant || VARIANTS[status] || 'secondary'}`}>{status}</span>;
}
