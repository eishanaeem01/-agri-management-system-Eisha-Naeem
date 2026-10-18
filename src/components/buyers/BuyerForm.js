import { useState } from 'react';
import CnicInput from './CnicInput';
import ImageUpload from './ImageUpload';
import { validateCnic, validateName, validateQuantity, validateSaleDate, hasErrors } from '../../utils/validators';
import { formatNumber, todayISO } from '../../utils/formatters';

const blank = () => ({ name: '', cnic: '', image: '', cropId: '', quantity: '', date: todayISO() });

// Records a sale: Full Name, CNIC, Photo, crop, quantity and date. Remount with a new `key` to switch records.
export default function BuyerForm({ crops, buyers, stock, editing, onSubmit, onCancel }) {
  const [v, setV] = useState(() =>
    editing ? { name: editing.name, cnic: editing.cnic, image: editing.imageBase64, cropId: editing.cropId, quantity: String(editing.quantity), date: editing.date } : blank()
  );
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Stock available for the chosen crop. When editing, the buyer's own previous quantity is given back.
  const available = v.cropId
    ? (stock[v.cropId]?.remaining || 0) + (editing && editing.cropId === v.cropId ? Number(editing.quantity) || 0 : 0)
    : 0;

  const errors = {
    name: validateName(v.name),
    cnic: validateCnic(v.cnic, buyers, editing?.id),
    image: v.image ? '' : 'Photo is required.',
    cropId: v.cropId ? '' : 'Please select a crop.',
    quantity: v.cropId ? validateQuantity(v.quantity, available) : v.quantity === '' ? 'Quantity is required.' : '',
    date: validateSaleDate(v.date),
  };
  const show = (k) => (submitted || touched[k]) && errors[k];
  const set = (k, val) => setV((p) => ({ ...p, [k]: val }));
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors(errors)) return;
    onSubmit({ name: v.name.trim().replace(/\s+/g, ' '), cnic: v.cnic, imageBase64: v.image, cropId: v.cropId, quantity: Number(v.quantity), date: v.date });
    if (!editing) {
      setV(blank());
      setTouched({});
      setSubmitted(false);
    }
  };

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header fw-semibold">
        <i className={`bi ${editing ? 'bi-pencil-square' : 'bi-person-plus'} me-2 text-success`} aria-hidden="true" />
        {editing ? `Edit buyer: ${editing.name}` : 'Record a sale'}
      </div>
      <div className="card-body">
        <form className="row g-3" onSubmit={submit} noValidate>
          <div className="col-md-6 col-xl-4">
            <label htmlFor="buyer-name" className="form-label">Full name</label>
            <input id="buyer-name" className={`form-control ${show('name') ? 'is-invalid' : ''}`} value={v.name} maxLength={60} placeholder="e.g. Ali Khan" onChange={(e) => set('name', e.target.value)} onBlur={blur('name')} />
            {show('name') && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="col-md-6 col-xl-4">
            <label htmlFor="cnic" className="form-label">CNIC</label>
            <CnicInput value={v.cnic} onChange={(val) => set('cnic', val)} onBlur={blur('cnic')} error={show('cnic')} />
          </div>
          <div className="col-md-6 col-xl-4">
            <label htmlFor="buyer-crop" className="form-label">Crop</label>
            <select id="buyer-crop" className={`form-select ${show('cropId') ? 'is-invalid' : ''}`} value={v.cropId} onChange={(e) => set('cropId', e.target.value)} onBlur={blur('cropId')}>
              <option value="">Select a crop</option>
              {crops.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.field})</option>)}
            </select>
            {show('cropId') && <div className="invalid-feedback">{errors.cropId}</div>}
            {v.cropId && <div className="form-text">Available stock: <strong>{formatNumber(available)} kg</strong></div>}
          </div>
          <div className="col-md-6 col-xl-4">
            <label htmlFor="buyer-qty" className="form-label">Quantity (kg)</label>
            <input id="buyer-qty" type="number" min="1" className={`form-control ${show('quantity') ? 'is-invalid' : ''}`} value={v.quantity} onChange={(e) => set('quantity', e.target.value)} onBlur={blur('quantity')} />
            {show('quantity') && <div className="invalid-feedback">{errors.quantity}</div>}
          </div>
          <div className="col-md-6 col-xl-4">
            <label htmlFor="buyer-date" className="form-label">Date</label>
            <input id="buyer-date" type="date" max={todayISO()} className={`form-control ${show('date') ? 'is-invalid' : ''}`} value={v.date} onChange={(e) => set('date', e.target.value)} onBlur={blur('date')} />
            {show('date') && <div className="invalid-feedback">{errors.date}</div>}
          </div>
          <div className="col-12 col-xl-8">
            <label htmlFor="buyer-photo" className="form-label">Photo</label>
            <ImageUpload value={v.image} onChange={(val) => set('image', val)} error={show('image')} />
          </div>
          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-success"><i className="bi bi-save me-1" />{editing ? 'Save changes' : 'Save buyer'}</button>
            {editing && <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  );
}
