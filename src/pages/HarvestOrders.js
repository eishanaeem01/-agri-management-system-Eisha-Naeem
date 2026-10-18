import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import ConfirmModal from '../components/common/ConfirmModal';
import HarvestSummary from '../components/harvest/HarvestSummary';
import OrdersSummary from '../components/harvest/OrdersSummary';
import StockProgressBar from '../components/harvest/StockProgressBar';
import HarvestChart from '../components/harvest/HarvestChart';
import OrdersChart from '../components/harvest/OrdersChart';
import OrderForm from '../components/harvest/OrderForm';
import OrdersTable from '../components/harvest/OrdersTable';
import { useApp } from '../context/AppContext';
import { exportCsv } from '../utils/exportCsv';
import { formatDate } from '../utils/formatters';

export default function HarvestOrders() {
  const { crops, orders, buyers, cropsById, stock, totals, addOrder, updateOrder, setOrderStatus, deleteOrder, notify } = useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const save = (data) => {
    if (editing) updateOrder(editing.id, data);
    else addOrder(data);
    setFormOpen(false);
  };

  const exportOrders = () => {
    if (!orders.length) return notify('There are no orders to export.', 'danger');
    exportCsv(
      orders,
      [
        { label: 'Crop', value: (o) => cropsById[o.cropId]?.name || 'Unknown crop' },
        { label: 'Quantity (kg)', key: 'quantity' },
        { label: 'Order date', value: (o) => formatDate(o.orderDate) },
        { label: 'Status', key: 'status' },
      ],
      'orders.csv'
    );
    return notify('Orders exported to CSV.');
  };

  return (
    <>
      <PageHeader title="Harvest & orders" subtitle="How much was harvested, sold and ordered, and what is left in stock.">
        <button type="button" className="btn btn-outline-success" onClick={exportOrders}><i className="bi bi-download me-1" />Export orders CSV</button>
        <button type="button" className="btn btn-success" onClick={() => { setEditing(null); setFormOpen(true); }}><i className="bi bi-plus-lg me-1" />New order</button>
      </PageHeader>

      <div className="mb-3"><HarvestSummary totals={totals} /></div>
      <div className="mb-3"><OrdersSummary totals={totals} /></div>

      <div className="row g-3 mb-3">
        <div className="col-lg-5"><StockProgressBar crops={crops} stock={stock} /></div>
        <div className="col-lg-7"><HarvestChart crops={crops} buyers={buyers} /></div>
      </div>
      <div className="mb-3"><OrdersChart orders={orders} /></div>

      <h2 className="h5 mb-2">Orders</h2>
      <OrdersTable orders={orders} cropsById={cropsById} onEdit={(o) => { setEditing(o); setFormOpen(true); }} onDelete={setToDelete} onStatusChange={setOrderStatus} />

      <OrderForm show={formOpen} initial={editing} crops={crops} onSave={save} onClose={() => setFormOpen(false)} />
      <ConfirmModal
        show={!!toDelete}
        title="Delete order"
        message="Delete this order? This cannot be undone."
        onConfirm={() => { deleteOrder(toDelete.id); setToDelete(null); }}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
