import { daysFromNow, initials } from '../utils/formatters';

export const DEMO_USERS = [
  { username: 'admin', password: 'admin123', role: 'Admin', name: 'Farm Admin' },
  { username: 'manager', password: 'manager123', role: 'Manager', name: 'Farm Manager' },
];

const avatar = (name, color) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="160" height="160" fill="${color}"/><text x="80" y="98" font-size="56" font-family="Arial" fill="#fff" text-anchor="middle">${initials(name)}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Demo data is created only when localStorage is empty (first run). Dates are relative to today.
export const makeSeed = () => ({
  crops: [
    { id: 'crop-1', name: 'Wheat', field: 'Field A', plantingDate: daysFromNow(-130), cuttingDate: daysFromNow(2), healthScore: 88, status: 'Healthy', harvestQty: 5000, pricePerKg: 95 },
    { id: 'crop-2', name: 'Rice', field: 'Field B', plantingDate: daysFromNow(-90), cuttingDate: daysFromNow(12), healthScore: 62, status: 'Needs Attention', harvestQty: 4200, pricePerKg: 220 },
    { id: 'crop-3', name: 'Cotton', field: 'Field C', plantingDate: daysFromNow(-110), cuttingDate: daysFromNow(25), healthScore: 34, status: 'Critical', harvestQty: 2800, pricePerKg: 180 },
    { id: 'crop-4', name: 'Maize', field: 'Field D', plantingDate: daysFromNow(-100), cuttingDate: daysFromNow(-2), healthScore: 91, status: 'Healthy', harvestQty: 3500, pricePerKg: 70 },
    { id: 'crop-5', name: 'Tomato', field: 'Field E', plantingDate: daysFromNow(-60), cuttingDate: daysFromNow(7), healthScore: 55, status: 'Needs Attention', harvestQty: 1800, pricePerKg: 90 },
    { id: 'crop-6', name: 'Sugarcane', field: 'Field F', plantingDate: daysFromNow(-200), cuttingDate: daysFromNow(45), healthScore: 76, status: 'Healthy', harvestQty: 9000, pricePerKg: 10 },
  ],
  orders: [
    { id: 'ord-1', cropId: 'crop-4', quantity: 1800, orderDate: daysFromNow(-40), status: 'Delivered' },
    { id: 'ord-2', cropId: 'crop-4', quantity: 1200, orderDate: daysFromNow(-25), status: 'Delivered' },
    { id: 'ord-3', cropId: 'crop-1', quantity: 2000, orderDate: daysFromNow(-18), status: 'Delivered' },
    { id: 'ord-4', cropId: 'crop-5', quantity: 900, orderDate: daysFromNow(-9), status: 'Pending' },
    { id: 'ord-5', cropId: 'crop-2', quantity: 1500, orderDate: daysFromNow(-5), status: 'Pending' },
    { id: 'ord-6', cropId: 'crop-6', quantity: 3000, orderDate: daysFromNow(-2), status: 'Pending' },
  ],
  buyers: [
    { id: 'buy-1', name: 'Ali Raza', cnic: '35202-1234567-1', imageBase64: avatar('Ali Raza', '#2f5d3a'), cropId: 'crop-4', quantity: 1800, date: daysFromNow(-38) },
    { id: 'buy-2', name: 'Hassan Ahmed', cnic: '35201-7654321-3', imageBase64: avatar('Hassan Ahmed', '#8a6d1d'), cropId: 'crop-4', quantity: 1200, date: daysFromNow(-24) },
    { id: 'buy-3', name: 'Bilal Khan', cnic: '34101-1112223-5', imageBase64: avatar('Bilal Khan', '#3a6f8f'), cropId: 'crop-1', quantity: 2000, date: daysFromNow(-16) },
    { id: 'buy-4', name: 'Sana Iqbal', cnic: '35404-9998887-2', imageBase64: avatar('Sana Iqbal', '#7b4b7a'), cropId: 'crop-5', quantity: 900, date: daysFromNow(-8) },
    { id: 'buy-5', name: 'Usman Tariq', cnic: '33100-4445556-9', imageBase64: avatar('Usman Tariq', '#a1432f'), cropId: 'crop-2', quantity: 1500, date: daysFromNow(-4) },
  ],
  tasks: [
    { id: 'task-1', title: 'Irrigate wheat field', type: 'Irrigation', cropId: 'crop-1', dueDate: daysFromNow(1), status: 'Pending' },
    { id: 'task-2', title: 'Apply urea on rice', type: 'Fertilizer', cropId: 'crop-2', dueDate: daysFromNow(-2), status: 'Pending' },
    { id: 'task-3', title: 'Spray cotton for bollworm', type: 'Spraying', cropId: 'crop-3', dueDate: daysFromNow(3), status: 'Pending' },
    { id: 'task-4', title: 'Hire harvest labour for maize', type: 'Labour', cropId: 'crop-4', dueDate: daysFromNow(-1), status: 'Done' },
    { id: 'task-5', title: 'Irrigate tomato rows', type: 'Irrigation', cropId: 'crop-5', dueDate: daysFromNow(5), status: 'Pending' },
    { id: 'task-6', title: 'Fertilize sugarcane', type: 'Fertilizer', cropId: 'crop-6', dueDate: daysFromNow(9), status: 'Pending' },
  ],
  expenses: [
    { id: 'exp-1', cropId: 'crop-1', category: 'Seeds', amount: 85000, date: daysFromNow(-128), note: 'Certified wheat seed' },
    { id: 'exp-2', cropId: 'crop-1', category: 'Fertilizer', amount: 62000, date: daysFromNow(-70), note: 'DAP and urea' },
    { id: 'exp-3', cropId: 'crop-1', category: 'Labour', amount: 40000, date: daysFromNow(-20), note: 'Weeding crew' },
    { id: 'exp-4', cropId: 'crop-2', category: 'Seeds', amount: 90000, date: daysFromNow(-88), note: 'Basmati seedlings' },
    { id: 'exp-5', cropId: 'crop-2', category: 'Fuel', amount: 28000, date: daysFromNow(-30), note: 'Tube-well diesel' },
    { id: 'exp-6', cropId: 'crop-3', category: 'Fertilizer', amount: 70000, date: daysFromNow(-45), note: 'Cotton nutrients' },
    { id: 'exp-7', cropId: 'crop-4', category: 'Seeds', amount: 36000, date: daysFromNow(-98), note: 'Hybrid maize seed' },
    { id: 'exp-8', cropId: 'crop-4', category: 'Labour', amount: 30000, date: daysFromNow(-8), note: 'Harvest labour' },
    { id: 'exp-9', cropId: 'crop-5', category: 'Fertilizer', amount: 22000, date: daysFromNow(-22), note: 'Potash' },
    { id: 'exp-10', cropId: 'crop-6', category: 'Fuel', amount: 18000, date: daysFromNow(-12), note: 'Tractor diesel' },
  ],
  inventory: [
    { id: 'inv-1', item: 'Urea', type: 'Fertilizer', qty: 45, minQty: 20, unit: 'bags', history: [{ date: daysFromNow(-15), qty: 10, note: 'Rice top dressing' }] },
    { id: 'inv-2', item: 'DAP', type: 'Fertilizer', qty: 12, minQty: 15, unit: 'bags', history: [{ date: daysFromNow(-30), qty: 18, note: 'Wheat basal dose' }] },
    { id: 'inv-3', item: 'Imidacloprid', type: 'Pesticide', qty: 8, minQty: 5, unit: 'L', history: [] },
    { id: 'inv-4', item: 'Fungicide Mix', type: 'Pesticide', qty: 3, minQty: 5, unit: 'L', history: [{ date: daysFromNow(-6), qty: 2, note: 'Tomato blight spray' }] },
    { id: 'inv-5', item: 'Wheat Seed', type: 'Seed', qty: 200, minQty: 100, unit: 'kg', history: [] },
  ],
});
