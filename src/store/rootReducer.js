import { combineReducers } from '@reduxjs/toolkit';
import crops from './reducers/cropsReducer';
import orders from './reducers/ordersReducer';
import buyers from './reducers/buyersReducer';
import weather from './reducers/weatherReducer';
import tasks from './reducers/tasksReducer';
import expenses from './reducers/expensesReducer';
import inventory from './reducers/inventoryReducer';
import auth from './reducers/authReducer';
import alerts from './reducers/alertsReducer';
import activity from './reducers/activityReducer';
import ui from './reducers/uiReducer';

export default combineReducers({ crops, orders, buyers, weather, tasks, expenses, inventory, auth, alerts, activity, ui });
