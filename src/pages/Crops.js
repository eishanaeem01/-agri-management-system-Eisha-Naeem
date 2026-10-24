import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CropForm from '../components/crops/CropForm';
import CropTable from '../components/crops/CropTable';
import ModalShell from '../components/common/ModalShell';
import ConfirmModal from '../components/common/ConfirmModal';
import usePermissions from '../hooks/usePermissions';
import useToast from '../hooks/useToast';
import { addCrop, updateCrop, removeCrop } from '../store/actions/cropActions';

export default function Crops() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { canAdd, canEdit, canDelete } = usePermissions();
  const crops = useSelector((s) => s.crops);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, crop = edit
  const [deleting, setDeleting] = useState(null);

  const save = (data) => {
    if (data.id) { dispatch(updateCrop(data)); toast.success(`${data.name} updated`); }
    else { dispatch(addCrop(data)); toast.success(`${data.name} added`); }
    setEditing(null);
  };
  const confirmDelete = () => {
    dispatch(removeCrop(deleting.id));
    toast.success(`${deleting.name} deleted`);
    setDeleting(null);
  };

  return (
    <>
      <div className="page-head d-flex flex-wrap justify-content-between align-items-end gap-2">
        <div><h1>Crops</h1><p>Track every crop, its health score and cutting date.</p></div>
        {canAdd && <button className="btn btn-success" onClick={() => setEditing({})}><i className="bi bi-plus-lg me-1" />Add crop</button>}
      </div>
      <div className="panel">
        <CropTable crops={crops} onEdit={setEditing} onDelete={setDeleting} canEdit={canEdit} canDelete={canDelete} />
      </div>
      <ModalShell show={Boolean(editing)} title={editing?.id ? 'Edit crop' : 'Add crop'} onClose={() => setEditing(null)} size="modal-lg">
        {editing && <CropForm initial={editing.id ? editing : null} onSubmit={save} onCancel={() => setEditing(null)} />}
      </ModalShell>
      <ConfirmModal show={Boolean(deleting)} title="Delete crop?" message={`Delete ${deleting?.name} (${deleting?.field})? Orders, tasks and expenses linked to it will show "Deleted crop".`} onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />
    </>
  );
}
