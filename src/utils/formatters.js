export const ORDER_STATUSES = ['Pending', 'Delivered', 'Cancelled'];

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const toISODate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
export const todayISO = () => toISODate(new Date());
export const addDays = (n, from = new Date()) => {
  const d = new Date(from);
  d.setDate(d.getDate() + n);
  return toISODate(d);
};
export const parseDate = (s) => {
  const [y, m, d] = String(s).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};
export const daysUntil = (s) => {
  if (!s) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((parseDate(s) - today) / 86400000);
};
export const daysLabel = (d) => {
  if (d === null) return '-';
  if (d < 0) return `Overdue by ${-d} day${-d === 1 ? '' : 's'}`;
  if (d === 0) return 'Due today';
  return `${d} day${d === 1 ? '' : 's'}`;
};

export const formatDate = (s) =>
  s ? parseDate(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
export const formatTime = (d) =>
  d ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-';
export const formatNumber = (n) => Number(n || 0).toLocaleString('en-US');
export const monthKey = (s) => String(s).slice(0, 7);
export const formatMonth = (key) =>
  parseDate(`${key}-01`).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

// 3410112345671 -> 34101-1234567-1 (digits only, max 13, dashes added automatically)
export const formatCnic = (value) => {
  const d = String(value || '').replace(/\D/g, '').slice(0, 13);
  if (d.length <= 5) return d;
  if (d.length <= 12) return `${d.slice(0, 5)}-${d.slice(5)}`;
  return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}`;
};

export const healthStatus = (score) =>
  score >= 70 ? 'Healthy' : score >= 40 ? 'Needs Attention' : 'Critical';

export const humidityStatus = (h) =>
  h < 40
    ? { label: 'Low', variant: 'warning', hint: 'Dry air. Consider extra irrigation.' }
    : h <= 70
    ? { label: 'Optimal', variant: 'success', hint: 'Good conditions for most crops.' }
    : { label: 'High', variant: 'danger', hint: 'Higher disease risk. Watch for fungus.' };

export const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
