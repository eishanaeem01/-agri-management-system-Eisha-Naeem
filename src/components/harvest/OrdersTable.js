import { useMemo, useState } from 'react';
import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';
import { ORDER_STATUSES, formatDate, formatNumber } from '../../utils/formatters';

export default function OrdersTable({ orders, cropsById, onEdit, onDelete, onStatusChange }) {
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('date-desc');

  const rows = useMemo(() => {
    const list = orders.filter((o) => filter === 'All' || o.status === filter);
    const by = {
      'date-desc': (a, b) => b.orderDate.localeCompare(a.orderDate),
      'date-asc': (a, b) => a.orderDate.localeCompare(b.orderDate),
      'qty-desc': (a, b) => b.quantity - a.quantity,
      'qty-asc': (a, b) => a.quantity - b.quantity,
    }[sort];
    return [...list].sort(by);
  }, [orders, filter, sort]);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="row g-2 mb-3">
          <div className="col-6 col-md-3">
            <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter orders by status">
              <option value="All">All statuses</option>
              {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-3">
            <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort orders">
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="qty-desc">Quantity: high to low</option>
              <option value="qty-asc">Quantity: low to high</option>
            </select>
          </div>
        </div>
        {rows.length === 0 ? (
          <EmptyState icon="bi-receipt" title={orders.length ? 'No orders match this filter' : 'No orders yet'} message={orders.length ? '' : 'Use "New order" to record one.'} />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead><tr><th>Crop</th><th className="text-end">Quantity (kg)</th><th>Order date</th><th>Status</th><th>Change status</th><th className="text-end no-print">Actions</th></tr></thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o.id}>
                    <td className="fw-semibold">{cropsById[o.cropId]?.name || 'Unknown crop'}</td>
                    <td className="text-end">{formatNumber(o.quantity)}</td>
                    <td>{formatDate(o.orderDate)}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="no-print" style={{ minWidth: 130 }}>
                      <select className="form-select form-select-sm" value={o.status} onChange={(e) => onStatusChange(o.id, e.target.value)} aria-label="Change order status">
                        {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="text-end text-nowrap no-print">
                      <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => onEdit(o)} aria-label="Edit order"><i className="bi bi-pencil" /></button>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(o)} aria-label="Delete order"><i className="bi bi-trash" /></button>
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
