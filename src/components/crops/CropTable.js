import { useMemo, useState } from 'react';
import EmptyState from '../common/EmptyState';
import SearchBar from '../common/SearchBar';
import StatusBadge from '../common/StatusBadge';
import { daysLabel, daysUntil, formatDate, formatNumber, healthStatus } from '../../utils/formatters';

const SORTS = [
  { key: 'cuttingDate', label: 'Cutting date' },
  { key: 'harvestQty', label: 'Quantity' },
  { key: 'healthScore', label: 'Health score' },
  { key: 'name', label: 'Name' },
];

export default function CropTable({ crops, onEdit, onDelete }) {
  const [query, setQuery] = useState('');
  const [health, setHealth] = useState('All');
  const [sortKey, setSortKey] = useState('cuttingDate');
  const [dir, setDir] = useState('asc');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const m = dir === 'asc' ? 1 : -1;
    return crops
      .filter((c) => (health === 'All' || healthStatus(c.healthScore) === health) && (!q || `${c.name} ${c.field}`.toLowerCase().includes(q)))
      .sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        return (typeof av === 'string' ? av.localeCompare(bv) : (Number(av) || 0) - (Number(bv) || 0)) * m;
      });
  }, [crops, query, health, sortKey, dir]);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="row g-2 mb-3">
          <div className="col-lg-5"><SearchBar onSearch={setQuery} placeholder="Search by crop or field" /></div>
          <div className="col-6 col-lg-2">
            <select className="form-select" value={health} onChange={(e) => setHealth(e.target.value)} aria-label="Filter by health status">
              <option value="All">All health</option>
              <option>Healthy</option><option>Needs Attention</option><option>Critical</option>
            </select>
          </div>
          <div className="col-6 col-lg-3">
            <select className="form-select" value={sortKey} onChange={(e) => setSortKey(e.target.value)} aria-label="Sort by">
              {SORTS.map((s) => <option key={s.key} value={s.key}>Sort: {s.label}</option>)}
            </select>
          </div>
          <div className="col-lg-2">
            <button type="button" className="btn btn-outline-secondary w-100" onClick={() => setDir(dir === 'asc' ? 'desc' : 'asc')}>
              <i className={`bi ${dir === 'asc' ? 'bi-sort-up' : 'bi-sort-down'} me-1`} />{dir === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState icon="bi-flower1" title={crops.length ? 'No crops match your filters' : 'No crops yet'} message={crops.length ? 'Try a different search or filter.' : 'Use "Add crop" to create your first record.'} />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr><th>Crop</th><th>Field</th><th>Planted</th><th>Cutting date</th><th>Health</th><th className="text-end">Quantity (kg)</th><th className="text-end no-print">Actions</th></tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td className="fw-semibold">{c.name}</td>
                    <td>{c.field}</td>
                    <td>{formatDate(c.plantingDate)}</td>
                    <td>{formatDate(c.cuttingDate)}<div className="small text-body-secondary">{daysLabel(daysUntil(c.cuttingDate))}</div></td>
                    <td><div className="d-flex align-items-center gap-2"><span className="fw-semibold">{c.healthScore}</span><StatusBadge status={healthStatus(c.healthScore)} /></div></td>
                    <td className="text-end">{formatNumber(c.harvestQty)}</td>
                    <td className="text-end text-nowrap no-print">
                      <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => onEdit(c)} aria-label={`Edit ${c.name}`}><i className="bi bi-pencil" /></button>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(c)} aria-label={`Delete ${c.name}`}><i className="bi bi-trash" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
