import { daysUntil, healthStatus } from './formatters';

export const HIGH_HUMIDITY = 70;
export const LOW_STOCK_RATIO = 0.2;
export const CUTTING_SOON_DAYS = 3;

// Builds the automatic warnings: high humidity, low stock, critical crops, cutting within 3 days.
export function buildAlerts({ crops, stock, humidity }) {
  const alerts = [];
  if (typeof humidity === 'number' && humidity > HIGH_HUMIDITY) {
    alerts.push({ id: 'humidity', level: 'danger', icon: 'bi-droplet-half', title: 'High humidity', message: `Humidity is ${humidity}%. Disease risk is higher; review irrigation.` });
  }
  crops.forEach((c) => {
    const s = stock[c.id];
    if (s && s.harvest > 0 && s.remaining / s.harvest <= LOW_STOCK_RATIO) {
      const pct = Math.round((s.remaining / s.harvest) * 100);
      alerts.push({
        id: `stock-${c.id}`,
        level: s.remaining === 0 ? 'danger' : 'warning',
        icon: 'bi-box-seam',
        title: 'Low stock',
        message: s.remaining === 0 ? `${c.name} is sold out.` : `${c.name} has only ${s.remaining} kg left (${pct}%).`,
      });
    }
    if (healthStatus(c.healthScore) === 'Critical') {
      alerts.push({ id: `critical-${c.id}`, level: 'danger', icon: 'bi-heart-pulse', title: 'Critical crop health', message: `${c.name} (${c.field}) has a health score of ${c.healthScore}.` });
    }
    const d = daysUntil(c.cuttingDate);
    if (d !== null && d < 0) {
      alerts.push({ id: `overdue-${c.id}`, level: 'danger', icon: 'bi-calendar-x', title: 'Cutting overdue', message: `${c.name} (${c.field}) was due ${-d} day${-d === 1 ? '' : 's'} ago.` });
    } else if (d !== null && d <= CUTTING_SOON_DAYS) {
      alerts.push({ id: `cut-${c.id}`, level: 'warning', icon: 'bi-calendar-event', title: 'Cutting soon', message: `${c.name} (${c.field}) is due ${d === 0 ? 'today' : `in ${d} day${d === 1 ? '' : 's'}`}.` });
    }
  });
  const rank = { danger: 0, warning: 1, info: 2 };
  return alerts.sort((a, b) => rank[a.level] - rank[b.level]);
}
