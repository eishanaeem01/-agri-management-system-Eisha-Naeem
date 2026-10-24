import React, { useState } from 'react';
import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';
import SearchBar from '../common/SearchBar';
import { formatDateTime } from '../../utils/formatters';

const ACTION_COLOR = { Added: 'success', Updated: 'primary', Deleted: 'danger', 'Used stock': 'warning', 'Logged in': 'secondary', 'Logged out': 'secondary' };

// Every add, edit and delete: who, when, what
export default function ActivityLog({ entries }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const rows = entries.filter((e) => !q || `${e.user} ${e.action} ${e.entity}`.toLowerCase().includes(q)).slice(0, 200);
  return (
    <div>
      <div className="mb-3 col-md-5 px-0"><SearchBar onChange={setQuery} placeholder="Search user, action or entity" /></div>
      {rows.length === 0 ? (
        <EmptyState icon="bi-journal-text" title="No activity yet" message="Adding, editing or deleting records will appear here." />
      ) : (
        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Entity</th></tr></thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id}>
                  <td className="text-nowrap">{formatDateTime(e.timestamp)}</td>
                  <td>{e.user} {e.role && e.role !== '-' && <StatusBadge status={e.role} className="ms-1" />}</td>
                  <td><span className={`badge text-bg-${ACTION_COLOR[e.action] || 'secondary'}`}>{e.action}</span></td>
                  <td>{e.entity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
