import { createAsyncThunk } from '@reduxjs/toolkit';
import { getWeather } from '../../api/weatherApi';

// request states (idle / loading / succeeded / failed) live in weatherReducer
export const fetchWeather = createAsyncThunk('weather/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getWeather();
  } catch (err) {
    return rejectWithValue(err.message || 'Could not load weather data.');
  }
});
