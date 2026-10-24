import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseTable from '../components/expenses/ExpenseTable';
import ProfitLossChart from '../components/expenses/ProfitLossChart';
import ModalShell from '../components/common/ModalShell';
import ConfirmModal from '../components/common/ConfirmModal';
import StatCard from '../components/common/StatCard';
import usePermissions from '../hooks/usePermissions';
import useToast from '../hooks/useToast';
import { addExpense, updateExpense, removeExpense } from '../store/actions/expenseActions';
import { selectFinanceTotals, selectProfitByCrop } from '../store/selectors';
import { exportCsv } from '../utils/exportCsv';
import { formatCurrency } from '../utils/formatters';

export default function Expenses() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { canAdd, canEdit, canDelete } = usePermissions();
  const crops = useSelector((s) => s.crops);
  const expenses = useSelector((s) => s.expenses);
  const profitRows = useSelector(selectProfitByCrop);
  const totals = useSelector(selectFinanceTotals);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const save = (data) => {
    if (data.id) { dispatch(updateExpense(data)); toast.success('Expense updated'); }
    else { dispatch(addExpense(data)); toast.success('Expense added'); }
    setEditing(null);
  };
  const confirmDelete = () => { dispatch(removeExpense(deleting.id)); toast.success('Expense deleted'); setDeleting(null); };
  const exportExpenses = () => {
    if (!expenses.length) return toast.error('There are no expenses to export');
    exportCsv('expenses.csv', expenses.map((e) => ({ date: e.date, crop: crops.find((c) => c.id === e.cropId)?.name || '', category: e.category, amount: e.amount, note: e.note })));
    toast.success('Expenses exported to CSV');
  };

  return (
    <>
      <div className="page-head d-flex flex-wrap justify-content-between align-items-end gap-2">
        <div><h1>Expenses and profit / loss</h1><p>Profit or loss is revenue from sales minus recorded expenses.</p></div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success" onClick={exportExpenses}><i className="bi bi-download me-1" />Export CSV</button>
          {canAdd && <button className="btn btn-success" onClick={() => setEditing({})} disabled={!crops.length}><i className="bi bi-plus-lg me-1" />Add expense</button>}
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-md-4"><StatCard icon="bi-cash-stack" title="Total revenue" value={formatCurrency(totals.revenue)} variant="success" /></div>
        <div className="col-md-4"><StatCard icon="bi-receipt-cutoff" title="Total expenses" value={formatCurrency(totals.expense)} variant="warning" /></div>
        <div className="col-md-4"><StatCard icon="bi-graph-up-arrow" title={totals.profit >= 0 ? 'Net profit' : 'Net loss'} value={formatCurrency(Math.abs(totals.profit))} variant={totals.profit >= 0 ? 'success' : 'danger'} /></div>
      </div>
      <div className="mb-3"><ProfitLossChart rows={profitRows} /></div>
      <div className="panel">
        <h2 className="panel-title">Expense records</h2>
        <ExpenseTable expenses={expenses} crops={crops} onEdit={setEditing} onDelete={setDeleting} canEdit={canEdit} canDelete={canDelete} />
      </div>
      <ModalShell show={Boolean(editing)} title={editing?.id ? 'Edit expense' : 'Add expense'} onClose={() => setEditing(null)}>
        {editing && <ExpenseForm initial={editing.id ? editing : null} crops={crops} onSubmit={save} onCancel={() => setEditing(null)} />}
      </ModalShell>
      <ConfirmModal show={Boolean(deleting)} title="Delete expense?" message="This expense will be removed and profit recalculated." onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />
    </>
  );
}
