import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HarvestSummary from '../components/harvest/HarvestSummary';
import OrdersSummary from '../components/harvest/OrdersSummary';
import StockProgressBar from '../components/harvest/StockProgressBar';
import HarvestChart from '../components/harvest/HarvestChart';
import OrderForm from '../components/harvest/OrderForm';
import OrdersTable from '../components/harvest/OrdersTable';
import ModalShell from '../components/common/ModalShell';
import ConfirmModal from '../components/common/ConfirmModal';
import usePermissions from '../hooks/usePermissions';
import useToast from '../hooks/useToast';
import { addOrder, updateOrder, removeOrder } from '../store/actions/orderActions';
import { selectCropStock, selectHarvestTotals, selectMonthlySeries, selectOrderTotals } from '../store/selectors';
import { exportCsv } from '../utils/exportCsv';

export default function HarvestOrders() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { canAdd, canEdit, canDelete } = usePermissions();
  const crops = useSelector((s) => s.crops);
  const orders = useSelector((s) => s.orders);
  const stock = useSelector(selectCropStock);
  const harvest = useSelector(selectHarvestTotals);
  const orderTotals = useSelector(selectOrderTotals);
  const series = useSelector(selectMonthlySeries);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const save = (data) => {
    if (data.id) { dispatch(updateOrder(data)); toast.success('Order updated'); }
    else { dispatch(addOrder(data)); toast.success('Order created'); }
    setEditing(null);
  };
  const changeStatus = (order, status) => {
    dispatch(updateOrder({ id: order.id, status }));
    toast.success(`Order marked ${status}`);
  };
  const confirmDelete = () => { dispatch(removeOrder(deleting.id)); toast.success('Order deleted'); setDeleting(null); };
  const exportOrders = () => {
    if (!orders.length) return toast.error('There are no orders to export');
    exportCsv('orders.csv', orders.map((o) => ({ id: o.id, crop: crops.find((c) => c.id === o.cropId)?.name || '', quantity_kg: o.quantity, order_date: o.orderDate, status: o.status })));
    toast.success('Orders exported to CSV');
  };

  return (
    <>
      <div className="page-head d-flex flex-wrap justify-content-between align-items-end gap-2">
        <div><h1>Harvest and orders</h1><p>Stock left after sales, and every order received.</p></div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success" onClick={exportOrders}><i className="bi bi-download me-1" />Export CSV</button>
          {canAdd && <button className="btn btn-success" onClick={() => setEditing({})} disabled={!crops.length}><i className="bi bi-plus-lg me-1" />New order</button>}
        </div>
      </div>
      <div className="mb-3"><HarvestSummary totals={harvest} /></div>
      <div className="mb-3"><OrdersSummary totals={orderTotals} /></div>
      <div className="row g-3 mb-3">
        <div className="col-lg-8"><HarvestChart series={series} /></div>
        <div className="col-lg-4"><StockProgressBar crops={stock} /></div>
      </div>
      <div className="panel">
        <h2 className="panel-title">Orders</h2>
        <OrdersTable orders={orders} crops={crops} onEdit={setEditing} onDelete={setDeleting} onStatusChange={changeStatus} canEdit={canEdit} canDelete={canDelete} />
      </div>
      <ModalShell show={Boolean(editing)} title={editing?.id ? 'Edit order' : 'New order'} onClose={() => setEditing(null)}>
        {editing && <OrderForm initial={editing.id ? editing : null} crops={crops} onSubmit={save} onCancel={() => setEditing(null)} />}
      </ModalShell>
      <ConfirmModal show={Boolean(deleting)} title="Delete order?" message="This order will be removed permanently." onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />
    </>
  );
}
