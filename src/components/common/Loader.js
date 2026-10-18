export default function Loader({ text = 'Loading...', small = false }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-4 text-body-secondary" role="status" aria-live="polite">
      <div className={`spinner-border text-success ${small ? 'spinner-border-sm' : ''}`} aria-hidden="true" />
      <span className="mt-2 small">{text}</span>
    </div>
  );
}
