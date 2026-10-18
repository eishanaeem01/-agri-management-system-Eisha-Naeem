import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import { validateOrder, hasErrors } from '../../utils/validators';
import { ORDER_STATUSES, todayISO } from '../../utils/formatters';

const EMPTY = { cropId: '', quantity: '', orderDate: '', status: 'Pending' };

export default function OrderForm({ show, initial, crops, onSave, onClose }) {
  const [v, setV] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (show) {
      setV(initial ? { ...EMPTY, ...initial } : { ...EMPTY, orderDate: todayISO() });
      setSubmitted(false);
    }
  }, [show, initial]);

  const errors = validateOrder(v);
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));
  const err = (k) => submitted && errors[k];

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors(errors)) return;
    onSave({ cropId: v.cropId, quantity: Number(v.quantity), orderDate: v.orderDate, status: v.status });
  };

  return (
    <Modal
      show={show}
      title={initial ? 'Edit order' : 'New order'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" form="order-form" className="btn btn-success">{initial ? 'Save changes' : 'Create order'}</button>
        </>
      }
    >
      <form id="order-form" className="row g-3" onSubmit={submit} noValidate>
        <div className="col-12">
          <label htmlFor="order-crop" className="form-label">Crop</label>
          <select id="order-crop" className={`form-select ${err('cropId') ? 'is-invalid' : ''}`} value={v.cropId} onChange={set('cropId')}>
            <option value="">Select a crop</option>
            {crops.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.field})</option>)}
          </select>
          {err('cropId') && <div className="invalid-feedback">{errors.cropId}</div>}
        </div>
        <div className="col-md-6">
          <label htmlFor="order-qty" className="form-label">Quantity (kg)</label>
          <input id="order-qty" type="number" min="1" className={`form-control ${err('quantity') ? 'is-invalid' : ''}`} value={v.quantity} onChange={set('quantity')} />
          {err('quantity') && <div className="invalid-feedback">{errors.quantity}</div>}
        </div>
        <div className="col-md-6">
          <label htmlFor="order-date" className="form-label">Order date</label>
          <input id="order-date" type="date" className={`form-control ${err('orderDate') ? 'is-invalid' : ''}`} value={v.orderDate} onChange={set('orderDate')} />
          {err('orderDate') && <div className="invalid-feedback">{errors.orderDate}</div>}
        </div>
        <div className="col-12">
          <label htmlFor="order-status" className="form-label">Status</label>
          <select id="order-status" className="form-select" value={v.status} onChange={set('status')}>
            {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </form>
    </Modal>
  );
}
