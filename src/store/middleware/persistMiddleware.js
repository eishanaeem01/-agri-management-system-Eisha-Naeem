import { KEYS, writeStorage, removeStorage } from '../../api/storageApi';

const SLICES = ['crops', 'orders', 'buyers', 'tasks', 'expenses', 'inventory', 'activity'];
const last = {};

// After every action: any persisted slice whose reference changed is written to localStorage.
// Nothing is written until the store has been hydrated (otherwise empty state would wipe saved data).
const persistMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  if (!state.ui.hydrated) return result;

  SLICES.forEach((slice) => {
    if (state[slice] !== last[slice]) {
      writeStorage(KEYS[slice], state[slice]);
      last[slice] = state[slice];
    }
  });

  const { user, name, role } = state.auth;
  const sessionKey = user ? `${user}|${role}` : '';
  if (sessionKey !== last.session) {
    if (user) writeStorage(KEYS.session, { user, name, role });
    else removeStorage(KEYS.session);
    last.session = sessionKey;
  }
  if (state.ui.theme !== last.theme) {
    writeStorage(KEYS.theme, state.ui.theme);
    last.theme = state.ui.theme;
  }
  return result;
};

export default persistMiddleware;
