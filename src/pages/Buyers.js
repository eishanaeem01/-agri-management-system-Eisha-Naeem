import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BuyerForm from '../components/buyers/BuyerForm';
import BuyerTable from '../components/buyers/BuyerTable';
import BuyerDetailsModal from '../components/buyers/BuyerDetailsModal';
import ModalShell from '../components/common/ModalShell';
import ConfirmModal from '../components/common/ConfirmModal';
import usePermissions from '../hooks/usePermissions';
import useToast from '../hooks/useToast';
import { removeBuyer } from '../store/actions/buyerActions';
import { exportCsv } from '../utils/exportCsv';

export default function Buyers() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { canAdd, canEdit, canDelete } = usePermissions();
  const buyers = useSelector((s) => s.buyers);
  const crops = useSelector((s) => s.crops);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const saved = (buyer, wasEdit) => {
    toast.success(wasEdit ? `${buyer.name} updated` : `${buyer.name} saved successfully`);
    setEditing(null);
  };
  const confirmDelete = () => { dispatch(removeBuyer(deleting.id)); toast.success(`${deleting.name} deleted. Stock updated.`); setDeleting(null); };
  const exportBuyers = () => {
    if (!buyers.length) return toast.error('There are no buyers to export');
    exportCsv('buyers.csv', buyers.map((b) => ({ name: b.name, cnic: b.cnic, crop: crops.find((c) => c.id === b.cropId)?.name || '', quantity_kg: b.quantity, date: b.date })));
    toast.success('Buyers exported to CSV');
  };

  return (
    <>
      <div className="page-head d-flex flex-wrap justify-content-between align-items-end gap-2">
        <div><h1>Buyers</h1><p>Who bought which crop. Stock updates after every sale.</p></div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success" onClick={exportBuyers}><i className="bi bi-download me-1" />Export CSV</button>
          {canAdd && <button className="btn btn-success" onClick={() => setEditing({})} disabled={!crops.length}><i className="bi bi-person-plus me-1" />Add buyer</button>}
        </div>
      </div>
      <div className="panel">
        <BuyerTable buyers={buyers} crops={crops} onView={setViewing} onEdit={setEditing} onDelete={setDeleting} canEdit={canEdit} canDelete={canDelete} />
      </div>
      <ModalShell show={Boolean(editing)} title={editing?.id ? 'Edit buyer' : 'Add buyer'} onClose={() => setEditing(null)} size="modal-lg">
        {editing && <BuyerForm initial={editing.id ? editing : null} crops={crops} onSaved={saved} onCancel={() => setEditing(null)} />}
      </ModalShell>
      <BuyerDetailsModal buyer={viewing} crop={viewing && crops.find((c) => c.id === viewing.cropId)} onClose={() => setViewing(null)} />
      <ConfirmModal show={Boolean(deleting)} title="Delete buyer?" message={`Delete ${deleting?.name}? The ${deleting?.quantity} kg will return to stock.`} onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />
    </>
  );
}
