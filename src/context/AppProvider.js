import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppContext } from './AppContext';
import useLocalStorage from '../hooks/useLocalStorage';
import useWeather from '../hooks/useWeather';
import { STORAGE_KEYS } from '../services/storageService';
import { CITIES, DEFAULT_CITY } from '../services/weatherApi';
import { buildSeed } from '../data/seedData';
import { buildAlerts } from '../utils/alerts';
import { healthStatus, uid } from '../utils/formatters';

const isArray = Array.isArray;

export default function AppProvider({ children }) {
  const [crops, setCrops, cropsErr] = useLocalStorage(STORAGE_KEYS.crops, () => buildSeed().crops, isArray);
  const [orders, setOrders, ordersErr] = useLocalStorage(STORAGE_KEYS.orders, () => buildSeed().orders, isArray);
  const [buyers, setBuyers, buyersErr] = useLocalStorage(STORAGE_KEYS.buyers, () => buildSeed().buyers, isArray);
  const [darkMode, setDarkMode] = useLocalStorage(STORAGE_KEYS.darkMode, false, (v) => typeof v === 'boolean');
  const [cityName, setCityName] = useLocalStorage(STORAGE_KEYS.city, DEFAULT_CITY, (v) => CITIES.some((c) => c.name === v));
  const [toasts, setToasts] = useState([]);

  const city = useMemo(() => CITIES.find((c) => c.name === cityName) || CITIES[0], [cityName]);
  const weather = useWeather(city);

  // ----- theme -----
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // ----- toasts -----
  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const notify = useCallback(
    (message, type = 'success') => {
      const id = uid();
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => dismissToast(id), 3500);
    },
    [dismissToast]
  );
  useEffect(() => {
    const err = cropsErr || ordersErr || buyersErr;
    if (err) notify(err, 'danger');
  }, [cropsErr, ordersErr, buyersErr, notify]);

  // ----- derived data -----
  const cropsById = useMemo(() => Object.fromEntries(crops.map((c) => [c.id, c])), [crops]);

  // Stock per crop: harvested quantity minus everything sold to buyers.
  const stock = useMemo(() => {
    const map = {};
    crops.forEach((c) => (map[c.id] = { harvest: Number(c.harvestQty) || 0, sold: 0, remaining: 0 }));
    buyers.forEach((b) => {
      if (map[b.cropId]) map[b.cropId].sold += Number(b.quantity) || 0;
    });
    Object.values(map).forEach((s) => (s.remaining = Math.max(0, s.harvest - s.sold)));
    return map;
  }, [crops, buyers]);

  const totals = useMemo(() => {
    const vals = Object.values(stock);
    const harvest = vals.reduce((a, s) => a + s.harvest, 0);
    const sold = vals.reduce((a, s) => a + s.sold, 0);
    return {
      cropCount: crops.length,
      harvest,
      sold,
      remaining: Math.max(0, harvest - sold),
      orders: orders.length,
      orderedQty: orders.reduce((a, o) => a + (Number(o.quantity) || 0), 0),
      pending: orders.filter((o) => o.status === 'Pending').length,
      delivered: orders.filter((o) => o.status === 'Delivered').length,
    };
  }, [stock, crops, orders]);

  const humidity = weather.data?.humidity;
  const alerts = useMemo(() => buildAlerts({ crops, stock, humidity }), [crops, stock, humidity]);

  // ----- crops CRUD -----
  const addCrop = (data) => {
    setCrops((c) => [...c, { ...data, id: uid(), status: healthStatus(data.healthScore) }]);
    notify('Crop added successfully.');
  };
  const updateCrop = (id, data) => {
    setCrops((c) => c.map((x) => (x.id === id ? { ...x, ...data, status: healthStatus(data.healthScore) } : x)));
    notify('Crop updated successfully.');
  };
  const deleteCrop = (id) => {
    setCrops((c) => c.filter((x) => x.id !== id));
    setOrders((o) => o.filter((x) => x.cropId !== id));
    setBuyers((b) => b.filter((x) => x.cropId !== id));
    notify('Crop deleted.', 'danger');
  };

  // ----- orders CRUD -----
  const addOrder = (data) => {
    setOrders((o) => [...o, { ...data, id: uid() }]);
    notify('Order created successfully.');
  };
  const updateOrder = (id, data) => {
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, ...data } : x)));
    notify('Order updated successfully.');
  };
  const setOrderStatus = (id, status) => {
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
    notify(`Order marked as ${status}.`);
  };
  const deleteOrder = (id) => {
    setOrders((o) => o.filter((x) => x.id !== id));
    notify('Order deleted.', 'danger');
  };

  // ----- buyers CRUD -----
  const addBuyer = (data) => {
    setBuyers((b) => [...b, { ...data, id: uid() }]);
    notify('Buyer record saved successfully.');
  };
  const updateBuyer = (id, data) => {
    setBuyers((b) => b.map((x) => (x.id === id ? { ...x, ...data } : x)));
    notify('Buyer record updated successfully.');
  };
  const deleteBuyer = (id) => {
    setBuyers((b) => b.filter((x) => x.id !== id));
    notify('Buyer record deleted.', 'danger');
  };

  const resetDemoData = () => {
    const seed = buildSeed();
    setCrops(seed.crops);
    setOrders(seed.orders);
    setBuyers(seed.buyers);
    notify('Demo data restored.');
  };

  const value = {
    crops, orders, buyers, cropsById, stock, totals, alerts,
    weather, city, cities: CITIES, setCity: setCityName,
    darkMode, setDarkMode,
    toasts, notify, dismissToast,
    addCrop, updateCrop, deleteCrop,
    addOrder, updateOrder, setOrderStatus, deleteOrder,
    addBuyer, updateBuyer, deleteBuyer,
    resetDemoData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
