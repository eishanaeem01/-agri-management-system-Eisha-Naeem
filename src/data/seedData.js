import { addDays, healthStatus } from '../utils/formatters';

const AVATAR_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#dfe8df"/><circle cx="48" cy="36" r="18" fill="#8aa88b"/><path d="M12 96c0-22 16-36 36-36s36 14 36 36z" fill="#8aa88b"/></svg>';
export const SEED_AVATAR = `data:image/svg+xml;base64,${btoa(AVATAR_SVG)}`;

// Dates are relative to today so the demo always shows overdue / due-soon / upcoming crops.
export function buildSeed() {
  const crops = [
    { id: 'crop-1', name: 'Wheat', field: 'North Field A', plantingDate: addDays(-150), cuttingDate: addDays(-2), healthScore: 88, harvestQty: 5000 },
    { id: 'crop-2', name: 'Rice', field: 'River Field B', plantingDate: addDays(-110), cuttingDate: addDays(2), healthScore: 72, harvestQty: 4200 },
    { id: 'crop-3', name: 'Sugarcane', field: 'East Field C', plantingDate: addDays(-300), cuttingDate: addDays(14), healthScore: 55, harvestQty: 9000 },
    { id: 'crop-4', name: 'Maize', field: 'South Field D', plantingDate: addDays(-90), cuttingDate: addDays(30), healthScore: 34, harvestQty: 3000 },
    { id: 'crop-5', name: 'Cotton', field: 'West Field E', plantingDate: addDays(-120), cuttingDate: addDays(60), healthScore: 81, harvestQty: 2500 },
    { id: 'crop-6', name: 'Potato', field: 'Canal Field F', plantingDate: addDays(-70), cuttingDate: addDays(20), healthScore: 45, harvestQty: 1800 },
    { id: 'crop-7', name: 'Tomato', field: 'Greenhouse G', plantingDate: addDays(-80), cuttingDate: addDays(1), healthScore: 91, harvestQty: 1200 },
  ].map((c) => ({ ...c, status: healthStatus(c.healthScore) }));

  const orders = [
    { id: 'ord-1', cropId: 'crop-1', quantity: 1500, orderDate: addDays(-40), status: 'Delivered' },
    { id: 'ord-2', cropId: 'crop-5', quantity: 600, orderDate: addDays(-33), status: 'Delivered' },
    { id: 'ord-3', cropId: 'crop-2', quantity: 900, orderDate: addDays(-25), status: 'Delivered' },
    { id: 'ord-4', cropId: 'crop-3', quantity: 2000, orderDate: addDays(-18), status: 'Pending' },
    { id: 'ord-5', cropId: 'crop-1', quantity: 800, orderDate: addDays(-12), status: 'Delivered' },
    { id: 'ord-6', cropId: 'crop-7', quantity: 400, orderDate: addDays(-7), status: 'Pending' },
    { id: 'ord-7', cropId: 'crop-2', quantity: 700, orderDate: addDays(-3), status: 'Pending' },
    { id: 'ord-8', cropId: 'crop-6', quantity: 300, orderDate: addDays(-1), status: 'Cancelled' },
  ];

  const buyers = [
    { id: 'buy-1', name: 'Usman Tariq', cnic: '35202-3456789-3', imageBase64: SEED_AVATAR, cropId: 'crop-5', quantity: 500, date: addDays(-38) },
    { id: 'buy-2', name: 'Ahmed Raza', cnic: '34101-1234567-1', imageBase64: SEED_AVATAR, cropId: 'crop-1', quantity: 1200, date: addDays(-10) },
    { id: 'buy-3', name: 'Bilal Hussain', cnic: '34103-7654321-5', imageBase64: SEED_AVATAR, cropId: 'crop-1', quantity: 800, date: addDays(-6) },
    { id: 'buy-4', name: 'Sana Iqbal', cnic: '34201-2345678-9', imageBase64: SEED_AVATAR, cropId: 'crop-2', quantity: 600, date: addDays(-3) },
    { id: 'buy-5', name: 'Hina Malik', cnic: '34104-9876543-2', imageBase64: SEED_AVATAR, cropId: 'crop-7', quantity: 1000, date: addDays(-1) },
  ];

  return { crops, orders, buyers };
}
