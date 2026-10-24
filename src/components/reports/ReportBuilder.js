import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import useLocalStorage from '../../hooks/useLocalStorage';
import { selectReportData } from '../../store/selectors';
import { exportSectionsCsv, exportSectionsPdf, printSections } from '../../utils/reportExport';
import { formatCurrency, formatDate, formatNumber, monthLabel, todayStr } from '../../utils/formatters';
import StatCard from '../common/StatCard';
import EmptyState from '../common/EmptyState';

const SECTION_LIST = [
  { key: 'harvest', label: 'Harvest' },
  { key: 'sales', label: 'Sales' },
  { key: 'expenses', label: 'Expenses' },
];

// Choose month and sections, preview, print and export to CSV or PDF
export default function ReportBuilder({ onNotify }) {
  const [prefs, setPrefs] = useLocalStorage('agri_report_prefs', { month: todayStr().slice(0, 7), sections: ['harvest', 'sales', 'expenses'] });
  const month = prefs.month || todayStr().slice(0, 7);
  const data = useSelector((s) => selectReportData(s, month));

  const sections = useMemo(() => {
    const out = [];
    if (prefs.sections.includes('harvest'))
      out.push({ title: 'Harvest', columns: ['Crop', 'Field', 'Cutting date', 'Quantity (kg)'], rows: data.harvest.map((c) => [c.name, c.field, formatDate(c.cuttingDate), c.harvestQty]) });
    if (prefs.sections.includes('sales'))
      out.push({ title: 'Sales', columns: ['Date', 'Buyer', 'Crop', 'Quantity (kg)', 'Revenue (Rs)'], rows: data.sales.map((b) => [formatDate(b.date), b.name, b.cropName, b.quantity, Math.round(b.revenue)]) });
    if (prefs.sections.includes('expenses'))
      out.push({ title: 'Expenses', columns: ['Date', 'Crop', 'Category', 'Note', 'Amount (Rs)'], rows: data.expenses.map((e) => [formatDate(e.date), e.cropName, e.category, e.note || '', e.amount]) });
    out.push({
      title: 'Summary',
      columns: ['Metric', 'Value'],
      rows: [['Total harvest (kg)', data.totalHarvest], ['Quantity sold (kg)', data.totalSoldQty], ['Revenue (Rs)', Math.round(data.revenue)], ['Expenses (Rs)', data.expense], ['Net profit / loss (Rs)', Math.round(data.net)]],
    });
    return out;
  }, [data, prefs.sections]);

  const heading = `Monthly farm report - ${monthLabel(month)}`;
  const toggle = (key) =>
    setPrefs({ ...prefs, sections: prefs.sections.includes(key) ? prefs.sections.filter((k) => k !== key) : [...prefs.sections, key] });
  const empty = !data.harvest.length && !data.sales.length && !data.expenses.length;

  const run = async (fn, okMsg) => {
    try { await fn(); onNotify?.('success', okMsg); } catch (e) { onNotify?.('error', 'Export failed. Please try again.'); }
  };

  return (
    <div>
      <div className="row g-3 align-items-end mb-3">
        <div className="col-md-3">
          <label className="form-label" htmlFor="report-month">Month</label>
          <input id="report-month" type="month" className="form-control" value={month} onChange={(e) => e.target.value && setPrefs({ ...prefs, month: e.target.value })} />
        </div>
        <div className="col-md-4">
          <div className="form-label mb-1">Sections</div>
          {SECTION_LIST.map((s) => (
            <div key={s.key} className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id={`sec-${s.key}`} checked={prefs.sections.includes(s.key)} onChange={() => toggle(s.key)} />
              <label className="form-check-label" htmlFor={`sec-${s.key}`}>{s.label}</label>
            </div>
          ))}
        </div>
        <div className="col-md-5 d-flex flex-wrap gap-2 justify-content-md-end">
          <button className="btn btn-outline-secondary" onClick={() => printSections(heading, sections)}><i className="bi bi-printer me-1" />Print</button>
          <button className="btn btn-outline-success" onClick={() => run(() => exportSectionsCsv(`report-${month}.csv`, heading, sections), 'Report exported to CSV')}><i className="bi bi-filetype-csv me-1" />CSV</button>
          <button className="btn btn-success" onClick={() => run(() => exportSectionsPdf(`report-${month}.pdf`, heading, sections), 'Report exported to PDF')}><i className="bi bi-file-earmark-pdf me-1" />PDF</button>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-6 col-lg-3"><StatCard icon="bi-basket3" title="Harvest" value={`${formatNumber(data.totalHarvest)} kg`} variant="success" /></div>
        <div className="col-6 col-lg-3"><StatCard icon="bi-cart-check" title="Revenue" value={formatCurrency(data.revenue)} trend={`${formatNumber(data.totalSoldQty)} kg sold`} variant="info" /></div>
        <div className="col-6 col-lg-3"><StatCard icon="bi-cash-coin" title="Expenses" value={formatCurrency(data.expense)} variant="warning" /></div>
        <div className="col-6 col-lg-3"><StatCard icon="bi-graph-up-arrow" title={data.net >= 0 ? 'Net profit' : 'Net loss'} value={formatCurrency(Math.abs(data.net))} variant={data.net >= 0 ? 'success' : 'danger'} /></div>
      </div>

      {empty && <EmptyState icon="bi-file-earmark-bar-graph" title={`No records in ${monthLabel(month)}`} message="Pick another month to see harvest, sales and expenses." />}
      {sections.filter((s) => s.title !== 'Summary').map((s) => (
        <div key={s.title} className="mb-4">
          <h3 className="h6">{s.title}</h3>
          {s.rows.length === 0 ? <p className="text-body-secondary small">No {s.title.toLowerCase()} records this month.</p> : (
            <div className="table-responsive">
              <table className="table table-sm">
                <thead><tr>{s.columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
                <tbody>{s.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{typeof c === 'number' ? formatNumber(c) : c}</td>)}</tr>)}</tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
