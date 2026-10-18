import EmptyState from '../common/EmptyState';

export default function AlertsPanel({ alerts }) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span className="fw-semibold"><i className="bi bi-bell me-2 text-success" aria-hidden="true" />Alerts</span>
        <span className={`badge rounded-pill ${alerts.length ? 'text-bg-danger' : 'text-bg-success'}`}>{alerts.length}</span>
      </div>
      <div className="card-body alerts-scroll">
        {alerts.length === 0 && <EmptyState icon="bi-check-circle" title="All clear" message="No warnings right now." />}
        {alerts.map((a) => (
          <div key={a.id} className={`alert alert-${a.level} py-2 px-3 mb-2 d-flex gap-2 align-items-start`} role="alert">
            <i className={`bi ${a.icon} mt-1`} aria-hidden="true" />
            <div className="small"><div className="fw-semibold">{a.title}</div>{a.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
