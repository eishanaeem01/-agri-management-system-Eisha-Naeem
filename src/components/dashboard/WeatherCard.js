import Loader from '../common/Loader';
import { describeWeather } from '../../services/weatherApi';
import { formatTime } from '../../utils/formatters';

export default function WeatherCard({ weather, city, cities, onCityChange }) {
  const { data, loading, error, lastUpdated, refresh } = weather;
  const info = data ? describeWeather(data.code, data.isDay) : null;

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
        <span className="fw-semibold"><i className="bi bi-cloud-sun me-2 text-success" aria-hidden="true" />Live weather</span>
        <div className="d-flex gap-2">
          <select className="form-select form-select-sm" value={city.name} onChange={(e) => onCityChange(e.target.value)} aria-label="Select city">
            {cities.map((c) => <option key={c.name}>{c.name}</option>)}
          </select>
          <button type="button" className="btn btn-sm btn-outline-success" onClick={refresh} disabled={loading} aria-label="Refresh weather" title="Refresh now">
            <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`} />
          </button>
        </div>
      </div>
      <div className="card-body">
        {loading && !data && <Loader text="Fetching live weather..." />}

        {error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
            <span><i className="bi bi-wifi-off me-2" />{error}</span>
            <button type="button" className="btn btn-sm btn-danger" onClick={refresh}>Retry</button>
          </div>
        )}

        {data && (
          <>
            <div className="d-flex align-items-center gap-3 mb-3">
              <i className={`bi ${info.icon} display-3 text-success`} aria-hidden="true" />
              <div>
                <div className="display-5 fw-bold lh-1">{data.temperature}&deg;C</div>
                <div className="text-body-secondary">{info.label} in <strong>{data.city}</strong></div>
              </div>
            </div>
            <div className="row g-2 text-center">
              <div className="col-4"><div className="metric"><i className="bi bi-droplet" /><div className="fw-semibold">{data.humidity}%</div><small className="text-body-secondary">Humidity</small></div></div>
              <div className="col-4"><div className="metric"><i className="bi bi-wind" /><div className="fw-semibold">{data.windSpeed} km/h</div><small className="text-body-secondary">Wind</small></div></div>
              <div className="col-4"><div className="metric"><i className="bi bi-umbrella" /><div className="fw-semibold">{data.rainChance}%</div><small className="text-body-secondary">Rain chance</small></div></div>
            </div>
          </>
        )}
      </div>
      <div className="card-footer small text-body-secondary">
        Last updated: {formatTime(lastUpdated)} &middot; auto-refresh every 10 min
      </div>
    </div>
  );
}
