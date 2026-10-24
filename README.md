# AgriManager - Agriculture Management System

**Intern:** Eisha Naeem | **Batch:** 6 (Full Stack Developer) | **Company:** U Devs (SMC-Private) Limited
**Task:** Agriculture Management System, Extended Version with Redux Toolkit

A front-end farm dashboard that gives a manager one clear view of field conditions, crop health, harvest progress, customer orders, farm tasks and profitability. There is no backend: all data lives in the Redux store and is synced to `localStorage`.

## Screenshots

Add your screenshots to `docs/screenshots/` and keep these links updated.

| Dashboard | Buyer form | Reports |
|---|---|---|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Buyers](docs/screenshots/buyers.png) | ![Reports](docs/screenshots/reports.png) |

## Features

**Core modules (dashboard)**
- Live weather (Open-Meteo, no API key): temperature, condition, wind, rain chance, 5-day forecast, loading and error states, retry, auto-refresh every 10 minutes, last-updated time
- Humidity gauge with Low / Optimal / High label, colour-coded
- Crop health list and doughnut chart (Healthy, Needs Attention, Critical) with score bars and badges
- Crop cutting / harvest schedule with days remaining; due-soon and overdue rows highlighted
- Harvest and orders summary: total harvest, orders received, quantity sold, quantity remaining
- Buyer form: name, CNIC, photo, crop, quantity, date; saved to localStorage and shown in a table that survives refresh

**Buyer form rules:** name (required, letters and spaces, min 3) | CNIC (13 digits, auto-dash `12345-1234567-1`, duplicate check) | photo (required, JPG/PNG, max 1 MB, live preview, stored as Base64) | quantity cannot exceed available stock, stock updates after every sale | clear validation messages and a success toast.

**Professional features:** full CRUD with confirm dialogs, search / filter / sort, charts (harvest vs sales vs orders, health distribution, revenue vs expense), alerts bell with count, React Router pages, CSV export (buyers, orders, expenses, reports), custom hooks, dark mode, print view, demo seed data, buyer photo zoom, unit tests.

**New in the extended version**
- Login and role-based access (Admin: add / edit / delete everything; Manager: view and add only), protected routes, logout, session persisted
- Farm task scheduler (irrigation, fertilizer, spraying, labour) with status Pending / Done / Overdue, crop link and due-date alerts
- Expense and profit / loss tracker per crop (seeds, fertilizer, labour, fuel) with revenue vs expense chart
- Inputs inventory with minimum-quantity alerts and usage history
- Reports (monthly harvest, sales, expenses) exportable to CSV, PDF or print, plus an activity log of every add, edit and delete (who, when, what; Admin only)

## Tech stack

React 18 (functional components and hooks) | Redux Toolkit + React-Redux | React Router 6 | HTML5, CSS3, Bootstrap 5.3 + Bootstrap Icons | Recharts | jsPDF | Open-Meteo API | Vite | Vitest

## Setup

```bash
npm install
npm start        # http://localhost:5173
npm test         # unit and smoke tests
npm run build    # production build in dist/
```

### Demo logins

| Role | Username | Password | Can do |
|---|---|---|---|
| Admin | `admin` | `admin123` | Add, edit, delete everything, see the activity log |
| Manager | `manager` | `manager123` | View and add only |

On first run the app seeds demo data. To reset, clear the `agri_*` keys in the browser's localStorage.

## Redux architecture

### State tree

```
store
|-- crops      []   { id, name, field, plantingDate, cuttingDate, healthScore, status, harvestQty, pricePerKg }
|-- orders     []   { id, cropId, quantity, orderDate, status }
|-- buyers     []   { id, name, cnic, imageBase64, cropId, quantity, date }
|-- tasks      []   { id, title, type, cropId, dueDate, status }
|-- expenses   []   { id, cropId, category, amount, date, note }
|-- inventory  []   { id, item, type, qty, minQty, unit, history[] }
|-- weather         { status: idle|loading|succeeded|failed, data, error, lastUpdated }
|-- auth            { user, name, role, error, status }
|-- alerts          { dismissed[] }          alerts themselves are derived by selectors
|-- activity   []   { id, user, role, action, entity, timestamp }
`-- ui              { theme, sidebarOpen, toasts[], hydrated }
```

### Data flow

```
 component --dispatch(action / thunk)--> middleware --> reducer --> store --useSelector--> component
                                         |  activityLogger: records who did what
                                         `  persistMiddleware: writes changed slices to localStorage
```

1. A component dispatches an action (`crops/add`) or a thunk (`saveBuyer`, `fetchWeather`).
2. Middleware runs: `activityLogger` writes an activity entry, then `persistMiddleware` runs after the reducer.
3. The slice reducer returns the new state.
4. `persistMiddleware` saves any changed slice to `agri_*` keys; nothing is written before the store is hydrated.
5. Components re-render through `useSelector`. All derived data (low stock, due crops, alerts, profit by crop, monthly report) comes from selectors only.

On load, the `loadFromStorage` thunk rehydrates every slice (empty storage falls back to seed data) before the app renders.

### Store folder

| Folder | Contents |
|---|---|
| `store/actions` | Action type constants (`crops/add`, `crops/update`, `crops/remove`...) and action creators |
| `store/reducers` | One reducer per module, plus `createCrudReducer` shared by the list modules |
| `store/thunks` | `fetchWeather`, `loadFromStorage`, `saveBuyer`, `loginUser` |
| `store/selectors` | `selectLowStock`, `selectDueCrops`, `selectProfitByCrop`, `selectAlerts` and others |
| `store/middleware` | `persistMiddleware`, `activityLogger` |

Redux DevTools is enabled in `store/index.js`.

## Project structure

```
src/
  api/          weatherApi, storageApi (try/catch localStorage), apiClient
  components/   common, dashboard, crops, harvest, buyers, auth, tasks, expenses, inventory, reports
  pages/        Dashboard, Crops, HarvestOrders, Buyers, Tasks, Expenses, Inventory, Reports, Login, NotFound
  hooks/        useLocalStorage, useWeather, useDebounce, usePermissions, useToast
  store/        Redux Toolkit store (see above)
  utils/        validators, formatters, exportCsv, reportExport
  data/         seedData
  styles/       custom.css
```

## localStorage keys

`agri_crops`, `agri_orders`, `agri_buyers`, `agri_tasks`, `agri_expenses`, `agri_inventory`, `agri_activity`, `agri_session` (plus `agri_theme`).

## Notes

- Crops carry a `pricePerKg` field so revenue (quantity sold x price) and profit / loss can be calculated.
- Overdue task status is derived from the due date, never stored.
- Stock is derived: remaining = harvested quantity minus quantity sold to buyers.
