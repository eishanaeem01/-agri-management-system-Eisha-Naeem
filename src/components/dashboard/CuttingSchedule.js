import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import { formatDate } from '../../utils/formatters';

const ROW = { overdue: 'table-danger', due: 'table-warning', upcoming: '' };

// Upcoming cutting dates with days remaining; due-soon and overdue rows are highlighted
export default function CuttingSchedule({ rows, limit }) {
  const list = limit ? rows.slice(0, limit) : rows;
  return (
    <section className="panel h-100" aria-label="Crop cutting schedule">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="panel-title">Crop cutting / harvest schedule</h2>
        <Link to="/crops" className="small">Manage crops</Link>
      </div>
      {list.length === 0 ? (
        <EmptyState icon="bi-scissors" title="No cutting dates" message="Add crops with a cutting date to see the schedule." />
      ) : (
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead><tr><th>Crop</th><th>Field</th><th>Cutting date</th><th>Days remaining</th></tr></thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className={ROW[c.state]}>
                  <td className="fw-semibold">{c.name}</td>
                  <td>{c.field}</td>
                  <td>{formatDate(c.cuttingDate)}</td>
                  <td>
                    {c.state === 'overdue' ? <StatusBadge status="Overdue" /> : null}{' '}
                    {c.state === 'overdue' ? `${Math.abs(c.daysLeft)} day(s) late` : c.daysLeft === 0 ? 'Due today' : `${c.daysLeft} day(s)`}
                    {c.state === 'due' && <span className="badge bg-warning text-dark ms-2">Due soon</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
