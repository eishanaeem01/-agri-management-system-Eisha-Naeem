import { createAction } from '@reduxjs/toolkit';
import { uid } from '../../utils/formatters';

export const BUYERS_ADD = 'buyers/add';
export const BUYERS_UPDATE = 'buyers/update';
export const BUYERS_REMOVE = 'buyers/remove';

export const addBuyer = createAction(BUYERS_ADD, (data) => ({ payload: { ...data, id: uid() } }));
export const updateBuyer = createAction(BUYERS_UPDATE); // payload: { id, ...changes }
export const removeBuyer = createAction(BUYERS_REMOVE); // payload: id
