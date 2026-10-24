import { createReducer } from '@reduxjs/toolkit';
import { fetchWeather } from '../thunks/fetchWeather';

const initialState = { status: 'idle', data: null, error: null, lastUpdated: null };

export default createReducer(initialState, (builder) => {
  builder
    .addCase(fetchWeather.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    })
    .addCase(fetchWeather.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.data = action.payload;
      state.lastUpdated = action.payload.updatedAt;
    })
    .addCase(fetchWeather.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload || action.error.message || 'Weather request failed';
    });
});
