import { createAction } from '@reduxjs/toolkit';
import { uid } from '../../utils/formatters';

export const TASKS_ADD = 'tasks/add';
export const TASKS_UPDATE = 'tasks/update';
export const TASKS_REMOVE = 'tasks/remove';

export const addTask = createAction(TASKS_ADD, (data) => ({ payload: { ...data, id: uid() } }));
export const updateTask = createAction(TASKS_UPDATE); // payload: { id, ...changes }
export const removeTask = createAction(TASKS_REMOVE); // payload: id
