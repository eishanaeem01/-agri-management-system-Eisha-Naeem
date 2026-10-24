import { createAction } from '@reduxjs/toolkit';

export const AUTH_LOGOUT = 'auth/logout';
export const AUTH_CLEAR_ERROR = 'auth/clearError';

// login itself is the loginUser thunk (credential check) - see thunks/loginUser.js
export const logout = createAction(AUTH_LOGOUT);
export const clearAuthError = createAction(AUTH_CLEAR_ERROR);
