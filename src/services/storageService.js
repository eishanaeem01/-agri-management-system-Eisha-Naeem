// Safe wrapper around localStorage: every call is try/catch protected and
// an empty / missing / corrupted key never throws (get() returns undefined).
export const STORAGE_KEYS = {
  crops: 'agri_crops',
  orders: 'agri_orders',
  buyers: 'agri_buyers',
  darkMode: 'agri_dark_mode',
  city: 'agri_city',
};

const available = () => {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
};

export const storageService = {
  get(key) {
    if (!available()) return undefined;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null || raw === '') return undefined;
      return JSON.parse(raw);
    } catch (err) {
      console.warn(`storageService: could not read "${key}"`, err);
      return undefined;
    }
  },
  set(key, value) {
    if (!available()) return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn(`storageService: could not write "${key}"`, err);
      return false;
    }
  },
  remove(key) {
    if (!available()) return;
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.warn(`storageService: could not remove "${key}"`, err);
    }
  },
};
