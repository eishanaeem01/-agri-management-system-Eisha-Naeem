import React, { useMemo, useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import SearchBar from '../common/SearchBar';
import { formatDate, formatNumber } from '../../utils/formatters';

const SORTS = [
  { key: 'cuttingDate', label: 'Cutting date' },
  { key: 'plantingDate', label: 'Planting date' },
  { key: 'harvestQty', label: 'Quantity' },
  { key: 'healthScore', label: 'Health score' },
  { key: 'name', label: 'Name' },
];

// All crops with search, filter by health status, sort, edit and delete
export default function CropTable({ crops, onEdit, onDelete, canEdit, canDelete }) {
  const [status, setStatus] = useState('All');
  const [sortKey, setSortKey] = useState('cuttingDate');
  const [dir, setDir] = useState('asc');
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return crops
      .filter((c) => (status === 'All' || c.status === status) && (!q || `${c.name} ${c.field}`.toLowerCase().includes(q)))
      .sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        const r = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return dir === 'asc' ? r : -r;
      });
  }, [crops, status, sortKey, dir, query]);

  return (
    <div>
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-4"><SearchBar onChange={setQuery} placeholder="Search crop or field" /></div>
        <div className="col-6 col-md-3">
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by health status">
            <option>All</option><option>Healthy</option><option>Needs Attention</option><option>Critical</option>
          </select>
        </div>
        <div className="col-6 col-md-3">
          <select className="form-select" value={sortKey} onChange={(e) => setSortKey(e.target.value)} aria-label="Sort by">
            {SORTS.map((s) => <option key={s.key} value={s.key}>Sort: {s.label}</option>)}
          </select>
        </div>
        <div className="col-12 col-md-2">
          <button className="btn btn-outline-secondary w-100" onClick={() => setDir(dir === 'asc' ? 'desc' : 'asc')}>
            <i className={`bi ${dir === 'asc' ? 'bi-sort-up' : 'bi-sort-down'} me-1`} />{dir === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon="bi-flower2" title="No crops found" message="Change the filters or add a new crop." />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr><th>Crop</th><th>Field</th><th>Planted</th><th>Cutting</th><th>Health</th><th className="text-end">Qty (kg)</th><th className="text-end">Price/kg</th><th className="text-end">Actions</th></tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td className="fw-semibold">{c.name}</td>
                  <td>{c.field}</td>
                  <td>{formatDate(c.plantingDate)}</td>
                  <td>{formatDate(c.cuttingDate)}</td>
                  <td><StatusBadge status={c.status} /> <span className="small text-body-secondary ms-1">{c.healthScore}</span></td>
                  <td className="text-end">{formatNumber(c.harvestQty)}</td>
                  <td className="text-end">{formatNumber(c.pricePerKg)}</td>
                  <td className="text-end text-nowrap">
                    {canEdit && <button className="btn btn-sm btn-outline-primary me-1" onClick={() => onEdit(c)} aria-label={`Edit ${c.name}`}><i className="bi bi-pencil" /></button>}
                    {canDelete && <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(c)} aria-label={`Delete ${c.name}`}><i className="bi bi-trash" /></button>}
                    {!canEdit && !canDelete && <span className="text-body-secondary small">View only</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
