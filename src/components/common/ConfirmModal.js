import Modal from './Modal';

export default function ConfirmModal({ show, title = 'Please confirm', message, confirmText = 'Delete', variant = 'danger', onConfirm, onCancel }) {
  return (
    <Modal
      show={show}
      title={title}
      size="sm"
      onClose={onCancel}
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
          <button type="button" className={`btn btn-${variant}`} onClick={onConfirm}>{confirmText}</button>
        </>
      }
    >
      <p className="mb-0">{message}</p>
    </Modal>
  );
}
