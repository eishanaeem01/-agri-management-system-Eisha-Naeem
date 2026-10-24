import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, toggleTheme, dismissAllAlerts } from '../../store/actions/uiActions';
import { logout } from '../../store/actions/authActions';
import { selectAlerts } from '../../store/selectors';
import StatusBadge from './StatusBadge';

export default function Navbar() {
  const dispatch = useDispatch();
  const { name, role } = useSelector((s) => s.auth);
  const theme = useSelector((s) => s.ui.theme);
  const alerts = useSelector(selectAlerts);
  const [open, setOpen] = useState(false);
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <header className="topbar d-flex align-items-center gap-2 gap-md-3 px-3">
      <button className="btn btn-sm btn-outline-secondary d-lg-none" onClick={() => dispatch(toggleSidebar())} aria-label="Open menu">
        <i className="bi bi-list fs-5" />
      </button>
      <div className="me-auto">
        <div className="fw-semibold brand-title">AgriManager</div>
        <div className="small text-body-secondary d-none d-sm-block">{today}</div>
      </div>

      <div className="position-relative">
        <button className="btn btn-sm btn-outline-secondary position-relative" onClick={() => setOpen((o) => !o)} aria-label={`Alerts (${alerts.length})`} aria-expanded={open}>
          <i className="bi bi-bell" />
          {alerts.length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{alerts.length}</span>}
        </button>
        {open && (
          <div className="dropdown-menu dropdown-menu-end show alert-menu p-0 shadow">
            <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
              <strong className="small">Alerts</strong>
              {alerts.length > 0 && (
                <button className="btn btn-link btn-sm p-0" onClick={() => dispatch(dismissAllAlerts(alerts.map((a) => a.id)))}>Clear all</button>
              )}
            </div>
            <div className="alert-menu-list">
              {alerts.length === 0 && <div className="p-3 small text-body-secondary">No active alerts.</div>}
              {alerts.slice(0, 6).map((a) => (
                <div key={a.id} className="px-3 py-2 border-bottom small">
                  <i className={`bi ${a.icon} me-2 text-${a.level}`} />
                  <strong>{a.title}</strong>
                  <div className="text-body-secondary">{a.message}</div>
                </div>
              ))}
            </div>
            <Link to="/" className="d-block text-center small py-2" onClick={() => setOpen(false)}>Open dashboard</Link>
          </div>
        )}
      </div>

      <button className="btn btn-sm btn-outline-secondary" onClick={() => dispatch(toggleTheme())} aria-label="Toggle dark mode">
        <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon-stars'}`} />
      </button>

      <div className="d-none d-md-flex align-items-center gap-2">
        <span className="small fw-medium">{name}</span>
        <StatusBadge status={role} />
      </div>
      <button className="btn btn-sm btn-success" onClick={() => dispatch(logout())}>
        <i className="bi bi-box-arrow-right me-1" />
        <span className="d-none d-sm-inline">Logout</span>
      </button>
    </header>
  );
}
