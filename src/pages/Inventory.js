import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InventoryForm from '../components/inventory/InventoryForm';
import InventoryTable from '../components/inventory/InventoryTable';
import ModalShell from '../components/common/ModalShell';
import ConfirmModal from '../components/common/ConfirmModal';
import StatCard from '../components/common/StatCard';
import usePermissions from '../hooks/usePermissions';
import useToast from '../hooks/useToast';
import { addInventory, updateInventory, removeInventory, consumeInventory } from '../store/actions/inventoryActions';
import { selectLowInventory } from '../store/selectors';

export default function Inventory() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { canAdd, canEdit, canDelete } = usePermissions();
  const items = useSelector((s) => s.inventory);
  const low = useSelector(selectLowInventory);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const save = (data) => {
    const { history, ...clean } = data; // usage history is managed only by the use action
    if (clean.id) { dispatch(updateInventory(clean)); toast.success(`${clean.item} updated`); }
    else { dispatch(addInventory(clean)); toast.success(`${clean.item} added`); }
    setEditing(null);
  };
  const logUse = (payload) => { dispatch(consumeInventory(payload)); toast.success('Usage logged. Stock updated.'); };
  const confirmDelete = () => { dispatch(removeInventory(deleting.id)); toast.success(`${deleting.item} deleted`); setDeleting(null); };

  return (
    <>
      <div className="page-head d-flex flex-wrap justify-content-between align-items-end gap-2">
        <div><h1>Inputs inventory</h1><p>Fertilizer, pesticide and seed stock with low-stock alerts.</p></div>
        {canAdd && <button className="btn btn-success" onClick={() => setEditing({})}><i className="bi bi-plus-lg me-1" />Add item</button>}
      </div>
      <div className="row g-3 mb-3">
        <div className="col-6"><StatCard icon="bi-box-seam" title="Items tracked" value={items.length} variant="success" /></div>
        <div className="col-6"><StatCard icon="bi-exclamation-triangle" title="Below minimum" value={low.length} trend={low.length ? low.map((i) => i.item).join(', ') : 'All stocked'} variant={low.length ? 'danger' : 'info'} /></div>
      </div>
      <div className="panel">
        <InventoryTable items={items} onEdit={setEditing} onDelete={setDeleting} onUse={logUse} canEdit={canEdit} canDelete={canDelete} />
      </div>
      <ModalShell show={Boolean(editing)} title={editing?.id ? 'Edit item' : 'Add item'} onClose={() => setEditing(null)}>
        {editing && <InventoryForm initial={editing.id ? editing : null} onSubmit={save} onCancel={() => setEditing(null)} />}
      </ModalShell>
      <ConfirmModal show={Boolean(deleting)} title="Delete item?" message={`Delete ${deleting?.item} and its usage history?`} onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />
    </>
  );
}
