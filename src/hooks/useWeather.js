import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchWeather } from '../services/weatherApi';

export const WEATHER_REFRESH_MS = 10 * 60 * 1000; // refresh every 10 minutes

// Fetches live weather, refreshes automatically, and returns { data, loading, error, lastUpdated, refresh }.
export default function useWeather(city, refreshMs = WEATHER_REFRESH_MS) {
  const [state, setState] = useState({ data: null, loading: true, error: null, lastUpdated: null });
  const controller = useRef(null);

  const load = useCallback(async () => {
    controller.current?.abort();
    const ctrl = new AbortController();
    controller.current = ctrl;
    setState((s) => ({ ...s, loading: true, error: null, data: s.data && s.data.city === city.name ? s.data : null }));
    try {
      const data = await fetchWeather(city, ctrl.signal);
      setState({ data, loading: false, error: null, lastUpdated: new Date() });
    } catch (err) {
      if (err.name === 'AbortError') return;
      setState((s) => ({ ...s, loading: false, error: err.message || 'Failed to load weather data.' }));
    }
  }, [city]);

  useEffect(() => {
    load();
    const id = setInterval(load, refreshMs);
    return () => {
      clearInterval(id);
      controller.current?.abort();
    };
  }, [load, refreshMs]);

  return { ...state, refresh: load };
}
