import React from 'react';

// Warnings built from Redux selectors: humidity, low stock, critical crops, cutting dates, tasks, inventory
export default function AlertsPanel({ alerts, onDismiss, onClearAll }) {
  return (
    <section className="panel h-100" aria-label="Alerts">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="panel-title">Alerts <span className="badge bg-danger ms-1">{alerts.length}</span></h2>
        {alerts.length > 0 && <button className="btn btn-link btn-sm p-0" onClick={onClearAll}>Dismiss all</button>}
      </div>
      {alerts.length === 0 ? (
        <p className="text-body-secondary small mb-0"><i className="bi bi-check-circle text-success me-2" />All clear. Nothing needs attention right now.</p>
      ) : (
        <div className="alerts-scroll">
          {alerts.map((a) => (
            <div key={a.id} className={`alert alert-${a.level} py-2 px-3 d-flex align-items-start gap-2 mb-2`} role="alert">
              <i className={`bi ${a.icon} mt-1`} aria-hidden="true" />
              <div className="flex-grow-1 small"><strong>{a.title}.</strong> {a.message}</div>
              <button type="button" className="btn-close btn-sm" aria-label={`Dismiss ${a.title}`} onClick={() => onDismiss(a.id)} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
