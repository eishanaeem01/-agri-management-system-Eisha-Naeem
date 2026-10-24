import { createSelector } from '@reduxjs/toolkit';
import { daysBetween, humidityStatus, formatDate } from '../../utils/formatters';

/* ---------- base input selectors ---------- */
const selCrops = (s) => s.crops;
const selOrders = (s) => s.orders;
const selBuyers = (s) => s.buyers;
const selTasks = (s) => s.tasks;
const selExpenses = (s) => s.expenses;
const selInventory = (s) => s.inventory;
const selWeatherData = (s) => s.weather.data;
const selDismissed = (s) => s.alerts.dismissed;

export const DUE_SOON_DAYS = 3;
export const LOW_STOCK_RATIO = 0.2;

/* ---------- crops, stock, harvest ---------- */
export const selectSoldByCrop = createSelector([selBuyers], (buyers) =>
  buyers.reduce((map, b) => {
    map[b.cropId] = (map[b.cropId] || 0) + Number(b.quantity);
    return map;
  }, {})
);

// crops + sold / remaining / soldPct (stock is derived, never stored)
export const selectCropStock = createSelector([selCrops, selectSoldByCrop], (crops, sold) =>
  crops.map((c) => {
    const s = sold[c.id] || 0;
    const harvest = Number(c.harvestQty) || 0;
    return { ...c, sold: s, remaining: Math.max(0, harvest - s), soldPct: harvest ? Math.min(100, Math.round((s / harvest) * 100)) : 0 };
  })
);

export const selectHarvestTotals = createSelector([selectCropStock], (crops) => {
  const harvested = crops.reduce((n, c) => n + (Number(c.harvestQty) || 0), 0);
  const sold = crops.reduce((n, c) => n + c.sold, 0);
  return { harvested, sold, remaining: Math.max(0, harvested - sold) };
});

export const selectOrderTotals = createSelector([selOrders], (orders) => {
  const pending = orders.filter((o) => o.status === 'Pending');
  const delivered = orders.filter((o) => o.status === 'Delivered');
  const qty = (list) => list.reduce((n, o) => n + Number(o.quantity), 0);
  return {
    count: orders.length,
    quantity: qty(orders),
    pending: pending.length,
    pendingQty: qty(pending),
    delivered: delivered.length,
    deliveredQty: qty(delivered),
  };
});

export const selectCropHealthCounts = createSelector([selCrops], (crops) => ({
  Healthy: crops.filter((c) => c.status === 'Healthy').length,
  'Needs Attention': crops.filter((c) => c.status === 'Needs Attention').length,
  Critical: crops.filter((c) => c.status === 'Critical').length,
}));

export const selectLowStock = createSelector([selectCropStock], (crops) =>
  crops.filter((c) => Number(c.harvestQty) > 0 && c.remaining / c.harvestQty <= LOW_STOCK_RATIO)
);

// schedule rows: every crop with daysLeft + state (overdue | due | upcoming), soonest first
export const selectSchedule = createSelector([selCrops], (crops) =>
  crops
    .map((c) => {
      const daysLeft = daysBetween(c.cuttingDate);
      return { ...c, daysLeft, state: daysLeft < 0 ? 'overdue' : daysLeft <= DUE_SOON_DAYS ? 'due' : 'upcoming' };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft)
);

export const selectDueCrops = createSelector([selectSchedule], (rows) => rows.filter((r) => r.state !== 'upcoming'));

// available stock for one crop (optionally ignoring a buyer record that is being edited)
export const selectAvailableStock = (state, cropId, ignoreBuyerId = null) => {
  const crop = state.crops.find((c) => c.id === cropId);
  if (!crop) return 0;
  const sold = state.buyers
    .filter((b) => b.cropId === cropId && b.id !== ignoreBuyerId)
    .reduce((n, b) => n + Number(b.quantity), 0);
  return Math.max(0, Number(crop.harvestQty) - sold);
};

// monthly harvest vs sales vs orders (for HarvestChart)
export const selectMonthlySeries = createSelector([selCrops, selBuyers, selOrders], (crops, buyers, orders) => {
  const map = {};
  const bucket = (date) => (map[date.slice(0, 7)] ||= { month: date.slice(0, 7), harvest: 0, sold: 0, orders: 0 });
  crops.forEach((c) => (bucket(c.cuttingDate).harvest += Number(c.harvestQty) || 0));
  buyers.forEach((b) => (bucket(b.date).sold += Number(b.quantity)));
  orders.forEach((o) => (bucket(o.orderDate).orders += Number(o.quantity)));
  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
});

/* ---------- tasks ---------- */
// stored status is Pending | Done; "Overdue" is derived from the due date
export const selectTasks = createSelector([selTasks], (tasks) =>
  tasks.map((t) => {
    const daysLeft = daysBetween(t.dueDate);
    return { ...t, daysLeft, status: t.status === 'Done' ? 'Done' : daysLeft < 0 ? 'Overdue' : 'Pending' };
  })
);
export const selectOverdueTasks = createSelector([selectTasks], (tasks) => tasks.filter((t) => t.status === 'Overdue'));

/* ---------- inventory ---------- */
export const selectLowInventory = createSelector([selInventory], (items) => items.filter((i) => Number(i.qty) < Number(i.minQty)));

/* ---------- finance ---------- */
export const selectProfitByCrop = createSelector([selectCropStock, selExpenses], (crops, expenses) =>
  crops.map((c) => {
    const revenue = c.sold * (Number(c.pricePerKg) || 0);
    const expense = expenses.filter((e) => e.cropId === c.id).reduce((n, e) => n + Number(e.amount), 0);
    return { cropId: c.id, name: c.name, revenue, expense, profit: revenue - expense };
  })
);
export const selectFinanceTotals = createSelector([selectProfitByCrop], (rows) => {
  const revenue = rows.reduce((n, r) => n + r.revenue, 0);
  const expense = rows.reduce((n, r) => n + r.expense, 0);
  return { revenue, expense, profit: revenue - expense };
});

/* ---------- alerts ---------- */
const selectAllAlerts = createSelector(
  [selectLowStock, selectDueCrops, selCrops, selectTasks, selectLowInventory, selWeatherData],
  (lowStock, due, crops, tasks, lowInv, weather) => {
    const list = [];
    if (weather && humidityStatus(weather.humidity) === 'High')
      list.push({ id: 'humidity-high', level: 'warning', icon: 'bi-moisture', title: 'High humidity', message: `Humidity is ${weather.humidity}%. Watch for fungal disease in standing crops.` });
    crops
      .filter((c) => c.status === 'Critical')
      .forEach((c) => list.push({ id: `critical-${c.id}`, level: 'danger', icon: 'bi-heart-pulse', title: 'Critical crop health', message: `${c.name} (${c.field}) health score is ${c.healthScore}%.` }));
    lowStock.forEach((c) =>
      list.push({ id: `stock-${c.id}`, level: 'warning', icon: 'bi-box-seam', title: 'Low stock', message: `${c.name}: only ${c.remaining} kg left of ${c.harvestQty} kg.` })
    );
    due.forEach((c) =>
      list.push({
        id: `cut-${c.id}`,
        level: c.state === 'overdue' ? 'danger' : 'warning',
        icon: 'bi-scissors',
        title: c.state === 'overdue' ? 'Cutting overdue' : 'Cutting date near',
        message: `${c.name} (${c.field}): ${c.state === 'overdue' ? `${Math.abs(c.daysLeft)} day(s) overdue` : c.daysLeft === 0 ? 'due today' : `due in ${c.daysLeft} day(s)`} - ${formatDate(c.cuttingDate)}.`,
      })
    );
    tasks.forEach((t) => {
      if (t.status === 'Overdue')
        list.push({ id: `task-overdue-${t.id}`, level: 'danger', icon: 'bi-calendar-x', title: 'Task overdue', message: `${t.title} was due ${formatDate(t.dueDate)}.` });
      else if (t.status === 'Pending' && t.daysLeft <= DUE_SOON_DAYS)
        list.push({ id: `task-due-${t.id}`, level: 'info', icon: 'bi-calendar-event', title: 'Task due soon', message: `${t.title} is due ${t.daysLeft === 0 ? 'today' : `in ${t.daysLeft} day(s)`}.` });
    });
    lowInv.forEach((i) =>
      list.push({ id: `inv-${i.id}`, level: 'warning', icon: 'bi-basket', title: 'Low inventory', message: `${i.item}: ${i.qty} ${i.unit} left (minimum ${i.minQty}).` })
    );
    return list;
  }
);

export const selectAlerts = createSelector([selectAllAlerts, selDismissed], (alerts, dismissed) =>
  alerts.filter((a) => !dismissed.includes(a.id))
);
export const selectAlertCount = createSelector([selectAlerts], (a) => a.length);

/* ---------- monthly report ---------- */
export const selectReportData = createSelector(
  [selCrops, selBuyers, selExpenses, (s, month) => month],
  (crops, buyers, expenses, month) => {
    const cropOf = (id) => crops.find((c) => c.id === id);
    const harvest = crops.filter((c) => c.cuttingDate.startsWith(month));
    const sales = buyers
      .filter((b) => b.date.startsWith(month))
      .map((b) => ({ ...b, cropName: cropOf(b.cropId)?.name || '-', revenue: Number(b.quantity) * (Number(cropOf(b.cropId)?.pricePerKg) || 0) }));
    const exp = expenses.filter((e) => e.date.startsWith(month)).map((e) => ({ ...e, cropName: cropOf(e.cropId)?.name || '-' }));
    const totalHarvest = harvest.reduce((n, c) => n + Number(c.harvestQty), 0);
    const totalSoldQty = sales.reduce((n, b) => n + Number(b.quantity), 0);
    const revenue = sales.reduce((n, b) => n + b.revenue, 0);
    const expense = exp.reduce((n, e) => n + Number(e.amount), 0);
    return { harvest, sales, expenses: exp, totalHarvest, totalSoldQty, revenue, expense, net: revenue - expense };
  }
);
