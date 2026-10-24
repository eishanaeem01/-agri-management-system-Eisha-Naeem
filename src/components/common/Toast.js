import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dismissToast } from '../../store/actions/uiActions';

const ICONS = { success: 'bi-check-circle-fill', danger: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' };

function ToastItem({ toast }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const t = setTimeout(() => dispatch(dismissToast(toast.id)), 3500);
    return () => clearTimeout(t);
  }, [dispatch, toast.id]);
  return (
    <div className={`toast show align-items-center text-bg-${toast.type} border-0 mb-2`} role="alert" aria-live="assertive">
      <div className="d-flex">
        <div className="toast-body"><i className={`bi ${ICONS[toast.type]} me-2`} aria-hidden="true" />{toast.message}</div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={() => dispatch(dismissToast(toast.id))} />
      </div>
    </div>
  );
}

// Success and error notifications (saved, deleted, validation failed)
export default function Toast() {
  const toasts = useSelector((s) => s.ui.toasts);
  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 2000 }}>
      {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
}
