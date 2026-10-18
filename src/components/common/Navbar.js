import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function Navbar({ onMenu }) {
  const { alerts, darkMode, setDarkMode } = useApp();
  const [open, setOpen] = useState(false);
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <header className="topbar navbar bg-body border-bottom px-3 no-print">
      <div className="d-flex align-items-center gap-2">
        <button type="button" className="btn btn-outline-secondary d-lg-none" onClick={onMenu} aria-label="Open menu">
          <i className="bi bi-list" />
        </button>
        <Link to="/" className="navbar-brand fw-bold text-success mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-flower1" aria-hidden="true" /> AgriManager
        </Link>
        <span className="text-body-secondary small d-none d-md-inline ms-2">
          <i className="bi bi-calendar3 me-1" aria-hidden="true" />{today}
        </span>
      </div>

      <div className="d-flex align-items-center gap-2 position-relative">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setDarkMode(!darkMode)}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          <i className={`bi ${darkMode ? 'bi-sun' : 'bi-moon-stars'}`} />
        </button>

        <button type="button" className="btn btn-outline-secondary position-relative" onClick={() => setOpen(!open)} aria-label={`Alerts (${alerts.length})`} aria-expanded={open}>
          <i className="bi bi-bell" />
          {alerts.length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{alerts.length}</span>
          )}
        </button>

        {open && (
          <>
            <div className="click-away" onClick={() => setOpen(false)} />
            <div className="dropdown-menu dropdown-menu-end show alerts-menu p-2 shadow">
              <div className="fw-semibold px-2 pb-1">Alerts ({alerts.length})</div>
              {alerts.length === 0 && <div className="px-2 py-2 text-body-secondary small">All clear. No alerts right now.</div>}
              <div className="alerts-scroll">
                {alerts.map((a) => (
                  <div key={a.id} className="d-flex gap-2 px-2 py-2 small border-top">
                    <i className={`bi ${a.icon} text-${a.level}`} aria-hidden="true" />
                    <div><div className="fw-semibold">{a.title}</div><div className="text-body-secondary">{a.message}</div></div>
                  </div>
                ))}
              </div>
              <Link to="/" className="btn btn-sm btn-success w-100 mt-2" onClick={() => setOpen(false)}>Open dashboard</Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
