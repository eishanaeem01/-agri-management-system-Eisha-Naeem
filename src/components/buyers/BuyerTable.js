import { useMemo, useState } from 'react';
import EmptyState from '../common/EmptyState';
import SearchBar from '../common/SearchBar';
import avatar from '../../assets/default-avatar.svg';
import { formatDate, formatNumber } from '../../utils/formatters';

export default function BuyerTable({ buyers, cropsById, onView, onEdit, onDelete, onExport }) {
  const [query, setQuery] = useState('');
  const [cropFilter, setCropFilter] = useState('All');
  const [sort, setSort] = useState('date-desc');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const digits = q.replace(/\D/g, '');
    const by = {
      'date-desc': (a, b) => b.date.localeCompare(a.date),
      'date-asc': (a, b) => a.date.localeCompare(b.date),
      'qty-desc': (a, b) => b.quantity - a.quantity,
      'qty-asc': (a, b) => a.quantity - b.quantity,
    }[sort];
    return buyers
      .filter((b) => (cropFilter === 'All' || b.cropId === cropFilter) && (!q || b.name.toLowerCase().includes(q) || b.cnic.includes(q) || (digits && b.cnic.replace(/-/g, '').includes(digits))))
      .sort(by);
  }, [buyers, query, cropFilter, sort]);

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span className="fw-semibold"><i className="bi bi-people me-2 text-success" aria-hidden="true" />Buyers ({buyers.length})</span>
        <button type="button" className="btn btn-sm btn-outline-success no-print" onClick={() => onExport(rows)} disabled={rows.length === 0}>
          <i className="bi bi-download me-1" />Export CSV
        </button>
      </div>
      <div className="card-body">
        <div className="row g-2 mb-3">
          <div className="col-lg-5"><SearchBar onSearch={setQuery} placeholder="Search by name or CNIC" /></div>
          <div className="col-6 col-lg-3">
            <select className="form-select" value={cropFilter} onChange={(e) => setCropFilter(e.target.value)} aria-label="Filter by crop">
              <option value="All">All crops</option>
              {Object.values(cropsById).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-6 col-lg-4">
            <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort buyers">
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="qty-desc">Quantity: high to low</option>
              <option value="qty-asc">Quantity: low to high</option>
            </select>
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState icon="bi-person-x" title={buyers.length ? 'No buyers match your search' : 'No buyers yet'} message={buyers.length ? 'Try a different name, CNIC or filter.' : 'Record your first sale using the form above.'} />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead><tr><th>Photo</th><th>Name</th><th>CNIC</th><th>Crop</th><th className="text-end">Quantity (kg)</th><th>Date</th><th className="text-end no-print">Actions</th></tr></thead>
              <tbody>
                {rows.map((b) => (
                  <tr key={b.id}>
                    <td><img src={b.imageBase64 || avatar} alt={`${b.name} thumbnail`} className="thumb" /></td>
                    <td className="fw-semibold">{b.name}</td>
                    <td className="text-nowrap">{b.cnic}</td>
                    <td>{cropsById[b.cropId]?.name || 'Unknown crop'}</td>
                    <td className="text-end">{formatNumber(b.quantity)}</td>
                    <td className="text-nowrap">{formatDate(b.date)}</td>
                    <td className="text-end text-nowrap no-print">
                      <button type="button" className="btn btn-sm btn-outline-secondary me-1" onClick={() => onView(b)} aria-label={`View ${b.name}`}><i className="bi bi-eye" /></button>
                      <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => onEdit(b)} aria-label={`Edit ${b.name}`}><i className="bi bi-pencil" /></button>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(b)} aria-label={`Delete ${b.name}`}><i className="bi bi-trash" /></button>
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
