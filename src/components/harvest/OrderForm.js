import React, { useState } from 'react';
import { positiveNumber, required } from '../../utils/validators';
import { todayStr } from '../../utils/formatters';

// Create or edit an order: crop, quantity, order date and status
export default function OrderForm({ initial, crops, onSubmit, onCancel }) {
  const [f, setF] = useState(initial || { cropId: '', quantity: '', orderDate: todayStr(), status: 'Pending' });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (!f.cropId) e.cropId = 'Select a crop';
    const q = positiveNumber(f.quantity, 'Quantity');
    if (q) e.quantity = q;
    const d = required(f.orderDate, 'Order date');
    if (d) e.orderDate = d;
    setErrors(e);
    if (Object.keys(e).length) return;
    onSubmit({ ...f, quantity: Number(f.quantity) });
  };
  const cls = (k) => `form-control ${errors[k] ? 'is-invalid' : ''}`;

  return (
    <form onSubmit={submit} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="ord-crop">Crop</label>
          <select id="ord-crop" className={`form-select ${errors.cropId ? 'is-invalid' : ''}`} value={f.cropId} onChange={set('cropId')}>
            <option value="">Select crop</option>
            {crops.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.field})</option>)}
          </select>
          <div className="invalid-feedback">{errors.cropId}</div>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="ord-qty">Quantity (kg)</label>
          <input id="ord-qty" type="number" min="1" className={cls('quantity')} value={f.quantity} onChange={set('quantity')} />
          <div className="invalid-feedback">{errors.quantity}</div>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="ord-date">Order date</label>
          <input id="ord-date" type="date" className={cls('orderDate')} value={f.orderDate} onChange={set('orderDate')} />
          <div className="invalid-feedback">{errors.orderDate}</div>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="ord-status">Status</label>
          <select id="ord-status" className="form-select" value={f.status} onChange={set('status')}>
            <option>Pending</option><option>Delivered</option>
          </select>
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-success">{initial ? 'Save changes' : 'Create order'}</button>
      </div>
    </form>
  );
}
