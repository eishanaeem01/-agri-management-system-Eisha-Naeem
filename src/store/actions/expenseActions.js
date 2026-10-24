import { createAction } from '@reduxjs/toolkit';
import { uid } from '../../utils/formatters';

export const EXPENSES_ADD = 'expenses/add';
export const EXPENSES_UPDATE = 'expenses/update';
export const EXPENSES_REMOVE = 'expenses/remove';

export const addExpense = createAction(EXPENSES_ADD, (data) => ({ payload: { ...data, id: uid() } }));
export const updateExpense = createAction(EXPENSES_UPDATE); // payload: { id, ...changes }
export const removeExpense = createAction(EXPENSES_REMOVE); // payload: id
