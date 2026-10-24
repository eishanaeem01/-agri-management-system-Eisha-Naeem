import React from 'react';
import StatusBadge from '../common/StatusBadge';
import Loader from '../common/Loader';
import { humidityStatus } from '../../utils/formatters';

const COLORS = { Low: '#2a9bc4', Optimal: '#2f8f4e', High: '#d6453d' };
const R = 52;
const C = 2 * Math.PI * R;

// Progress ring with a Low / Optimal / High label, colour-coded
export default function HumidityGauge({ humidity, loading }) {
  const has = typeof humidity === 'number';
  const status = has ? humidityStatus(humidity) : null;
  return (
    <section className="panel h-100" aria-label="Humidity">
      <h2 className="panel-title">Humidity</h2>
      {!has && loading && <Loader text="Reading humidity..." />}
      {!has && !loading && <p className="text-body-secondary small">Humidity is unavailable until weather data loads.</p>}
      {has && (
        <div className="text-center">
          <svg viewBox="0 0 140 140" width="170" height="170" role="img" aria-label={`Humidity ${humidity} percent, ${status}`}>
            <circle cx="70" cy="70" r={R} fill="none" stroke="var(--bs-tertiary-bg)" strokeWidth="14" />
            <circle
              cx="70" cy="70" r={R} fill="none" stroke={COLORS[status]} strokeWidth="14" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - humidity / 100)} transform="rotate(-90 70 70)"
              style={{ transition: 'stroke-dashoffset .6s ease' }}
            />
            <text x="70" y="76" textAnchor="middle" fontSize="28" fontWeight="700" fill="currentColor">{humidity}%</text>
          </svg>
          <div className="mt-1"><StatusBadge status={status} className="fs-6" /></div>
          <p className="small text-body-secondary mt-2 mb-0">Optimal range is 40-70%.</p>
        </div>
      )}
    </section>
  );
}
