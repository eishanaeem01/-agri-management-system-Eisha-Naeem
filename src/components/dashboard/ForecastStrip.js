import React from 'react';

// Next 5 days as small cards with icon and min / max temperature
export default function ForecastStrip({ forecast = [] }) {
  if (!forecast.length) return null;
  return (
    <section className="panel" aria-label="5 day forecast">
      <h2 className="panel-title">Next 5 days</h2>
      <div className="forecast-strip">
        {forecast.map((d) => (
          <div key={d.date} className="forecast-card">
            <div className="fw-semibold small">{new Date(d.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}</div>
            <i className={`bi ${d.icon} fs-3`} title={d.condition} />
            <div className="small"><strong>{d.max}&deg;</strong> / <span className="text-body-secondary">{d.min}&deg;</span></div>
            <div className="small text-body-secondary"><i className="bi bi-droplet-half" /> {d.rainChance}%</div>
          </div>
        ))}
      </div>
    </section>
  );
}
