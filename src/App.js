import { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import AppProvider from './context/AppProvider';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Toast from './components/common/Toast';
import Dashboard from './pages/Dashboard';
import Crops from './pages/Crops';
import HarvestOrders from './pages/HarvestOrders';
import Buyers from './pages/Buyers';
import NotFound from './pages/NotFound';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  // HashRouter keeps deep links and page refresh working on GitHub Pages / static hosting.
  return (
    <HashRouter>
      <AppProvider>
        <div className="app-shell">
          <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
          <div className="main">
            <Navbar onMenu={() => setMenuOpen(true)} />
            <main className="content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/crops" element={<Crops />} />
                <Route path="/harvest-orders" element={<HarvestOrders />} />
                <Route path="/buyers" element={<Buyers />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
        <Toast />
      </AppProvider>
    </HashRouter>
  );
}
