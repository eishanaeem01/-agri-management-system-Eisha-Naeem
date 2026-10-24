// Every read/write to localStorage goes through here (try/catch + empty-storage handling).
export const KEYS = {
  crops: 'agri_crops',
  orders: 'agri_orders',
  buyers: 'agri_buyers',
  tasks: 'agri_tasks',
  expenses: 'agri_expenses',
  inventory: 'agri_inventory',
  activity: 'agri_activity',
  session: 'agri_session',
  theme: 'agri_theme',
};

export const readStorage = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null || raw === undefined ? fallback : JSON.parse(raw);
  } catch (e) {
    console.warn(`[storage] could not read "${key}"`, e);
    return fallback;
  }
};

export const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`[storage] could not write "${key}" (quota or privacy mode?)`, e);
    return false;
  }
};

export const removeStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`[storage] could not remove "${key}"`, e);
  }
};
