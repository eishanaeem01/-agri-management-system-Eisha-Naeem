import React, { useMemo, useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import { formatDate, formatNumber } from '../../utils/formatters';

// Orders list with status change (Admin), edit and delete
export default function OrdersTable({ orders, crops, onEdit, onDelete, onStatusChange, canEdit, canDelete }) {
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('date-desc');
  const nameOf = (id) => crops.find((c) => c.id === id)?.name || 'Deleted crop';

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
    <div>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <select className="form-select w-auto" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter orders by status">
          <option>All</option><option>Pending</option><option>Delivered</option>
        </select>
        <select className="form-select w-auto" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort orders">
          <option value="date-desc">Newest first</option><option value="date-asc">Oldest first</option>
          <option value="qty-desc">Quantity high to low</option><option value="qty-asc">Quantity low to high</option>
        </select>
      </div>
      {rows.length === 0 ? (
        <EmptyState icon="bi-receipt" title="No orders" message="Create an order to see it here." />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead><tr><th>Crop</th><th className="text-end">Quantity (kg)</th><th>Order date</th><th>Status</th><th className="text-end">Actions</th></tr></thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id}>
                  <td className="fw-semibold">{nameOf(o.cropId)}</td>
                  <td className="text-end">{formatNumber(o.quantity)}</td>
                  <td>{formatDate(o.orderDate)}</td>
                  <td>
                    {canEdit ? (
                      <select className="form-select form-select-sm w-auto" value={o.status} onChange={(e) => onStatusChange(o, e.target.value)} aria-label="Change order status">
                        <option>Pending</option><option>Delivered</option>
                      </select>
                    ) : <StatusBadge status={o.status} />}
                  </td>
                  <td className="text-end text-nowrap">
                    {canEdit && <button className="btn btn-sm btn-outline-primary me-1" onClick={() => onEdit(o)} aria-label="Edit order"><i className="bi bi-pencil" /></button>}
                    {canDelete && <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(o)} aria-label="Delete order"><i className="bi bi-trash" /></button>}
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
