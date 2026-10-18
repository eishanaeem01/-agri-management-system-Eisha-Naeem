import PageHeader from '../components/common/PageHeader';
import WeatherCard from '../components/dashboard/WeatherCard';
import HumidityGauge from '../components/dashboard/HumidityGauge';
import ForecastStrip from '../components/dashboard/ForecastStrip';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import CropHealthList from '../components/dashboard/CropHealthList';
import CropHealthChart from '../components/dashboard/CropHealthChart';
import CuttingSchedule from '../components/dashboard/CuttingSchedule';
import HarvestSummary from '../components/harvest/HarvestSummary';
import OrdersSummary from '../components/harvest/OrdersSummary';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const { crops, totals, alerts, weather, city, cities, setCity } = useApp();
  const { data, loading, error } = weather;

  return (
    <>
      <PageHeader title="Farm dashboard" subtitle="Field conditions, crop health, harvest progress and orders at a glance." />

      <div className="row g-3 mb-3">
        <div className="col-lg-5"><WeatherCard weather={weather} city={city} cities={cities} onCityChange={setCity} /></div>
        <div className="col-md-5 col-lg-3"><HumidityGauge humidity={data?.humidity} loading={loading} error={error} /></div>
        <div className="col-md-7 col-lg-4"><AlertsPanel alerts={alerts} /></div>
      </div>

      <div className="mb-3"><ForecastStrip daily={data?.daily} loading={loading} error={error} /></div>

      <div className="mb-3"><HarvestSummary totals={totals} /></div>
      <div className="mb-3"><OrdersSummary totals={totals} /></div>

      <div className="row g-3 mb-3">
        <div className="col-lg-7"><CropHealthList crops={crops} /></div>
        <div className="col-lg-5"><CropHealthChart crops={crops} /></div>
      </div>

      <CuttingSchedule crops={crops} />
    </>
  );
}
