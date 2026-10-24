import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CnicInput from './CnicInput';
import ImageUpload from './ImageUpload';
import { saveBuyer } from '../../store/thunks/saveBuyer';
import { selectAvailableStock } from '../../store/selectors';
import { validateBuyer } from '../../utils/validators';
import { formatNumber, todayStr } from '../../utils/formatters';

const EMPTY = { name: '', cnic: '', imageBase64: '', cropId: '', quantity: '', date: todayStr() };

// Records the person a crop was sold to. Validated live and again inside the saveBuyer thunk.
export default function BuyerForm({ initial, crops, onSaved, onCancel }) {
  const dispatch = useDispatch();
  const buyers = useSelector((s) => s.buyers);
  const [f, setF] = useState(initial || EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const available = useSelector((s) => selectAvailableStock(s, f.cropId, f.id));

  const update = (patch) => {
    const next = { ...f, ...patch };
    setF(next);
    if (touched) setErrors(validateBuyer(next, { buyers, available: patch.cropId !== undefined ? undefined : available }));
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setTouched(true);
    const local = validateBuyer(f, { buyers, available });
    setErrors(local);
    if (Object.keys(local).length) return;
    setSaving(true);
    try {
      const saved = await dispatch(saveBuyer(f)).unwrap();
      onSaved(saved, Boolean(f.id));
    } catch (rejected) {
      setErrors(rejected && typeof rejected === 'object' ? rejected : { name: 'Could not save buyer' });
    } finally {
      setSaving(false);
    }
  };

  const cls = (k) => `form-control ${errors[k] ? 'is-invalid' : ''}`;
  return (
    <form onSubmit={submit} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="buyer-name">Full name</label>
          <input id="buyer-name" className={cls('name')} value={f.name} onChange={(e) => update({ name: e.target.value })} placeholder="Letters and spaces only" />
          <div className="invalid-feedback">{errors.name}</div>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="buyer-cnic">CNIC</label>
          <CnicInput value={f.cnic} onChange={(cnic) => update({ cnic })} error={errors.cnic} />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="buyer-photo">Photo</label>
          <ImageUpload value={f.imageBase64} onChange={(imageBase64) => update({ imageBase64 })} error={errors.image} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="buyer-crop">Crop</label>
          <select id="buyer-crop" className={`form-select ${errors.cropId ? 'is-invalid' : ''}`} value={f.cropId} onChange={(e) => update({ cropId: e.target.value })}>
            <option value="">Select crop</option>
            {crops.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.field})</option>)}
          </select>
          <div className="invalid-feedback">{errors.cropId}</div>
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="buyer-qty">Quantity (kg)</label>
          <input id="buyer-qty" type="number" min="1" className={cls('quantity')} value={f.quantity} onChange={(e) => update({ quantity: e.target.value })} />
          <div className="invalid-feedback">{errors.quantity}</div>
          {f.cropId && <div className="form-text">Available stock: {formatNumber(available)} kg</div>}
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="buyer-date">Date</label>
          <input id="buyer-date" type="date" className={cls('date')} value={f.date} onChange={(e) => update({ date: e.target.value })} />
          <div className="invalid-feedback">{errors.date}</div>
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Saving...' : initial ? 'Save changes' : 'Save buyer'}</button>
      </div>
    </form>
  );
}
