import React, { useState } from 'react';
import EmptyState from '../common/EmptyState';
import ModalShell from '../common/ModalShell';
import { formatDate, todayStr } from '../../utils/formatters';

// Inputs stock with low-stock highlight, usage logging and usage history
export default function InventoryTable({ items, onEdit, onDelete, onUse, canEdit, canDelete }) {
  const [typeFilter, setTypeFilter] = useState('All');
  const [useItem, setUseItem] = useState(null);
  const [useQty, setUseQty] = useState('');
  const [useNote, setUseNote] = useState('');
  const [useError, setUseError] = useState('');
  const [historyItem, setHistoryItem] = useState(null);

  const rows = items.filter((i) => typeFilter === 'All' || i.type === typeFilter);

  const openUse = (item) => { setUseItem(item); setUseQty(''); setUseNote(''); setUseError(''); };
  const submitUse = (e) => {
    e.preventDefault();
    const q = Number(useQty);
    if (!q || q <= 0) return setUseError('Enter a quantity greater than 0');
    if (q > useItem.qty) return setUseError(`Only ${useItem.qty} ${useItem.unit} in stock`);
    onUse({ id: useItem.id, qty: q, note: useNote.trim() || 'Used on farm', date: todayStr() });
    setUseItem(null);
  };

  return (
    <div>
      <select className="form-select w-auto mb-3" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Filter by type">
        <option value="All">All types</option><option>Fertilizer</option><option>Pesticide</option><option>Seed</option>
      </select>
      {rows.length === 0 ? (
        <EmptyState icon="bi-box-seam" title="No inventory items" message="Add fertilizer, pesticide or seed stock." />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead><tr><th>Item</th><th>Type</th><th className="text-end">In stock</th><th className="text-end">Minimum</th><th>State</th><th className="text-end">Actions</th></tr></thead>
            <tbody>
              {rows.map((i) => {
                const low = Number(i.qty) < Number(i.minQty);
                return (
                  <tr key={i.id} className={low ? 'table-warning' : ''}>
                    <td className="fw-semibold">{i.item}</td>
                    <td>{i.type}</td>
                    <td className="text-end">{i.qty} {i.unit}</td>
                    <td className="text-end">{i.minQty} {i.unit}</td>
                    <td>{low ? <span className="badge bg-danger">Low stock</span> : <span className="badge bg-success">OK</span>}</td>
                    <td className="text-end text-nowrap">
                      <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => setHistoryItem(i)} aria-label={`Usage history for ${i.item}`}><i className="bi bi-clock-history" /></button>
                      {canEdit && <button className="btn btn-sm btn-outline-success me-1" onClick={() => openUse(i)} aria-label={`Log usage of ${i.item}`}><i className="bi bi-dash-circle" /></button>}
                      {canEdit && <button className="btn btn-sm btn-outline-primary me-1" onClick={() => onEdit(i)} aria-label="Edit item"><i className="bi bi-pencil" /></button>}
                      {canDelete && <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(i)} aria-label="Delete item"><i className="bi bi-trash" /></button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ModalShell show={Boolean(useItem)} title={`Log usage: ${useItem?.item || ''}`} onClose={() => setUseItem(null)}>
        <form onSubmit={submitUse} noValidate>
          <label className="form-label" htmlFor="use-qty">Quantity used ({useItem?.unit})</label>
          <input id="use-qty" type="number" min="1" className={`form-control ${useError ? 'is-invalid' : ''}`} value={useQty} onChange={(e) => setUseQty(e.target.value)} />
          <div className="invalid-feedback">{useError}</div>
          <label className="form-label mt-3" htmlFor="use-note">Note</label>
          <input id="use-note" className="form-control" value={useNote} onChange={(e) => setUseNote(e.target.value)} placeholder="e.g. Wheat top dressing" />
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setUseItem(null)}>Cancel</button>
            <button type="submit" className="btn btn-success">Log usage</button>
          </div>
        </form>
      </ModalShell>

      <ModalShell show={Boolean(historyItem)} title={`Usage history: ${historyItem?.item || ''}`} onClose={() => setHistoryItem(null)}>
        {!historyItem?.history?.length ? (
          <p className="text-body-secondary mb-0">No usage recorded for this item yet.</p>
        ) : (
          <ul className="list-group">
            {historyItem.history.map((h, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between">
                <span>{h.note}<div className="small text-body-secondary">{formatDate(h.date)}</div></span>
                <strong>-{h.qty} {historyItem.unit}</strong>
              </li>
            ))}
          </ul>
        )}
      </ModalShell>
    </div>
  );
}
