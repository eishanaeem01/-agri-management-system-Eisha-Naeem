export default function StatCard({ icon, title, value, trend, variant = 'success' }) {
  return (
    <div className="card h-100 shadow-sm stat-card">
      <div className="card-body d-flex align-items-center gap-3">
        <div className={`stat-icon bg-${variant}-subtle text-${variant}-emphasis`}>
          <i className={`bi ${icon}`} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="text-body-secondary small">{title}</div>
          <div className="fs-4 fw-bold lh-sm">{value}</div>
          {trend && <div className="small text-body-secondary">{trend}</div>}
        </div>
      </div>
    </div>
  );
}
