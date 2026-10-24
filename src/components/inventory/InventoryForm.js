import React, { useState } from 'react';
import { required } from '../../utils/validators';

export const INVENTORY_TYPES = ['Fertilizer', 'Pesticide', 'Seed'];
export const INVENTORY_UNITS = ['kg', 'L', 'bags'];

export default function InventoryForm({ initial, onSubmit, onCancel }) {
  const [f, setF] = useState(initial || { item: '', type: 'Fertilizer', qty: '', minQty: '', unit: 'kg' });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    const i = required(f.item, 'Item name');
    if (i) e.item = i;
    if (f.qty === '' || Number(f.qty) < 0) e.qty = 'Quantity must be 0 or more';
    if (f.minQty === '' || Number(f.minQty) < 0) e.minQty = 'Minimum quantity must be 0 or more';
    setErrors(e);
    if (Object.keys(e).length) return;
    onSubmit({ ...f, item: f.item.trim(), qty: Number(f.qty), minQty: Number(f.minQty) });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="inv-item">Item</label>
          <input id="inv-item" className={`form-control ${errors.item ? 'is-invalid' : ''}`} value={f.item} onChange={set('item')} placeholder="e.g. Urea" />
          <div className="invalid-feedback">{errors.item}</div>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="inv-type">Type</label>
          <select id="inv-type" className="form-select" value={f.type} onChange={set('type')}>{INVENTORY_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="inv-qty">Quantity</label>
          <input id="inv-qty" type="number" min="0" className={`form-control ${errors.qty ? 'is-invalid' : ''}`} value={f.qty} onChange={set('qty')} />
          <div className="invalid-feedback">{errors.qty}</div>
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="inv-min">Minimum quantity</label>
          <input id="inv-min" type="number" min="0" className={`form-control ${errors.minQty ? 'is-invalid' : ''}`} value={f.minQty} onChange={set('minQty')} />
          <div className="invalid-feedback">{errors.minQty}</div>
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="inv-unit">Unit</label>
          <select id="inv-unit" className="form-select" value={f.unit} onChange={set('unit')}>{INVENTORY_UNITS.map((u) => <option key={u}>{u}</option>)}</select>
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-success">{initial ? 'Save changes' : 'Add item'}</button>
      </div>
    </form>
  );
}
