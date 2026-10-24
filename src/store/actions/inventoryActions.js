import { createAction } from '@reduxjs/toolkit';
import { uid } from '../../utils/formatters';

export const INVENTORY_ADD = 'inventory/add';
export const INVENTORY_UPDATE = 'inventory/update';
export const INVENTORY_REMOVE = 'inventory/remove';
export const INVENTORY_USE = 'inventory/use';

export const addInventory = createAction(INVENTORY_ADD, (data) => ({ payload: { ...data, history: [], id: uid() } }));
export const updateInventory = createAction(INVENTORY_UPDATE);
export const removeInventory = createAction(INVENTORY_REMOVE);
// payload: { id, qty, note, date } - reduces stock and appends to usage history
export const consumeInventory = createAction(INVENTORY_USE);
