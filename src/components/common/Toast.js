import { useApp } from '../../context/AppContext';

export default function Toast() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="toast-wrap no-print" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast show align-items-center text-bg-${t.type} border-0 mb-2`} role="alert">
          <div className="d-flex">
            <div className="toast-body">
              <i className={`bi ${t.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`} aria-hidden="true" />
              {t.message}
            </div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={() => dismissToast(t.id)} />
          </div>
        </div>
      ))}
    </div>
  );
}
