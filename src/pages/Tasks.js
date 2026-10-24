import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import ModalShell from '../components/common/ModalShell';
import ConfirmModal from '../components/common/ConfirmModal';
import StatCard from '../components/common/StatCard';
import usePermissions from '../hooks/usePermissions';
import useToast from '../hooks/useToast';
import { addTask, updateTask, removeTask } from '../store/actions/taskActions';
import { selectTasks } from '../store/selectors';

export default function Tasks() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { canAdd, canEdit, canDelete } = usePermissions();
  const crops = useSelector((s) => s.crops);
  const tasks = useSelector(selectTasks);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const count = (st) => tasks.filter((t) => t.status === st).length;

  const save = (data) => {
    const { daysLeft, ...clean } = data; // derived field, never stored
    if (clean.id) { dispatch(updateTask(clean)); toast.success('Task updated'); }
    else { dispatch(addTask(clean)); toast.success('Task added'); }
    setEditing(null);
  };
  const toggleDone = (t) => {
    dispatch(updateTask({ id: t.id, status: t.status === 'Done' ? 'Pending' : 'Done' }));
    toast.success(t.status === 'Done' ? 'Task reopened' : 'Task marked done');
  };
  const confirmDelete = () => { dispatch(removeTask(deleting.id)); toast.success('Task deleted'); setDeleting(null); };

  return (
    <>
      <div className="page-head d-flex flex-wrap justify-content-between align-items-end gap-2">
        <div><h1>Farm tasks</h1><p>Irrigation, fertilizer, spraying and labour, linked to crops.</p></div>
        {canAdd && <button className="btn btn-success" onClick={() => setEditing({})} disabled={!crops.length}><i className="bi bi-plus-lg me-1" />Add task</button>}
      </div>
      <div className="row g-3 mb-3">
        <div className="col-4"><StatCard icon="bi-hourglass-split" title="Pending" value={count('Pending')} variant="warning" /></div>
        <div className="col-4"><StatCard icon="bi-calendar-x" title="Overdue" value={count('Overdue')} variant="danger" /></div>
        <div className="col-4"><StatCard icon="bi-check2-circle" title="Done" value={count('Done')} variant="success" /></div>
      </div>
      <div className="panel">
        <TaskList tasks={tasks} crops={crops} onEdit={setEditing} onDelete={setDeleting} onToggleDone={toggleDone} canEdit={canEdit} canDelete={canDelete} />
      </div>
      <ModalShell show={Boolean(editing)} title={editing?.id ? 'Edit task' : 'Add task'} onClose={() => setEditing(null)}>
        {editing && <TaskForm initial={editing.id ? editing : null} crops={crops} onSubmit={save} onCancel={() => setEditing(null)} />}
      </ModalShell>
      <ConfirmModal show={Boolean(deleting)} title="Delete task?" message={`Delete "${deleting?.title}"?`} onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />
    </>
  );
}
