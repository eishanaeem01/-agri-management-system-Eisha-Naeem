import React, { useMemo, useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import { formatDate } from '../../utils/formatters';

const ICON = { Irrigation: 'bi-droplet', Fertilizer: 'bi-flower1', Spraying: 'bi-wind', Labour: 'bi-people' };

// Farm tasks grouped by due date; filter by status and crop; complete, edit, delete
export default function TaskList({ tasks, crops, onEdit, onDelete, onToggleDone, canEdit, canDelete }) {
  const [status, setStatus] = useState('All');
  const [cropId, setCropId] = useState('All');
  const nameOf = (id) => crops.find((c) => c.id === id)?.name || 'Deleted crop';

  const rows = useMemo(
    () => tasks.filter((t) => (status === 'All' || t.status === status) && (cropId === 'All' || t.cropId === cropId)).sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [tasks, status, cropId]
  );

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <select className="form-select w-auto" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option>All</option><option>Pending</option><option>Done</option><option>Overdue</option>
        </select>
        <select className="form-select w-auto" value={cropId} onChange={(e) => setCropId(e.target.value)} aria-label="Filter by crop">
          <option value="All">All crops</option>
          {crops.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {rows.length === 0 ? (
        <EmptyState icon="bi-calendar-check" title="No tasks found" message="Add a task or change the filters." />
      ) : (
        <ul className="list-group task-list">
          {rows.map((t) => (
            <li key={t.id} className={`list-group-item d-flex flex-wrap align-items-center gap-2 ${t.status === 'Overdue' ? 'task-overdue' : ''}`}>
              <i className={`bi ${ICON[t.type] || 'bi-check2-square'} fs-5 text-success`} aria-hidden="true" />
              <div className="flex-grow-1">
                <div className={`fw-semibold ${t.status === 'Done' ? 'text-decoration-line-through text-body-secondary' : ''}`}>{t.title}</div>
                <div className="small text-body-secondary">{t.type} - {nameOf(t.cropId)} - due {formatDate(t.dueDate)}
                  {t.status === 'Pending' && t.daysLeft <= 3 && <span className="text-warning-emphasis ms-1">({t.daysLeft === 0 ? 'today' : `in ${t.daysLeft} day(s)`})</span>}
                </div>
              </div>
              <StatusBadge status={t.status} />
              <div className="text-nowrap">
                {canEdit && (
                  <button className="btn btn-sm btn-outline-success me-1" onClick={() => onToggleDone(t)} aria-label={t.status === 'Done' ? 'Reopen task' : 'Mark task done'}>
                    <i className={`bi ${t.status === 'Done' ? 'bi-arrow-counterclockwise' : 'bi-check-lg'}`} />
                  </button>
                )}
                {canEdit && <button className="btn btn-sm btn-outline-primary me-1" onClick={() => onEdit(t)} aria-label="Edit task"><i className="bi bi-pencil" /></button>}
                {canDelete && <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(t)} aria-label="Delete task"><i className="bi bi-trash" /></button>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
