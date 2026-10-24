import React, { useState } from 'react';
import { positiveNumber, required } from '../../utils/validators';
import { todayStr } from '../../utils/formatters';

export const EXPENSE_CATEGORIES = ['Seeds', 'Fertilizer', 'Labour', 'Fuel'];

export default function ExpenseForm({ initial, crops, onSubmit, onCancel }) {
  const [f, setF] = useState(initial || { cropId: '', category: 'Seeds', amount: '', date: todayStr(), note: '' });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (!f.cropId) e.cropId = 'Select a crop';
    const a = positiveNumber(f.amount, 'Amount');
    if (a) e.amount = a;
    const d = required(f.date, 'Date');
    if (d) e.date = d;
    setErrors(e);
    if (Object.keys(e).length) return;
    onSubmit({ ...f, amount: Number(f.amount), note: f.note.trim() });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="exp-crop">Crop</label>
          <select id="exp-crop" className={`form-select ${errors.cropId ? 'is-invalid' : ''}`} value={f.cropId} onChange={set('cropId')}>
            <option value="">Select crop</option>
            {crops.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.field})</option>)}
          </select>
          <div className="invalid-feedback">{errors.cropId}</div>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="exp-cat">Category</label>
          <select id="exp-cat" className="form-select" value={f.category} onChange={set('category')}>{EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="exp-amt">Amount (Rs)</label>
          <input id="exp-amt" type="number" min="1" className={`form-control ${errors.amount ? 'is-invalid' : ''}`} value={f.amount} onChange={set('amount')} />
          <div className="invalid-feedback">{errors.amount}</div>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="exp-date">Date</label>
          <input id="exp-date" type="date" className={`form-control ${errors.date ? 'is-invalid' : ''}`} value={f.date} onChange={set('date')} />
          <div className="invalid-feedback">{errors.date}</div>
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="exp-note">Note (optional)</label>
          <input id="exp-note" className="form-control" value={f.note} onChange={set('note')} />
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-success">{initial ? 'Save changes' : 'Add expense'}</button>
      </div>
    </form>
  );
}
