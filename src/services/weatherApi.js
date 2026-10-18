// Open-Meteo: free, no API key required. https://open-meteo.com/en/docs
export const CITIES = [
  { name: 'Gujranwala', lat: 32.1617, lon: 74.1883 },
  { name: 'Lahore', lat: 31.5204, lon: 74.3587 },
  { name: 'Faisalabad', lat: 31.4504, lon: 73.135 },
  { name: 'Multan', lat: 30.1575, lon: 71.5249 },
  { name: 'Sialkot', lat: 32.4945, lon: 74.5229 },
  { name: 'Islamabad', lat: 33.6844, lon: 73.0479 },
];
export const DEFAULT_CITY = CITIES[0].name;

const CODE_MAP = [
  [[0], 'Clear sky', 'bi-sun', 'bi-moon-stars'],
  [[1, 2], 'Partly cloudy', 'bi-cloud-sun', 'bi-cloud-moon'],
  [[3], 'Overcast', 'bi-clouds', 'bi-clouds'],
  [[45, 48], 'Fog', 'bi-cloud-fog', 'bi-cloud-fog'],
  [[51, 53, 55, 56, 57], 'Drizzle', 'bi-cloud-drizzle', 'bi-cloud-drizzle'],
  [[61, 63, 65, 66, 67], 'Rain', 'bi-cloud-rain', 'bi-cloud-rain'],
  [[71, 73, 75, 77, 85, 86], 'Snow', 'bi-snow', 'bi-snow'],
  [[80, 81, 82], 'Rain showers', 'bi-cloud-rain-heavy', 'bi-cloud-rain-heavy'],
  [[95, 96, 99], 'Thunderstorm', 'bi-cloud-lightning-rain', 'bi-cloud-lightning-rain'],
];

export function describeWeather(code, isDay = true) {
  const hit = CODE_MAP.find(([codes]) => codes.includes(code));
  if (!hit) return { label: 'Unknown', icon: 'bi-question-circle' };
  return { label: hit[1], icon: isDay ? hit[2] : hit[3] };
}

export async function fetchWeather(city, signal) {
  const params = new URLSearchParams({
    latitude: city.lat,
    longitude: city.lon,
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: 6,
  });
  let res;
  try {
    res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error('Unable to reach the weather service. Check your internet connection.');
  }
  if (!res.ok) throw new Error(`Weather service returned an error (${res.status}).`);
  const json = await res.json();
  if (!json.current || !json.daily) throw new Error('Weather service returned unexpected data.');

  const { current, daily } = json;
  return {
    city: city.name,
    temperature: Math.round(current.temperature_2m),
    humidity: Math.round(current.relative_humidity_2m),
    windSpeed: Math.round(current.wind_speed_10m),
    code: current.weather_code,
    isDay: current.is_day === 1,
    rainChance: daily.precipitation_probability_max?.[0] ?? 0,
    daily: daily.time.slice(1, 6).map((date, i) => ({
      date,
      code: daily.weather_code[i + 1],
      min: Math.round(daily.temperature_2m_min[i + 1]),
      max: Math.round(daily.temperature_2m_max[i + 1]),
      rain: daily.precipitation_probability_max?.[i + 1] ?? 0,
    })),
  };
}
