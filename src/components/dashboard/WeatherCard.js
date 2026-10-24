import React from 'react';
import Loader from '../common/Loader';
import { formatTime } from '../../utils/formatters';

// Live temperature, condition, wind, rain chance, city and last updated time
export default function WeatherCard({ data, loading, error, lastUpdated, onRefresh }) {
  return (
    <section className="panel h-100 weather-card" aria-label="Live weather">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h2 className="panel-title mb-0">Live weather</h2>
        <button className="btn btn-sm btn-outline-secondary" onClick={onRefresh} disabled={loading} aria-label="Refresh weather">
          <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`} />
        </button>
      </div>

      {loading && !data && <Loader text="Fetching live weather..." />}

      {error && (
        <div className="alert alert-danger py-2 small d-flex justify-content-between align-items-center" role="alert">
          <span><i className="bi bi-wifi-off me-2" />{error}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={onRefresh}>Retry</button>
        </div>
      )}

      {data && (
        <>
          <div className="d-flex align-items-center gap-3">
            <i className={`bi ${data.icon} weather-icon`} aria-hidden="true" />
            <div>
              <div className="weather-temp">{data.temperature}&deg;C</div>
              <div className="text-body-secondary">{data.condition} in {data.city}</div>
            </div>
          </div>
          <div className="row g-2 mt-2 text-center">
            <div className="col-4"><div className="mini-stat"><i className="bi bi-wind" /><strong>{data.windSpeed}</strong><span>km/h wind</span></div></div>
            <div className="col-4"><div className="mini-stat"><i className="bi bi-cloud-rain" /><strong>{data.rainChance}%</strong><span>rain chance</span></div></div>
            <div className="col-4"><div className="mini-stat"><i className="bi bi-droplet" /><strong>{data.humidity}%</strong><span>humidity</span></div></div>
          </div>
          <p className="small text-body-secondary mt-3 mb-0">
            {data.rainChance >= 50 ? 'Rain likely today: hold irrigation and spraying.' : 'Low rain chance today: good for field work.'}{' '}
            Updated {formatTime(lastUpdated)}. Refreshes every 10 minutes.
          </p>
        </>
      )}
    </section>
  );
}
