import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import EmptyState from '../common/EmptyState';
import { useApp } from '../../context/AppContext';
import { healthStatus } from '../../utils/formatters';
import { chartColors } from '../../utils/chartTheme';

export default function CropHealthChart({ crops }) {
  const { darkMode } = useApp();
  const col = chartColors(darkMode);
  const counts = { Healthy: 0, 'Needs Attention': 0, Critical: 0 };
  crops.forEach((c) => (counts[healthStatus(c.healthScore)] += 1));

  const data = {
    labels: Object.keys(counts),
    datasets: [{ data: Object.values(counts), backgroundColor: [col.green, col.amber, col.red], borderWidth: 0 }],
  };
  const options = { maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'bottom', labels: { color: col.text } } } };

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header fw-semibold"><i className="bi bi-pie-chart me-2 text-success" aria-hidden="true" />Health distribution</div>
      <div className="card-body">
        {crops.length === 0 ? <EmptyState icon="bi-pie-chart" title="No data to chart" /> : <div className="chart-box"><Doughnut data={data} options={options} /></div>}
      </div>
    </div>
  );
}
