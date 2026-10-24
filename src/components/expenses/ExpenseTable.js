import React, { useMemo, useState } from 'react';
import EmptyState from '../common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function ExpenseTable({ expenses, crops, onEdit, onDelete, canEdit, canDelete }) {
  const [cropId, setCropId] = useState('All');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('date-desc');
  const nameOf = (id) => crops.find((c) => c.id === id)?.name || 'Deleted crop';

  const rows = useMemo(() => {
    const by = {
      'date-desc': (a, b) => b.date.localeCompare(a.date),
      'date-asc': (a, b) => a.date.localeCompare(b.date),
      'amt-desc': (a, b) => b.amount - a.amount,
      'amt-asc': (a, b) => a.amount - b.amount,
    }[sort];
    return expenses.filter((e) => (cropId === 'All' || e.cropId === cropId) && (category === 'All' || e.category === category)).sort(by);
  }, [expenses, cropId, category, sort]);
  const total = rows.reduce((n, e) => n + Number(e.amount), 0);

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <select className="form-select w-auto" value={cropId} onChange={(e) => setCropId(e.target.value)} aria-label="Filter by crop">
          <option value="All">All crops</option>{crops.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="form-select w-auto" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          <option value="All">All categories</option><option>Seeds</option><option>Fertilizer</option><option>Labour</option><option>Fuel</option>
        </select>
        <select className="form-select w-auto" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort expenses">
          <option value="date-desc">Newest first</option><option value="date-asc">Oldest first</option>
          <option value="amt-desc">Amount high to low</option><option value="amt-asc">Amount low to high</option>
        </select>
      </div>
      {rows.length === 0 ? (
        <EmptyState icon="bi-cash-coin" title="No expenses" message="Record an expense to track profit and loss." />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead><tr><th>Date</th><th>Crop</th><th>Category</th><th>Note</th><th className="text-end">Amount</th><th className="text-end">Actions</th></tr></thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id}>
                  <td>{formatDate(e.date)}</td>
                  <td className="fw-semibold">{nameOf(e.cropId)}</td>
                  <td><span className="badge text-bg-light border">{e.category}</span></td>
                  <td className="text-body-secondary">{e.note || '-'}</td>
                  <td className="text-end">{formatCurrency(e.amount)}</td>
                  <td className="text-end text-nowrap">
                    {canEdit && <button className="btn btn-sm btn-outline-primary me-1" onClick={() => onEdit(e)} aria-label="Edit expense"><i className="bi bi-pencil" /></button>}
                    {canDelete && <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(e)} aria-label="Delete expense"><i className="bi bi-trash" /></button>}
                    {!canEdit && !canDelete && <span className="text-body-secondary small">View only</span>}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><th colSpan="4">Total (filtered)</th><th className="text-end">{formatCurrency(total)}</th><th /></tr></tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
