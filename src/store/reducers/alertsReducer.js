import { createReducer } from '@reduxjs/toolkit';
import { dismissAlert, dismissAllAlerts, resetAlerts } from '../actions/uiActions';

// Alerts themselves are derived by selectors; this slice only remembers which ones were dismissed.
export default createReducer({ dismissed: [] }, (builder) => {
  builder
    .addCase(dismissAlert, (state, action) => {
      if (!state.dismissed.includes(action.payload)) state.dismissed.push(action.payload);
    })
    .addCase(dismissAllAlerts, (state, action) => {
      state.dismissed = Array.from(new Set([...state.dismissed, ...action.payload]));
    })
    .addCase(resetAlerts, (state) => {
      state.dismissed = [];
    });
});
