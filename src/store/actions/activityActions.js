import { createAction } from '@reduxjs/toolkit';
import { uid } from '../../utils/formatters';

export const ACTIVITY_ADD = 'activity/add';

// payload: { user, role, action, entity }
export const addActivity = createAction(ACTIVITY_ADD, (entry) => ({
  payload: { ...entry, id: uid(), timestamp: new Date().toISOString() },
}));
