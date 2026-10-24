import React, { useState } from 'react';
import { required, positiveNumber } from '../../utils/validators';
import { statusFromScore, todayStr } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';

const EMPTY = { name: '', field: '', plantingDate: todayStr(), cuttingDate: '', healthScore: 80, harvestQty: '', pricePerKg: '' };

// Add or edit a crop
export default function CropForm({ initial, onSubmit, onCancel }) {
  const [f, setF] = useState(initial || EMPTY);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const validate = () => {
    const e = {};
    const add = (k, msg) => msg && (e[k] = msg);
    add('name', required(f.name, 'Crop name'));
    add('field', required(f.field, 'Field name'));
    add('plantingDate', required(f.plantingDate, 'Planting date'));
    add('cuttingDate', required(f.cuttingDate, 'Cutting date'));
    if (!e.cuttingDate && !e.plantingDate && f.cuttingDate < f.plantingDate) e.cuttingDate = 'Cutting date cannot be before planting date';
    if (f.healthScore === '' || Number(f.healthScore) < 0 || Number(f.healthScore) > 100) e.healthScore = 'Health score must be between 0 and 100';
    add('harvestQty', positiveNumber(f.harvestQty, 'Expected quantity'));
    if (f.pricePerKg === '' || Number(f.pricePerKg) < 0) e.pricePerKg = 'Price per kg is required';
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;
    onSubmit({
      ...f,
      name: f.name.trim(),
      field: f.field.trim(),
      healthScore: Number(f.healthScore),
      status: statusFromScore(f.healthScore),
      harvestQty: Number(f.harvestQty),
      pricePerKg: Number(f.pricePerKg),
    });
  };

  const cls = (k) => `form-control ${errors[k] ? 'is-invalid' : ''}`;
  return (
    <form onSubmit={submit} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="crop-name">Crop name</label>
          <input id="crop-name" className={cls('name')} value={f.name} onChange={set('name')} placeholder="e.g. Wheat" />
          <div className="invalid-feedback">{errors.name}</div>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="crop-field">Field</label>
          <input id="crop-field" className={cls('field')} value={f.field} onChange={set('field')} placeholder="e.g. Field A" />
          <div className="invalid-feedback">{errors.field}</div>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="crop-plant">Planting date</label>
          <input id="crop-plant" type="date" className={cls('plantingDate')} value={f.plantingDate} onChange={set('plantingDate')} />
          <div className="invalid-feedback">{errors.plantingDate}</div>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="crop-cut">Cutting date</label>
          <input id="crop-cut" type="date" className={cls('cuttingDate')} value={f.cuttingDate} onChange={set('cuttingDate')} />
          <div className="invalid-feedback">{errors.cuttingDate}</div>
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="crop-score">Health score (0-100)</label>
          <input id="crop-score" type="number" min="0" max="100" className={cls('healthScore')} value={f.healthScore} onChange={set('healthScore')} />
          <div className="invalid-feedback">{errors.healthScore}</div>
          {f.healthScore !== '' && !errors.healthScore && <div className="mt-1"><StatusBadge status={statusFromScore(f.healthScore)} /></div>}
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="crop-qty">Expected quantity (kg)</label>
          <input id="crop-qty" type="number" min="1" className={cls('harvestQty')} value={f.harvestQty} onChange={set('harvestQty')} />
          <div className="invalid-feedback">{errors.harvestQty}</div>
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="crop-price">Price per kg (Rs)</label>
          <input id="crop-price" type="number" min="0" className={cls('pricePerKg')} value={f.pricePerKg} onChange={set('pricePerKg')} />
          <div className="invalid-feedback">{errors.pricePerKg}</div>
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-success">{initial ? 'Save changes' : 'Add crop'}</button>
      </div>
    </form>
  );
}
