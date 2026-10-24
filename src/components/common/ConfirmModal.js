import React from 'react';
import ModalShell from './ModalShell';

// Asks for confirmation before deleting any record
export default function ConfirmModal({ show, title = 'Delete record?', message, confirmText = 'Delete', onConfirm, onCancel }) {
  return (
    <ModalShell
      show={show}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>{confirmText}</button>
        </>
      }
    >
      <p className="mb-0">{message || 'This action cannot be undone.'}</p>
    </ModalShell>
  );
}
