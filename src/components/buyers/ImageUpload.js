import { useRef, useState } from 'react';
import { validateImage } from '../../utils/validators';
import { fileToBase64 } from '../../utils/image';

// File picker with JPG/PNG + 1 MB check, live preview and remove button. Returns a Base64 string via onChange.
export default function ImageUpload({ id = 'buyer-photo', value, onChange, error }) {
  const inputRef = useRef(null);
  const [fileError, setFileError] = useState('');
  const [busy, setBusy] = useState(false);

  const reset = () => {
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const problem = validateImage(file);
    if (problem) {
      setFileError(problem);
      onChange('');
      reset();
      return;
    }
    setFileError('');
    setBusy(true);
    try {
      onChange(await fileToBase64(file));
    } catch (err) {
      setFileError(err.message);
      onChange('');
      reset();
    } finally {
      setBusy(false);
    }
  };

  const remove = () => {
    onChange('');
    setFileError('');
    reset();
  };

  const message = fileError || error;
  return (
    <div className="d-flex flex-wrap gap-3 align-items-start">
      <div className="photo-preview border rounded d-flex align-items-center justify-content-center text-body-secondary">
        {value ? <img src={value} alt="Buyer preview" /> : <i className="bi bi-person-bounding-box fs-1" aria-hidden="true" />}
      </div>
      <div className="flex-grow-1" style={{ minWidth: 200 }}>
        <input ref={inputRef} id={id} type="file" accept="image/jpeg,image/png" className={`form-control ${message ? 'is-invalid' : ''}`} onChange={handleFile} />
        {message && <div className="invalid-feedback d-block">{message}</div>}
        <div className="form-text">JPG or PNG, maximum 1 MB.{busy && ' Processing...'}</div>
        {value && <button type="button" className="btn btn-sm btn-outline-danger mt-2" onClick={remove}><i className="bi bi-x-circle me-1" />Remove photo</button>}
      </div>
    </div>
  );
}
