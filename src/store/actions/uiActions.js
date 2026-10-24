import { createAction } from '@reduxjs/toolkit';
import { uid } from '../../utils/formatters';

export const UI_TOGGLE_THEME = 'ui/toggleTheme';
export const UI_TOGGLE_SIDEBAR = 'ui/toggleSidebar';
export const UI_CLOSE_SIDEBAR = 'ui/closeSidebar';
export const UI_SHOW_TOAST = 'ui/showToast';
export const UI_DISMISS_TOAST = 'ui/dismissToast';
export const ALERTS_DISMISS = 'alerts/dismiss';
export const ALERTS_DISMISS_ALL = 'alerts/dismissAll';
export const ALERTS_RESET = 'alerts/reset';

export const toggleTheme = createAction(UI_TOGGLE_THEME);
export const toggleSidebar = createAction(UI_TOGGLE_SIDEBAR);
export const closeSidebar = createAction(UI_CLOSE_SIDEBAR);
export const showToast = createAction(UI_SHOW_TOAST, (type, message) => ({ payload: { id: uid(), type, message } }));
export const dismissToast = createAction(UI_DISMISS_TOAST);
export const dismissAlert = createAction(ALERTS_DISMISS);
export const dismissAllAlerts = createAction(ALERTS_DISMISS_ALL);
export const resetAlerts = createAction(ALERTS_RESET);
