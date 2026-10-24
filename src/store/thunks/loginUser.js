import { createAsyncThunk } from '@reduxjs/toolkit';
import { DEMO_USERS } from '../../data/seedData';
import { validateLogin } from '../../utils/validators';

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  const errors = validateLogin(credentials);
  if (Object.keys(errors).length) return rejectWithValue(Object.values(errors)[0]);
  const user = DEMO_USERS.find(
    (u) => u.username === credentials.username.trim().toLowerCase() && u.password === credentials.password
  );
  if (!user) return rejectWithValue('Incorrect username or password.');
  return { user: user.username, name: user.name, role: user.role };
});
