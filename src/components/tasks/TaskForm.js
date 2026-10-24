import React, { useState } from 'react';
import { required } from '../../utils/validators';
import { daysFromNow } from '../../utils/formatters';

export const TASK_TYPES = ['Irrigation', 'Fertilizer', 'Spraying', 'Labour'];

export default function TaskForm({ initial, crops, onSubmit, onCancel }) {
  const [f, setF] = useState(
    initial ? { ...initial, status: initial.status === 'Done' ? 'Done' : 'Pending' } : { title: '', type: 'Irrigation', cropId: '', dueDate: daysFromNow(1), status: 'Pending' }
  );
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    const t = required(f.title, 'Task title');
    if (t) e.title = t;
    if (!f.cropId) e.cropId = 'Link the task to a crop';
    const d = required(f.dueDate, 'Due date');
    if (d) e.dueDate = d;
    setErrors(e);
    if (Object.keys(e).length) return;
    onSubmit({ ...f, title: f.title.trim() });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label" htmlFor="task-title">Task title</label>
          <input id="task-title" className={`form-control ${errors.title ? 'is-invalid' : ''}`} value={f.title} onChange={set('title')} placeholder="e.g. Irrigate Field A" />
          <div className="invalid-feedback">{errors.title}</div>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="task-type">Type</label>
          <select id="task-type" className="form-select" value={f.type} onChange={set('type')}>{TASK_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="task-crop">Crop</label>
          <select id="task-crop" className={`form-select ${errors.cropId ? 'is-invalid' : ''}`} value={f.cropId} onChange={set('cropId')}>
            <option value="">Select crop</option>
            {crops.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.field})</option>)}
          </select>
          <div className="invalid-feedback">{errors.cropId}</div>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="task-due">Due date</label>
          <input id="task-due" type="date" className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`} value={f.dueDate} onChange={set('dueDate')} />
          <div className="invalid-feedback">{errors.dueDate}</div>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="task-status">Status</label>
          <select id="task-status" className="form-select" value={f.status} onChange={set('status')}><option>Pending</option><option>Done</option></select>
          <div className="form-text">Pending tasks past their due date show as Overdue automatically.</div>
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-success">{initial ? 'Save changes' : 'Add task'}</button>
      </div>
    </form>
  );
}
