import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { validateCrop, hasErrors } from '../../utils/validators';
import { healthStatus, todayISO } from '../../utils/formatters';

const EMPTY = { name: '', field: '', plantingDate: '', cuttingDate: '', healthScore: '', harvestQty: '' };

// Add / edit a crop inside a modal. `minQty` is the amount already sold (expected quantity can't go below it).
export default function CropForm({ show, initial, minQty = 0, onSave, onClose }) {
  const [v, setV] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (show) {
      setV(initial ? { ...EMPTY, ...initial } : { ...EMPTY, plantingDate: todayISO() });
      setSubmitted(false);
    }
  }, [show, initial]);

  const errors = validateCrop(v, minQty);
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));
  const err = (k) => submitted && errors[k];

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors(errors)) return;
    onSave({
      name: v.name.trim(),
      field: v.field.trim(),
      plantingDate: v.plantingDate,
      cuttingDate: v.cuttingDate,
      healthScore: Number(v.healthScore),
      harvestQty: Number(v.harvestQty),
    });
  };

  const input = (k, label, type = 'text', extra = {}) => (
    <div className="col-md-6">
      <label htmlFor={`crop-${k}`} className="form-label">{label}</label>
      <input id={`crop-${k}`} type={type} className={`form-control ${err(k) ? 'is-invalid' : ''}`} value={v[k]} onChange={set(k)} {...extra} />
      {err(k) && <div className="invalid-feedback">{errors[k]}</div>}
    </div>
  );

  return (
    <Modal
      show={show}
      title={initial ? 'Edit crop' : 'Add crop'}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" form="crop-form" className="btn btn-success">{initial ? 'Save changes' : 'Add crop'}</button>
        </>
      }
    >
      <form id="crop-form" className="row g-3" onSubmit={submit} noValidate>
        {input('name', 'Crop name', 'text', { placeholder: 'e.g. Wheat', maxLength: 40 })}
        {input('field', 'Field name', 'text', { placeholder: 'e.g. North Field A', maxLength: 40 })}
        {input('plantingDate', 'Planting date', 'date')}
        {input('cuttingDate', 'Cutting (harvest) date', 'date')}
        {input('healthScore', 'Health score (0 to 100)', 'number', { min: 0, max: 100, placeholder: '0 - 100' })}
        {input('harvestQty', 'Expected harvest quantity (kg)', 'number', { min: 1, placeholder: 'e.g. 2500' })}
        {v.healthScore !== '' && !errors.healthScore && (
          <div className="col-12 small">Health status will be set to <StatusBadge status={healthStatus(Number(v.healthScore))} /></div>
        )}
      </form>
    </Modal>
  );
}
