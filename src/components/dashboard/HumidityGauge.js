import Loader from '../common/Loader';
import StatusBadge from '../common/StatusBadge';
import { humidityStatus } from '../../utils/formatters';

export default function HumidityGauge({ humidity, loading, error }) {
  const has = typeof humidity === 'number';
  const status = has ? humidityStatus(humidity) : null;
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - (has ? Math.min(humidity, 100) : 0) / 100);

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header fw-semibold"><i className="bi bi-droplet-half me-2 text-success" aria-hidden="true" />Humidity</div>
      <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
        {!has && loading && <Loader text="Reading humidity..." />}
        {!has && !loading && <div className="text-body-secondary small">{error ? 'Humidity unavailable. Weather data failed to load.' : 'No reading yet.'}</div>}
        {has && (
          <>
            <svg viewBox="0 0 140 140" width="150" height="150" role="img" aria-label={`Humidity ${humidity} percent, ${status.label}`}>
              <circle cx="70" cy="70" r={r} fill="none" stroke="var(--bs-border-color)" strokeWidth="12" />
              <circle
                cx="70" cy="70" r={r} fill="none"
                stroke={`var(--bs-${status.variant})`} strokeWidth="12" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset}
                transform="rotate(-90 70 70)" style={{ transition: 'stroke-dashoffset .6s ease' }}
              />
              <text x="70" y="76" textAnchor="middle" fontSize="28" fontWeight="700" fill="currentColor">{humidity}%</text>
            </svg>
            <StatusBadge status={status.label} variant={status.variant} />
            <div className="small text-body-secondary mt-2">{status.hint}</div>
          </>
        )}
      </div>
    </div>
  );
}
