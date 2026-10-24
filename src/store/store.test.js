import { describe, it, expect, beforeEach } from 'vitest';

// in-memory localStorage for the node test environment
const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
};

const { makeStore } = await import('./index');
const { loadFromStorage } = await import('./thunks/loadFromStorage');
const { saveBuyer } = await import('./thunks/saveBuyer');
const { loginUser } = await import('./thunks/loginUser');
const { fetchWeather } = await import('./thunks/fetchWeather');
const { addCrop, removeCrop } = await import('./actions/cropActions');
const { logout } = await import('./actions/authActions');
const sel = await import('./selectors');

const buyer = (over = {}) => ({ name: 'Test Buyer', cnic: '11111-1111111-1', imageBase64: 'data:image/png;base64,AAA', cropId: 'crop-1', quantity: 100, date: '2026-10-01', ...over });

describe('redux store', () => {
  let store;
  beforeEach(async () => {
    mem.clear();
    store = makeStore();
    await store.dispatch(loadFromStorage());
  });

  it('seeds demo data on first run and persists it', () => {
    expect(store.getState().crops.length).toBeGreaterThan(0);
    expect(JSON.parse(mem.get('agri_crops'))).toHaveLength(store.getState().crops.length);
  });

  it('rehydrates from localStorage on the next load (survives refresh)', async () => {
    store.dispatch(addCrop({ name: 'Barley', field: 'G', plantingDate: '2026-01-01', cuttingDate: '2026-12-01', healthScore: 80, status: 'Healthy', harvestQty: 10, pricePerKg: 1 }));
    const second = makeStore();
    await second.dispatch(loadFromStorage());
    expect(second.getState().crops.some((c) => c.name === 'Barley')).toBe(true);
  });

  it('saveBuyer rejects duplicate CNIC and quantity above stock, then updates stock', async () => {
    const dup = await store.dispatch(saveBuyer(buyer({ cnic: '35202-1234567-1' })));
    expect(dup.payload.cnic).toMatch(/already/);

    const tooMuch = await store.dispatch(saveBuyer(buyer({ quantity: 999999 })));
    expect(tooMuch.payload.quantity).toMatch(/Only/);

    const before = sel.selectCropStock(store.getState()).find((c) => c.id === 'crop-1').remaining;
    const ok = await store.dispatch(saveBuyer(buyer()));
    expect(ok.type).toMatch(/fulfilled/);
    const after = sel.selectCropStock(store.getState()).find((c) => c.id === 'crop-1').remaining;
    expect(after).toBe(before - 100);
    expect(JSON.parse(mem.get('agri_buyers')).some((b) => b.cnic === '11111-1111111-1')).toBe(true);
  });

  it('logs add / delete activity with the signed-in user', async () => {
    await store.dispatch(loginUser({ username: 'admin', password: 'admin123' }));
    store.dispatch(removeCrop('crop-1'));
    const log = store.getState().activity;
    expect(log.some((e) => e.action === 'Deleted' && e.entity.startsWith('Crop') && e.user === 'admin')).toBe(true);
    expect(log.some((e) => e.action === 'Logged in')).toBe(true);
  });

  it('login rejects bad credentials; session is persisted and cleared on logout', async () => {
    const bad = await store.dispatch(loginUser({ username: 'admin', password: 'wrongpass' }));
    expect(bad.type).toMatch(/rejected/);
    await store.dispatch(loginUser({ username: 'manager', password: 'manager123' }));
    expect(store.getState().auth.role).toBe('Manager');
    expect(mem.get('agri_session')).toBeTruthy();
    store.dispatch(logout());
    expect(mem.get('agri_session')).toBeUndefined();
  });

  it('derives alerts, due crops, low stock and profit from selectors', () => {
    const s = store.getState();
    expect(sel.selectDueCrops(s).length).toBeGreaterThan(0);
    expect(sel.selectLowStock(s).some((c) => c.name === 'Maize')).toBe(true);
    expect(sel.selectLowInventory(s).length).toBeGreaterThan(0);
    expect(sel.selectOverdueTasks(s).length).toBeGreaterThan(0);
    expect(sel.selectAlerts(s).length).toBeGreaterThan(3);
    const wheat = sel.selectProfitByCrop(s).find((r) => r.name === 'Wheat');
    expect(wheat.profit).toBe(wheat.revenue - wheat.expense);
  });

  it('weather slice moves through loading / succeeded / failed', () => {
    store.dispatch({ type: fetchWeather.pending.type });
    expect(store.getState().weather.status).toBe('loading');
    store.dispatch({ type: fetchWeather.fulfilled.type, payload: { humidity: 80, updatedAt: 'now', forecast: [] } });
    expect(store.getState().weather.status).toBe('succeeded');
    expect(sel.selectAlerts(store.getState()).some((a) => a.id === 'humidity-high')).toBe(true);
    store.dispatch({ type: fetchWeather.rejected.type, payload: 'Network error' });
    expect(store.getState().weather.status).toBe('failed');
    expect(store.getState().weather.error).toBe('Network error');
  });
});
