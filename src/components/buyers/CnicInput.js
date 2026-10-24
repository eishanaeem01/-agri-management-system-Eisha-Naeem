import React from 'react';
import { formatCnic } from '../../utils/formatters';

// Auto-formats to 12345-1234567-1 while typing
export default function CnicInput({ value, onChange, error, id = 'buyer-cnic' }) {
  return (
    <>
      <input
        id={id}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        inputMode="numeric"
        autoComplete="off"
        placeholder="12345-1234567-1"
        maxLength={15}
        value={value}
        onChange={(e) => onChange(formatCnic(e.target.value))}
      />
      <div className="invalid-feedback">{error}</div>
    </>
  );
}
