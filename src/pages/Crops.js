import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import ConfirmModal from '../components/common/ConfirmModal';
import CropForm from '../components/crops/CropForm';
import CropTable from '../components/crops/CropTable';
import { useApp } from '../context/AppContext';

export default function Crops() {
  const { crops, stock, addCrop, updateCrop, deleteCrop } = useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (crop) => { setEditing(crop); setFormOpen(true); };
  const close = () => setFormOpen(false);

  const save = (data) => {
    if (editing) updateCrop(editing.id, data);
    else addCrop(data);
    close();
  };

  return (
    <>
      <PageHeader title="Crops" subtitle="Add, edit and track every crop in your fields.">
        <button type="button" className="btn btn-success" onClick={openAdd}><i className="bi bi-plus-lg me-1" />Add crop</button>
      </PageHeader>

      <CropTable crops={crops} onEdit={openEdit} onDelete={setToDelete} />

      <CropForm show={formOpen} initial={editing} minQty={editing ? stock[editing.id]?.sold || 0 : 0} onSave={save} onClose={close} />
      <ConfirmModal
        show={!!toDelete}
        title="Delete crop"
        message={toDelete ? `Delete "${toDelete.name}" (${toDelete.field})? Its orders and buyer records will be deleted too. This cannot be undone.` : ''}
        onConfirm={() => { deleteCrop(toDelete.id); setToDelete(null); }}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
