import React, { useEffect, useRef, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';

// Search input with debounce - calls onChange 300ms after typing stops
export default function SearchBar({ onChange, placeholder = 'Search...', className = '' }) {
  const [text, setText] = useState('');
  const debounced = useDebounce(text, 300);
  const cb = useRef(onChange);
  cb.current = onChange;
  useEffect(() => {
    cb.current(debounced);
  }, [debounced]);

  return (
    <div className={`input-group ${className}`}>
      <span className="input-group-text"><i className="bi bi-search" aria-hidden="true" /></span>
      <input type="search" className="form-control" placeholder={placeholder} aria-label={placeholder} value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}
