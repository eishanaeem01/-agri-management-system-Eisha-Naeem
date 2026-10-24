import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEYS, readStorage } from '../../api/storageApi';
import { makeSeed } from '../../data/seedData';

// Rehydrates the store from localStorage. Empty storage (first run) -> demo seed data.
export const loadFromStorage = createAsyncThunk('storage/load', async () => {
  const firstRun = readStorage(KEYS.crops, null) === null;
  const seed = firstRun ? makeSeed() : null;
  const list = (key) => {
    const v = readStorage(KEYS[key], null);
    return Array.isArray(v) ? v : seed ? seed[key] : [];
  };
  const activity = readStorage(KEYS.activity, []);
  return {
    crops: list('crops'),
    orders: list('orders'),
    buyers: list('buyers'),
    tasks: list('tasks'),
    expenses: list('expenses'),
    inventory: list('inventory'),
    activity: Array.isArray(activity) ? activity : [],
    session: readStorage(KEYS.session, null),
    theme: readStorage(KEYS.theme, 'light'),
  };
});
