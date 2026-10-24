import React from 'react';
import StatCard from '../common/StatCard';
import { formatNumber } from '../../utils/formatters';

export default function HarvestSummary({ totals }) {
  const soldPct = totals.harvested ? Math.round((totals.sold / totals.harvested) * 100) : 0;
  return (
    <div className="row g-3">
      <div className="col-12 col-md-4"><StatCard icon="bi-basket3" title="Total harvest" value={`${formatNumber(totals.harvested)} kg`} trend="Across all crops" variant="success" /></div>
      <div className="col-12 col-md-4"><StatCard icon="bi-cart-check" title="Quantity sold" value={`${formatNumber(totals.sold)} kg`} trend={`${soldPct}% of harvest`} variant="info" /></div>
      <div className="col-12 col-md-4"><StatCard icon="bi-box-seam" title="Quantity remaining" value={`${formatNumber(totals.remaining)} kg`} trend={`${100 - soldPct}% still in stock`} variant="warning" /></div>
    </div>
  );
}
