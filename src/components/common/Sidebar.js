import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { closeSidebar } from '../../store/actions/uiActions';

const LINKS = [
  { to: '/', label: 'Dashboard', icon: 'bi-speedometer2' },
  { to: '/crops', label: 'Crops', icon: 'bi-flower2' },
  { to: '/harvest-orders', label: 'Harvest and Orders', icon: 'bi-basket3' },
  { to: '/buyers', label: 'Buyers', icon: 'bi-people' },
  { to: '/tasks', label: 'Tasks', icon: 'bi-calendar-check' },
  { to: '/expenses', label: 'Expenses', icon: 'bi-cash-coin' },
  { to: '/inventory', label: 'Inventory', icon: 'bi-box-seam' },
  { to: '/reports', label: 'Reports', icon: 'bi-file-earmark-bar-graph' },
];

// Collapses off-canvas on mobile
export default function Sidebar() {
  const dispatch = useDispatch();
  const open = useSelector((s) => s.ui.sidebarOpen);
  return (
    <>
      {open && <div className="sidebar-backdrop d-lg-none" onClick={() => dispatch(closeSidebar())} />}
      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-brand"><i className="bi bi-tree-fill me-2" />AgriManager</div>
        <nav className="nav flex-column px-2">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className="sidebar-link" onClick={() => dispatch(closeSidebar())}>
              <i className={`bi ${l.icon}`} />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot small">U Devs Batch 6</div>
      </aside>
    </>
  );
}
