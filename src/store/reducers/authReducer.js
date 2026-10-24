import { createReducer } from '@reduxjs/toolkit';
import { loadFromStorage } from '../thunks/loadFromStorage';
import { loginUser } from '../thunks/loginUser';
import { logout, clearAuthError } from '../actions/authActions';

const initialState = { user: null, name: null, role: null, error: null, status: 'idle' };

export default createReducer(initialState, (builder) => {
  builder
    .addCase(loadFromStorage.fulfilled, (state, action) => {
      const s = action.payload.session;
      if (s && s.user && s.role) Object.assign(state, { user: s.user, name: s.name || s.user, role: s.role });
    })
    .addCase(loginUser.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => ({ ...initialState, ...action.payload, status: 'succeeded' }))
    .addCase(loginUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload || 'Login failed';
    })
    .addCase(logout, () => initialState)
    .addCase(clearAuthError, (state) => {
      state.error = null;
    });
});
