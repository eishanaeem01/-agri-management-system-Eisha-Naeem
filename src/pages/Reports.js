import React from 'react';
import { useSelector } from 'react-redux';
import ReportBuilder from '../components/reports/ReportBuilder';
import ActivityLog from '../components/reports/ActivityLog';
import usePermissions from '../hooks/usePermissions';
import useToast from '../hooks/useToast';

export default function Reports() {
  const { isAdmin } = usePermissions();
  const toast = useToast();
  const activity = useSelector((s) => s.activity);
  const notify = (type, msg) => (type === 'success' ? toast.success(msg) : toast.error(msg));

  return (
    <>
      <div className="page-head"><h1>Reports and activity log</h1><p>Monthly harvest, sales and expenses, plus a record of every change.</p></div>
      <div className="panel mb-3"><h2 className="panel-title">Monthly report</h2><ReportBuilder onNotify={notify} /></div>
      <div className="panel">
        <h2 className="panel-title">Activity log</h2>
        {isAdmin ? <ActivityLog entries={activity} /> : <p className="text-body-secondary mb-0"><i className="bi bi-shield-lock me-2" />The activity log is visible to Admin users only.</p>}
      </div>
    </>
  );
}
