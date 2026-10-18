import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';
import { daysLabel, daysUntil, formatDate } from '../../utils/formatters';
import { CUTTING_SOON_DAYS } from '../../utils/alerts';

export function cuttingState(days) {
  if (days === null) return 'Upcoming';
  if (days < 0) return 'Overdue';
  if (days <= CUTTING_SOON_DAYS) return 'Due Soon';
  return 'Upcoming';
}

export default function CuttingSchedule({ crops }) {
  const rows = [...crops]
    .map((c) => ({ ...c, days: daysUntil(c.cuttingDate) }))
    .sort((a, b) => a.cuttingDate.localeCompare(b.cuttingDate));

  return (
    <div className="card shadow-sm">
      <div className="card-header fw-semibold"><i className="bi bi-scissors me-2 text-success" aria-hidden="true" />Crop cutting / harvest schedule</div>
      <div className="card-body p-0">
        {rows.length === 0 ? (
          <EmptyState icon="bi-calendar-x" title="No cutting dates yet" message="Add crops to build the schedule." />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead><tr><th>Crop</th><th>Field</th><th>Cutting date</th><th>Days remaining</th><th>Status</th></tr></thead>
              <tbody>
                {rows.map((c) => {
                  const state = cuttingState(c.days);
                  const cls = state === 'Overdue' ? 'table-danger' : state === 'Due Soon' ? 'table-warning' : '';
                  return (
                    <tr key={c.id} className={cls}>
                      <td className="fw-semibold">{c.name}</td>
                      <td>{c.field}</td>
                      <td>{formatDate(c.cuttingDate)}</td>
                      <td>{daysLabel(c.days)}</td>
                      <td><StatusBadge status={state} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
