import StatCard from '../common/StatCard';
import { formatNumber } from '../../utils/formatters';

export default function OrdersSummary({ totals }) {
  return (
    <div className="row g-3">
      <div className="col-12 col-md-4"><StatCard icon="bi-receipt" title="Total orders received" value={formatNumber(totals.orders)} trend={`${formatNumber(totals.orderedQty)} kg ordered`} variant="info" /></div>
      <div className="col-6 col-md-4"><StatCard icon="bi-hourglass-split" title="Pending orders" value={formatNumber(totals.pending)} trend="Awaiting delivery" variant="warning" /></div>
      <div className="col-6 col-md-4"><StatCard icon="bi-check2-circle" title="Delivered orders" value={formatNumber(totals.delivered)} trend="Completed" variant="success" /></div>
    </div>
  );
}
