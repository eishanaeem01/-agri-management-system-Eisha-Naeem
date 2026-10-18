import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ConfirmModal from './ConfirmModal';

const LINKS = [
  { to: '/', label: 'Dashboard', icon: 'bi-speedometer2' },
  { to: '/crops', label: 'Crops', icon: 'bi-flower1' },
  { to: '/harvest-orders', label: 'Harvest & Orders', icon: 'bi-basket3' },
  { to: '/buyers', label: 'Buyers', icon: 'bi-people' },
];

export default function Sidebar({ open, onClose }) {
  const { resetDemoData } = useApp();
  const [confirm, setConfirm] = useState(false);

  return (
    <>
      <aside className={`sidebar no-print ${open ? 'open' : ''}`} aria-label="Main navigation">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="fs-5 fw-bold d-flex align-items-center gap-2"><i className="bi bi-flower1" aria-hidden="true" /> AgriManager</div>
          <button type="button" className="btn btn-sm btn-outline-light d-lg-none" onClick={onClose} aria-label="Close menu"><i className="bi bi-x-lg" /></button>
        </div>
        <nav className="nav flex-column gap-1">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={onClose} className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`}>
              <i className={`bi ${l.icon}`} aria-hidden="true" /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-3 border-top border-light border-opacity-25">
          <button type="button" className="btn btn-sm btn-outline-light w-100" onClick={() => setConfirm(true)}>
            <i className="bi bi-arrow-counterclockwise me-1" /> Reset demo data
          </button>
        </div>
      </aside>
      {open && <div className="sidebar-backdrop d-lg-none" onClick={onClose} />}
      <ConfirmModal
        show={confirm}
        title="Reset demo data"
        message="This replaces all crops, orders and buyers with the sample data. Continue?"
        confirmText="Reset"
        onConfirm={() => { resetDemoData(); setConfirm(false); }}
        onCancel={() => setConfirm(false)}
      />
    </>
  );
}
