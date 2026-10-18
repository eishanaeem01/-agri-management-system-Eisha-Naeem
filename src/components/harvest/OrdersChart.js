import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import EmptyState from '../common/EmptyState';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';
import { chartColors } from '../../utils/chartTheme';

// Orders received over time (count and quantity per order date).
export default function OrdersChart({ orders }) {
  const { darkMode } = useApp();
  const col = chartColors(darkMode);
  const dates = [...new Set(orders.map((o) => o.orderDate))].sort();

  const data = {
    labels: dates.map(formatDate),
    datasets: [
      { label: 'Orders', data: dates.map((d) => orders.filter((o) => o.orderDate === d).length), borderColor: col.blue, backgroundColor: col.blue, tension: 0.3, yAxisID: 'y' },
      { label: 'Quantity ordered (kg)', data: dates.map((d) => orders.filter((o) => o.orderDate === d).reduce((a, o) => a + (Number(o.quantity) || 0), 0)), borderColor: col.green, backgroundColor: col.green, tension: 0.3, yAxisID: 'y1' },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { labels: { color: col.text } } },
    scales: {
      x: { ticks: { color: col.text }, grid: { display: false } },
      y: { beginAtZero: true, position: 'left', ticks: { color: col.text, precision: 0 }, grid: { color: col.grid }, title: { display: true, text: 'Orders', color: col.text } },
      y1: { beginAtZero: true, position: 'right', ticks: { color: col.text }, grid: { display: false }, title: { display: true, text: 'kg', color: col.text } },
    },
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header fw-semibold"><i className="bi bi-graph-up me-2 text-success" aria-hidden="true" />Orders over time</div>
      <div className="card-body">{dates.length === 0 ? <EmptyState icon="bi-graph-up" title="No orders to chart" /> : <div className="chart-box"><Line data={data} options={options} /></div>}</div>
    </div>
  );
}
