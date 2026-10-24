import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather } from '../store/thunks/fetchWeather';
import { WEATHER_REFRESH_MS } from '../api/weatherApi';

// Dispatches the weather thunk, optionally auto-refreshes, and returns data / loading / error from the store.
export default function useWeather({ autoRefresh = true } = {}) {
  const dispatch = useDispatch();
  const { data, status, error, lastUpdated } = useSelector((s) => s.weather);

  useEffect(() => {
    if (!autoRefresh) return undefined;
    dispatch(fetchWeather());
    const timer = setInterval(() => dispatch(fetchWeather()), WEATHER_REFRESH_MS);
    return () => clearInterval(timer);
  }, [dispatch, autoRefresh]);

  const refresh = useCallback(() => dispatch(fetchWeather()), [dispatch]);
  return { data, status, error, lastUpdated, loading: status === 'loading', refresh };
}
