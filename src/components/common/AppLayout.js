import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Toast from './Toast';
import useWeather from '../../hooks/useWeather';

export default function AppLayout() {
  useWeather(); // keeps live weather (and the high-humidity alert) fresh on every page
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        <main className="page-content"><Outlet /></main>
      </div>
      <Toast />
    </div>
  );
}
