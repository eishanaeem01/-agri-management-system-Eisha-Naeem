import React from 'react';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';

const BAR = { Healthy: 'bg-success', 'Needs Attention': 'bg-warning', Critical: 'bg-danger' };

export default function CropHealthList({ crops }) {
  return (
    <section className="panel h-100" aria-label="Crop health">
      <h2 className="panel-title">Crop health</h2>
      {crops.length === 0 ? (
        <EmptyState icon="bi-flower2" title="No crops yet" message="Add a crop to track its health." />
      ) : (
        <ul className="list-unstyled mb-0">
          {crops.map((c) => (
            <li key={c.id} className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span><strong>{c.name}</strong> <span className="text-body-secondary small">{c.field}</span></span>
                <StatusBadge status={c.status} />
              </div>
              <div className="progress" style={{ height: 10 }} role="progressbar" aria-valuenow={c.healthScore} aria-valuemin="0" aria-valuemax="100" aria-label={`${c.name} health score`}>
                <div className={`progress-bar ${BAR[c.status]}`} style={{ width: `${c.healthScore}%` }} />
              </div>
              <div className="small text-body-secondary text-end">{c.healthScore}/100</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
