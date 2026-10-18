import EmptyState from '../common/EmptyState';
import { formatNumber } from '../../utils/formatters';

// One progress bar per crop: sold quantity against harvested quantity.
export default function StockProgressBar({ crops, stock }) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header fw-semibold"><i className="bi bi-bar-chart-steps me-2 text-success" aria-hidden="true" />Stock sold per crop</div>
      <div className="card-body">
        {crops.length === 0 && <EmptyState icon="bi-box-seam" title="No crops yet" />}
        {crops.map((c) => {
          const s = stock[c.id] || { harvest: 0, sold: 0, remaining: 0 };
          const pct = s.harvest ? Math.round((s.sold / s.harvest) * 100) : 0;
          const color = pct >= 80 ? 'bg-danger' : pct >= 50 ? 'bg-warning' : 'bg-success';
          return (
            <div key={c.id} className="mb-3">
              <div className="d-flex justify-content-between small mb-1">
                <strong>{c.name}</strong>
                <span className="text-body-secondary">{formatNumber(s.sold)} / {formatNumber(s.harvest)} kg ({pct}%)</span>
              </div>
              <div className="progress" role="progressbar" aria-label={`${c.name} sold`} aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100" style={{ height: 10 }}>
                <div className={`progress-bar ${color}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
