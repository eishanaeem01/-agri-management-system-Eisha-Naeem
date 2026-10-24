import React from 'react';
import StatCard from '../common/StatCard';
import { formatNumber } from '../../utils/formatters';

export default function OrdersSummary({ totals }) {
  return (
    <div className="row g-3">
      <div className="col-12 col-md-4"><StatCard icon="bi-receipt" title="Total orders received" value={totals.count} trend={`${formatNumber(totals.quantity)} kg ordered`} variant="success" /></div>
      <div className="col-12 col-md-4"><StatCard icon="bi-hourglass-split" title="Pending orders" value={totals.pending} trend={`${formatNumber(totals.pendingQty)} kg waiting`} variant="warning" /></div>
      <div className="col-12 col-md-4"><StatCard icon="bi-truck" title="Delivered orders" value={totals.delivered} trend={`${formatNumber(totals.deliveredQty)} kg delivered`} variant="info" /></div>
    </div>
  );
}
