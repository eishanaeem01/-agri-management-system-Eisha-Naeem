import { createReducer } from '@reduxjs/toolkit';
import { loadFromStorage } from '../thunks/loadFromStorage';

// Shared add / update / remove logic. Each module still gets its own reducer file.
export default function createCrudReducer(key, { add, update, remove }, extra) {
  return createReducer([], (builder) => {
    builder
      .addCase(loadFromStorage.fulfilled, (state, action) => action.payload[key])
      .addCase(add, (state, action) => {
        state.push(action.payload);
      })
      .addCase(update, (state, action) => {
        const i = state.findIndex((item) => item.id === action.payload.id);
        if (i > -1) state[i] = { ...state[i], ...action.payload };
      })
      .addCase(remove, (state, action) => state.filter((item) => item.id !== action.payload));
    if (extra) extra(builder);
  });
}
