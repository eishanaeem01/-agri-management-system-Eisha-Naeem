import { createReducer } from '@reduxjs/toolkit';
import { loadFromStorage } from '../thunks/loadFromStorage';
import { addActivity } from '../actions/activityActions';

const MAX_ENTRIES = 500;

export default createReducer([], (builder) => {
  builder
    .addCase(loadFromStorage.fulfilled, (state, action) => action.payload.activity)
    .addCase(addActivity, (state, action) => {
      state.unshift(action.payload);
      if (state.length > MAX_ENTRIES) state.length = MAX_ENTRIES;
    });
});
