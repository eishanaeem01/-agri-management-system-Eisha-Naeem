import { formatCnic } from '../../utils/formatters';

// Digits only; dashes are inserted automatically -> 12345-1234567-1
export default function CnicInput({ id = 'cnic', value, onChange, onBlur, error }) {
  return (
    <>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        maxLength={15}
        placeholder="12345-1234567-1"
        className={`form-control ${error ? 'is-invalid' : ''}`}
        value={value}
        onChange={(e) => onChange(formatCnic(e.target.value))}
        onBlur={onBlur}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </>
  );
}
