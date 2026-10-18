import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';
import { healthStatus } from '../../utils/formatters';

const BAR = { Healthy: 'bg-success', 'Needs Attention': 'bg-warning', Critical: 'bg-danger' };

export default function CropHealthList({ crops }) {
  const sorted = [...crops].sort((a, b) => a.healthScore - b.healthScore);
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header fw-semibold"><i className="bi bi-heart-pulse me-2 text-success" aria-hidden="true" />Crop health</div>
      <div className="card-body">
        {sorted.length === 0 && <EmptyState icon="bi-flower1" title="No crops yet" message="Add a crop to track its health." />}
        <ul className="list-unstyled mb-0">
          {sorted.map((c) => {
            const status = healthStatus(c.healthScore);
            return (
              <li key={c.id} className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span><strong>{c.name}</strong> <small className="text-body-secondary">{c.field}</small></span>
                  <span className="d-flex align-items-center gap-2"><small className="fw-semibold">{c.healthScore}/100</small><StatusBadge status={status} /></span>
                </div>
                <div className="progress" role="progressbar" aria-label={`${c.name} health score`} aria-valuenow={c.healthScore} aria-valuemin="0" aria-valuemax="100" style={{ height: 8 }}>
                  <div className={`progress-bar ${BAR[status]}`} style={{ width: `${c.healthScore}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
