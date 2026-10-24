import React from 'react';
import EmptyState from '../common/EmptyState';
import { formatNumber } from '../../utils/formatters';

// Sold quantity against harvested quantity, per crop
export default function StockProgressBar({ crops }) {
  return (
    <section className="panel h-100" aria-label="Stock progress">
      <h2 className="panel-title">Sold vs harvested</h2>
      {crops.length === 0 ? (
        <EmptyState icon="bi-bar-chart" title="No stock data" />
      ) : (
        crops.map((c) => (
          <div key={c.id} className="mb-3">
            <div className="d-flex justify-content-between small">
              <strong>{c.name}</strong>
              <span>{formatNumber(c.sold)} / {formatNumber(c.harvestQty)} kg ({c.soldPct}%)</span>
            </div>
            <div className="progress" style={{ height: 10 }} role="progressbar" aria-valuenow={c.soldPct} aria-valuemin="0" aria-valuemax="100" aria-label={`${c.name} sold`}>
              <div className={`progress-bar ${c.soldPct >= 80 ? 'bg-danger' : c.soldPct >= 50 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${c.soldPct}%` }} />
            </div>
          </div>
        ))
      )}
    </section>
  );
}
