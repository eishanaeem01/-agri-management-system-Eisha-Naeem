export default function EmptyState({ icon = 'bi-inbox', title = 'Nothing here yet', message, children }) {
  return (
    <div className="text-center text-body-secondary py-4 px-3">
      <i className={`bi ${icon} display-6 d-block mb-2`} aria-hidden="true" />
      <div className="fw-semibold">{title}</div>
      {message && <div className="small">{message}</div>}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
