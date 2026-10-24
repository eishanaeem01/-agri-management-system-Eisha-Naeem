export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const toISO = (d) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};
export const todayStr = () => toISO(new Date());
export const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISO(d);
};
// whole days from `from` (default today) to dateStr; negative = in the past
export const daysBetween = (dateStr, from = todayStr()) =>
  Math.round((new Date(dateStr + 'T00:00:00') - new Date(from + 'T00:00:00')) / 86400000);

export const formatDate = (s) =>
  s ? new Date(s + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
export const formatDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
export const formatTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-';
export const formatNumber = (n) => Number(n || 0).toLocaleString('en-US');
export const formatCurrency = (n) => `${n < 0 ? '-' : ''}Rs ${formatNumber(Math.abs(Math.round(n || 0)))}`;
export const monthLabel = (key) =>
  new Date(key + '-01T00:00:00').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

// 12345-1234567-1 auto formatting
export const formatCnic = (value) => {
  const d = String(value || '').replace(/\D/g, '').slice(0, 13);
  if (d.length <= 5) return d;
  if (d.length <= 12) return `${d.slice(0, 5)}-${d.slice(5)}`;
  return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}`;
};

export const statusFromScore = (score) => {
  const s = Number(score);
  if (s >= 70) return 'Healthy';
  if (s >= 40) return 'Needs Attention';
  return 'Critical';
};

export const humidityStatus = (h) => (h < 40 ? 'Low' : h <= 70 ? 'Optimal' : 'High');

export const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
