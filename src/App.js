import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppLayout from './components/common/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Crops from './pages/Crops';
import HarvestOrders from './pages/HarvestOrders';
import Buyers from './pages/Buyers';
import Tasks from './pages/Tasks';
import Expenses from './pages/Expenses';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

export default function App() {
  const theme = useSelector((s) => s.ui.theme);
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme); // Bootstrap 5.3 dark mode
  }, [theme]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="crops" element={<Crops />} />
        <Route path="harvest-orders" element={<HarvestOrders />} />
        <Route path="buyers" element={<Buyers />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="reports" element={<ProtectedRoute roles={['Admin', 'Manager']}><Reports /></ProtectedRoute>} />
      </Route>
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
