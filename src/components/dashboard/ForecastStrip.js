import Loader from '../common/Loader';
import { describeWeather } from '../../services/weatherApi';
import { parseDate } from '../../utils/formatters';

export default function ForecastStrip({ daily, loading, error }) {
  return (
    <div className="card shadow-sm">
      <div className="card-header fw-semibold"><i className="bi bi-calendar-week me-2 text-success" aria-hidden="true" />5-day forecast</div>
      <div className="card-body">
        {!daily && loading && <Loader text="Loading forecast..." small />}
        {!daily && !loading && <div className="text-body-secondary small">{error ? 'Forecast unavailable right now.' : 'No forecast data.'}</div>}
        {daily && (
          <div className="row g-2 row-cols-2 row-cols-sm-3 row-cols-lg-5 text-center">
            {daily.map((d) => {
              const info = describeWeather(d.code);
              return (
                <div className="col" key={d.date}>
                  <div className="border rounded p-2 h-100 forecast-day">
                    <div className="small fw-semibold">{parseDate(d.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                    <i className={`bi ${info.icon} fs-2 text-success`} aria-hidden="true" />
                    <div className="small text-body-secondary">{info.label}</div>
                    <div><strong>{d.max}&deg;</strong> <span className="text-body-secondary">/ {d.min}&deg;</span></div>
                    <div className="small text-info-emphasis"><i className="bi bi-umbrella" /> {d.rain}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
