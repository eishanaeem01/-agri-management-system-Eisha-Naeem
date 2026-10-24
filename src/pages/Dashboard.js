import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useWeather from '../hooks/useWeather';
import WeatherCard from '../components/dashboard/WeatherCard';
import HumidityGauge from '../components/dashboard/HumidityGauge';
import ForecastStrip from '../components/dashboard/ForecastStrip';
import CropHealthList from '../components/dashboard/CropHealthList';
import CropHealthChart from '../components/dashboard/CropHealthChart';
import CuttingSchedule from '../components/dashboard/CuttingSchedule';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import HarvestSummary from '../components/harvest/HarvestSummary';
import OrdersSummary from '../components/harvest/OrdersSummary';
import StockProgressBar from '../components/harvest/StockProgressBar';
import HarvestChart from '../components/harvest/HarvestChart';
import StatCard from '../components/common/StatCard';
import { dismissAlert, dismissAllAlerts } from '../store/actions/uiActions';
import {
  selectAlerts, selectCropHealthCounts, selectCropStock, selectFinanceTotals, selectHarvestTotals,
  selectMonthlySeries, selectOrderTotals, selectOverdueTasks, selectSchedule,
} from '../store/selectors';
import { formatCurrency } from '../utils/formatters';

export default function Dashboard() {
  const dispatch = useDispatch();
  const weather = useWeather({ autoRefresh: false }); // AppLayout already polls; this just reads the store
  const crops = useSelector((s) => s.crops);
  const stock = useSelector(selectCropStock);
  const schedule = useSelector(selectSchedule);
  const counts = useSelector(selectCropHealthCounts);
  const alerts = useSelector(selectAlerts);
  const harvest = useSelector(selectHarvestTotals);
  const orders = useSelector(selectOrderTotals);
  const series = useSelector(selectMonthlySeries);
  const finance = useSelector(selectFinanceTotals);
  const overdue = useSelector(selectOverdueTasks);

  return (
    <>
      <div className="page-head"><h1>Farm dashboard</h1><p>Field conditions, crop health, harvest, orders, tasks and profit at a glance.</p></div>

      <div className="row g-3 mb-3">
        <div className="col-6 col-xl-3"><StatCard icon="bi-cash-stack" title="Revenue" value={formatCurrency(finance.revenue)} trend="From recorded sales" variant="success" /></div>
        <div className="col-6 col-xl-3"><StatCard icon="bi-receipt-cutoff" title="Expenses" value={formatCurrency(finance.expense)} trend="Seeds, fertilizer, labour, fuel" variant="warning" /></div>
        <div className="col-6 col-xl-3"><StatCard icon="bi-graph-up-arrow" title={finance.profit >= 0 ? 'Net profit' : 'Net loss'} value={formatCurrency(Math.abs(finance.profit))} trend="Revenue minus expenses" variant={finance.profit >= 0 ? 'success' : 'danger'} /></div>
        <div className="col-6 col-xl-3"><StatCard icon="bi-calendar-x" title="Overdue tasks" value={overdue.length} trend={overdue.length ? 'Needs action today' : 'Everything on schedule'} variant={overdue.length ? 'danger' : 'info'} /></div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-lg-5"><WeatherCard data={weather.data} loading={weather.loading} error={weather.error} lastUpdated={weather.lastUpdated} onRefresh={weather.refresh} /></div>
        <div className="col-md-5 col-lg-3"><HumidityGauge humidity={weather.data?.humidity} loading={weather.loading} /></div>
        <div className="col-md-7 col-lg-4"><AlertsPanel alerts={alerts} onDismiss={(id) => dispatch(dismissAlert(id))} onClearAll={() => dispatch(dismissAllAlerts(alerts.map((a) => a.id)))} /></div>
      </div>

      {weather.data && <div className="mb-3"><ForecastStrip forecast={weather.data.forecast} /></div>}

      <div className="row g-3 mb-3">
        <div className="col-lg-4"><CropHealthList crops={crops} /></div>
        <div className="col-lg-3"><CropHealthChart counts={counts} /></div>
        <div className="col-lg-5"><CuttingSchedule rows={schedule} limit={8} /></div>
      </div>

      <h2 className="section-title">Harvest and orders</h2>
      <div className="mb-3"><HarvestSummary totals={harvest} /></div>
      <div className="mb-3"><OrdersSummary totals={orders} /></div>
      <div className="row g-3">
        <div className="col-lg-8"><HarvestChart series={series} /></div>
        <div className="col-lg-4"><StockProgressBar crops={stock} /></div>
      </div>
    </>
  );
}
