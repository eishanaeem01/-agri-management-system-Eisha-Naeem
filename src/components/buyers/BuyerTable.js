import React, { useMemo, useState } from 'react';
import SearchBar from '../common/SearchBar';
import EmptyState from '../common/EmptyState';
import { formatDate, formatNumber } from '../../utils/formatters';

// Photo thumbnail, name, CNIC, crop, quantity, date. Search by name or CNIC, sort by date or quantity.
export default function BuyerTable({ buyers, crops, onView, onEdit, onDelete, canEdit, canDelete }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('date-desc');
  const nameOf = (id) => crops.find((c) => c.id === id)?.name || 'Deleted crop';

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const digits = q.replace(/\D/g, '');
    const list = buyers.filter((b) => !q || b.name.toLowerCase().includes(q) || (digits && b.cnic.replace(/\D/g, '').includes(digits)) || b.cnic.includes(q));
    const by = {
      'date-desc': (a, b) => b.date.localeCompare(a.date),
      'date-asc': (a, b) => a.date.localeCompare(b.date),
      'qty-desc': (a, b) => b.quantity - a.quantity,
      'qty-asc': (a, b) => a.quantity - b.quantity,
    }[sort];
    return [...list].sort(by);
  }, [buyers, query, sort]);

  return (
    <div>
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-6"><SearchBar onChange={setQuery} placeholder="Search by name or CNIC" /></div>
        <div className="col-12 col-md-4">
          <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort buyers">
            <option value="date-desc">Newest first</option><option value="date-asc">Oldest first</option>
            <option value="qty-desc">Quantity high to low</option><option value="qty-asc">Quantity low to high</option>
          </select>
        </div>
      </div>
      {rows.length === 0 ? (
        <EmptyState icon="bi-people" title={buyers.length ? 'No matching buyers' : 'No buyers recorded'} message={buyers.length ? 'Try a different name or CNIC.' : 'Add the first buyer to see it here.'} />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead><tr><th>Photo</th><th>Name</th><th>CNIC</th><th>Crop</th><th className="text-end">Qty (kg)</th><th>Date</th><th className="text-end">Actions</th></tr></thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id}>
                  <td><button className="btn p-0 border-0" onClick={() => onView(b)} aria-label={`View ${b.name}`}><img src={b.imageBase64} alt={b.name} className="thumb" /></button></td>
                  <td className="fw-semibold">{b.name}</td>
                  <td className="text-nowrap">{b.cnic}</td>
                  <td>{nameOf(b.cropId)}</td>
                  <td className="text-end">{formatNumber(b.quantity)}</td>
                  <td>{formatDate(b.date)}</td>
                  <td className="text-end text-nowrap">
                    <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => onView(b)} aria-label="View details"><i className="bi bi-eye" /></button>
                    {canEdit && <button className="btn btn-sm btn-outline-primary me-1" onClick={() => onEdit(b)} aria-label="Edit buyer"><i className="bi bi-pencil" /></button>}
                    {canDelete && <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(b)} aria-label="Delete buyer"><i className="bi bi-trash" /></button>}
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
