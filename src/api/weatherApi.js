import { request } from './apiClient';

export const FARM_LOCATION = { city: 'Lahore', country: 'Pakistan', latitude: 31.5497, longitude: 74.3436 };
export const WEATHER_REFRESH_MS = 10 * 60 * 1000; // auto-refresh every 10 minutes

// Open-Meteo WMO weather codes -> label + Bootstrap icon
export const describeWeather = (code) => {
  if (code === 0) return { label: 'Clear sky', icon: 'bi-sun' };
  if (code <= 2) return { label: 'Partly cloudy', icon: 'bi-cloud-sun' };
  if (code === 3) return { label: 'Overcast', icon: 'bi-cloud' };
  if (code === 45 || code === 48) return { label: 'Foggy', icon: 'bi-cloud-fog' };
  if (code >= 51 && code <= 57) return { label: 'Drizzle', icon: 'bi-cloud-drizzle' };
  if (code >= 61 && code <= 67) return { label: 'Rain', icon: 'bi-cloud-rain-heavy' };
  if (code >= 71 && code <= 77) return { label: 'Snow', icon: 'bi-snow' };
  if (code >= 80 && code <= 82) return { label: 'Rain showers', icon: 'bi-cloud-rain' };
  if (code >= 95) return { label: 'Thunderstorm', icon: 'bi-cloud-lightning-rain' };
  return { label: 'Cloudy', icon: 'bi-cloud' };
};

export const getWeather = async () => {
  const { latitude, longitude } = FARM_LOCATION;
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
    '&timezone=auto&forecast_days=6';
  const d = await request(url);
  if (!d.current || !d.daily) throw new Error('Weather service returned unexpected data.');
  const cond = describeWeather(d.current.weather_code);
  return {
    city: `${FARM_LOCATION.city}, ${FARM_LOCATION.country}`,
    temperature: Math.round(d.current.temperature_2m),
    humidity: Math.round(d.current.relative_humidity_2m),
    windSpeed: Math.round(d.current.wind_speed_10m),
    rainChance: d.daily.precipitation_probability_max?.[0] ?? 0,
    condition: cond.label,
    icon: cond.icon,
    // next 5 days (index 0 is today)
    forecast: d.daily.time.slice(1, 6).map((date, i) => {
      const c = describeWeather(d.daily.weather_code[i + 1]);
      return {
        date,
        min: Math.round(d.daily.temperature_2m_min[i + 1]),
        max: Math.round(d.daily.temperature_2m_max[i + 1]),
        rainChance: d.daily.precipitation_probability_max?.[i + 1] ?? 0,
        condition: c.label,
        icon: c.icon,
      };
    }),
    updatedAt: new Date().toISOString(),
  };
};
