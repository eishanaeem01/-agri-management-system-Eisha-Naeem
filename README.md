# AgriManager - Agriculture Management System

**Intern:** Eisha Naeem  |  **Program:** U Devs (SMC-Private) Limited, Full Stack Developer - Batch 6

A professional front-end dashboard that gives a farm manager a quick, clear overview of field conditions, crop health, harvest progress and customer orders. Built with React (functional components and hooks), Bootstrap 5 and browser `localStorage` (no backend). Live weather comes from the free [Open-Meteo](https://open-meteo.com/) API (no API key).

## Features

### Core modules
- **Humidity**: progress-ring gauge with colour-coded Low / Optimal / High label (live API reading).
- **Live weather**: temperature, condition, humidity, wind speed, rain chance, 5-day forecast, loading + error (with retry) states, automatic refresh every 10 minutes and a "last updated" time.
- **Crop health**: list with health-score bars and Healthy / Needs Attention / Critical badges, plus a doughnut chart.
- **Crop cutting / harvest schedule**: planned cutting dates, field, days remaining; due-soon (within 3 days) and overdue rows are highlighted.
- **Harvest and orders summary**: total harvest, orders received, quantity sold and quantity remaining (plus pending / delivered orders).
- **Buyer form**: Full Name, CNIC, Photo, crop, quantity and date, saved to `localStorage` and listed in a table that survives refresh.

### Buyer form rules
- **Name**: required, letters and spaces only, minimum 3 characters.
- **CNIC**: required, 13 digits, automatic dash formatting (`12345-1234567-1`), duplicate checking.
- **Image**: required, JPG or PNG only, max 1 MB, live preview, stored as a Base64 string (the picture is scaled to max 480px before saving so many buyers fit in the ~5 MB localStorage quota).
- **Quantity**: cannot exceed the crop's available stock; stock updates after every sale (edit/delete returns stock correctly).
- Clear validation messages and a success toast after saving.

### Professional features
- Full CRUD for crops, orders and buyers with confirmation dialogs.
- Search (name / CNIC, debounced), filter (crop health, order status, buyer crop) and sort (date, quantity, health, name).
- Charts (Chart.js): harvest vs sales, crop health distribution, orders over time.
- Responsive layout with sidebar (collapses on mobile), navbar, consistent green theme.
- Alerts: high humidity, low stock, critical crop health, cutting date within 3 days / overdue (bell with count in the navbar + alerts panel).
- React Router pages: Dashboard, Crops, Harvest & Orders, Buyers, 404.
- Export buyers and orders to CSV.
- Reusable architecture: custom hooks (`useLocalStorage`, `useWeather`, `useDebounce`), React Context for global state, reusable components.
- Bonus: dark mode, print view (CSS + printable buyer record), seed demo data, profile image zoom, unit tests (Vitest).

## Screenshots

Add your screenshots to `docs/screenshots/` and link them here:

| Dashboard | Crops | Harvest & Orders | Buyers |
| --- | --- | --- | --- |
| ![Dashboard](docs/screenshots/dashboard.png) | ![Crops](docs/screenshots/crops.png) | ![Harvest](docs/screenshots/harvest-orders.png) | ![Buyers](docs/screenshots/buyers.png) |

## Tech stack
React 18, React Router 6, Bootstrap 5 + Bootstrap Icons, Chart.js (react-chartjs-2), Open-Meteo API, localStorage, Vite, Vitest.

## Setup
```bash
git clone https://github.com/<your-username>/agri-management-system-<yourname>.git
cd agri-management-system-<yourname>
npm install
npm start        # opens http://localhost:5173
npm test         # unit tests (validators, formatters, CSV)
npm run build    # production build in /dist
```
Node.js 18+ is recommended. On first load the app seeds demo data; use **Reset demo data** in the sidebar to restore it.

## How the data works
| Key | Stores |
| --- | --- |
| `agri_crops` | id, name, field, plantingDate, cuttingDate, healthScore, status, harvestQty |
| `agri_orders` | id, cropId, quantity, orderDate, status |
| `agri_buyers` | id, name, cnic, imageBase64, cropId, quantity, date |

All reads and writes go through `services/storageService.js` (try/catch, handles empty or corrupted storage). **Stock** per crop = `harvestQty` minus the quantity sold to buyers. Orders are tracked separately (pending / delivered / cancelled) and do not reduce stock until a sale is recorded in Buyers.

## Folder structure
```
src/
  components/  common, dashboard, crops, harvest, buyers
  pages/       Dashboard, Crops, HarvestOrders, Buyers, NotFound
  context/     AppContext.js, AppProvider.js
  hooks/       useLocalStorage, useWeather, useDebounce
  services/    weatherApi.js, storageService.js
  utils/       validators, formatters, exportCsv (+ alerts, image, chartTheme)
  data/        seedData.js
  styles/      custom.css
  tests/       validators.test.js
```

## Git workflow
Work on `develop`, merge into `main` when stable, commit often (`feat: add live weather card`, `fix: CNIC validation`). `node_modules` is ignored via `.gitignore`.
