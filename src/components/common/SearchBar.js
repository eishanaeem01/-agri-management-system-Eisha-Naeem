import { useEffect, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';

// Debounced search box: calls onSearch(text) 300 ms after the user stops typing.
export default function SearchBar({ onSearch, placeholder = 'Search...', delay = 300 }) {
  const [text, setText] = useState('');
  const debounced = useDebounce(text, delay);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <div className="input-group search-bar">
      <span className="input-group-text"><i className="bi bi-search" aria-hidden="true" /></span>
      <input
        type="search"
        className="form-control"
        placeholder={placeholder}
        aria-label={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
