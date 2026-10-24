import { createAction } from '@reduxjs/toolkit';
import { uid } from '../../utils/formatters';

export const CROPS_ADD = 'crops/add';
export const CROPS_UPDATE = 'crops/update';
export const CROPS_REMOVE = 'crops/remove';

export const addCrop = createAction(CROPS_ADD, (data) => ({ payload: { ...data, id: uid() } }));
export const updateCrop = createAction(CROPS_UPDATE); // payload: { id, ...changes }
export const removeCrop = createAction(CROPS_REMOVE); // payload: id
