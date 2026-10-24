import { createAction } from '@reduxjs/toolkit';
import { uid } from '../../utils/formatters';

export const ORDERS_ADD = 'orders/add';
export const ORDERS_UPDATE = 'orders/update';
export const ORDERS_REMOVE = 'orders/remove';

export const addOrder = createAction(ORDERS_ADD, (data) => ({ payload: { ...data, id: uid() } }));
export const updateOrder = createAction(ORDERS_UPDATE); // payload: { id, ...changes }
export const removeOrder = createAction(ORDERS_REMOVE); // payload: id
