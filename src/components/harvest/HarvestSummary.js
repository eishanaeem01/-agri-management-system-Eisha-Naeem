import StatCard from '../common/StatCard';
import { formatNumber } from '../../utils/formatters';

export default function HarvestSummary({ totals }) {
  const pct = (n) => (totals.harvest ? Math.round((n / totals.harvest) * 100) : 0);
  return (
    <div className="row g-3">
      <div className="col-12 col-md-4"><StatCard icon="bi-basket3" title="Total harvest quantity" value={`${formatNumber(totals.harvest)} kg`} trend={`${totals.cropCount} crop${totals.cropCount === 1 ? '' : 's'}`} variant="success" /></div>
      <div className="col-6 col-md-4"><StatCard icon="bi-cash-coin" title="Quantity sold" value={`${formatNumber(totals.sold)} kg`} trend={`${pct(totals.sold)}% of harvest`} variant="primary" /></div>
      <div className="col-6 col-md-4"><StatCard icon="bi-box-seam" title="Quantity remaining" value={`${formatNumber(totals.remaining)} kg`} trend={`${pct(totals.remaining)}% in stock`} variant="warning" /></div>
    </div>
  );
}
