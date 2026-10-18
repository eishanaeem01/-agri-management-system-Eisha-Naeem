import { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';

// Reads once from localStorage (falls back to initialValue when empty/corrupt) and writes on every change.
// Returns [value, setValue, error]; error is set when the browser refuses the write (e.g. quota exceeded).
export default function useLocalStorage(key, initialValue, isValid = () => true) {
  const [value, setValue] = useState(() => {
    const stored = storageService.get(key);
    if (stored !== undefined && isValid(stored)) return stored;
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const ok = storageService.set(key, value);
    setError(ok ? null : `Could not save data. Browser storage may be full or disabled (${key}).`);
  }, [key, value]);

  return [value, setValue, error];
}
