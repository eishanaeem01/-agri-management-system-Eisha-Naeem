import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import EmptyState from '../common/EmptyState';
import { useApp } from '../../context/AppContext';
import { formatMonth, monthKey } from '../../utils/formatters';
import { chartColors } from '../../utils/chartTheme';

// Harvest (by cutting-date month) versus sales (by sale-date month).
export default function HarvestChart({ crops, buyers }) {
  const { darkMode } = useApp();
  const col = chartColors(darkMode);
  const months = [...new Set([...crops.map((c) => monthKey(c.cuttingDate)), ...buyers.map((b) => monthKey(b.date))])].sort();
  const sum = (items, dateKey, qtyKey, m) => items.filter((i) => monthKey(i[dateKey]) === m).reduce((a, i) => a + (Number(i[qtyKey]) || 0), 0);

  const data = {
    labels: months.map(formatMonth),
    datasets: [
      { label: 'Harvest (kg)', data: months.map((m) => sum(crops, 'cuttingDate', 'harvestQty', m)), backgroundColor: col.green, borderRadius: 4 },
      { label: 'Sold (kg)', data: months.map((m) => sum(buyers, 'date', 'quantity', m)), backgroundColor: col.amber, borderRadius: 4 },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: col.text } } },
    scales: { x: { ticks: { color: col.text }, grid: { display: false } }, y: { beginAtZero: true, ticks: { color: col.text }, grid: { color: col.grid } } },
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header fw-semibold"><i className="bi bi-bar-chart me-2 text-success" aria-hidden="true" />Harvest vs sales</div>
      <div className="card-body">{months.length === 0 ? <EmptyState icon="bi-bar-chart" title="No data to chart" /> : <div className="chart-box"><Bar data={data} options={options} /></div>}</div>
    </div>
  );
}
