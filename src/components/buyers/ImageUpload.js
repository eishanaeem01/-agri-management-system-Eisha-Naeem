import React, { useRef, useState } from 'react';
import { validateImage } from '../../utils/validators';

// File picker with type / size check, live preview and remove button. Returns a Base64 string.
export default function ImageUpload({ value, onChange, error }) {
  const [localError, setLocalError] = useState('');
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImage(file);
    setLocalError(err);
    if (err) {
      onChange('');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result); // Base64 data URL
    reader.onerror = () => setLocalError('Could not read this file. Try another image.');
    reader.readAsDataURL(file);
  };

  const remove = () => {
    onChange('');
    setLocalError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const msg = localError || error;
  return (
    <div>
      <div className="d-flex align-items-start gap-3">
        <div className="photo-preview">
          {value ? <img src={value} alt="Buyer preview" /> : <i className="bi bi-person-bounding-box" aria-hidden="true" />}
        </div>
        <div className="flex-grow-1">
          <input ref={inputRef} id="buyer-photo" type="file" accept="image/jpeg,image/png" className={`form-control ${msg ? 'is-invalid' : ''}`} onChange={handleFile} />
          <div className="invalid-feedback">{msg}</div>
          <div className="form-text">JPG or PNG, maximum 1 MB.</div>
          {value && <button type="button" className="btn btn-sm btn-outline-danger mt-1" onClick={remove}><i className="bi bi-x-lg me-1" />Remove photo</button>}
        </div>
      </div>
    </div>
  );
}
