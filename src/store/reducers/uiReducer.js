import { createReducer } from '@reduxjs/toolkit';
import { loadFromStorage } from '../thunks/loadFromStorage';
import { toggleTheme, toggleSidebar, closeSidebar, showToast, dismissToast } from '../actions/uiActions';

const initialState = { theme: 'light', sidebarOpen: false, toasts: [], hydrated: false };

export default createReducer(initialState, (builder) => {
  builder
    .addCase(loadFromStorage.fulfilled, (state, action) => {
      state.theme = action.payload.theme === 'dark' ? 'dark' : 'light';
      state.hydrated = true;
    })
    .addCase(toggleTheme, (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    })
    .addCase(toggleSidebar, (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    })
    .addCase(closeSidebar, (state) => {
      state.sidebarOpen = false;
    })
    .addCase(showToast, (state, action) => {
      state.toasts.push(action.payload);
    })
    .addCase(dismissToast, (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    });
});
