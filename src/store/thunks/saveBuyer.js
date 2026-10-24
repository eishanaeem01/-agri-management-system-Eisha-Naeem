import { createAsyncThunk } from '@reduxjs/toolkit';
import { addBuyer, updateBuyer } from '../actions/buyerActions';
import { selectAvailableStock } from '../selectors';
import { validateBuyer } from '../../utils/validators';

// Final validation (duplicate CNIC + stock check against the live store) then add/update.
// Rejects with an { field: message } object the form can display.
export const saveBuyer = createAsyncThunk('buyers/save', async (buyer, { getState, dispatch, rejectWithValue }) => {
  const state = getState();
  const available = selectAvailableStock(state, buyer.cropId, buyer.id);
  const errors = validateBuyer(buyer, { buyers: state.buyers, available });
  if (Object.keys(errors).length) return rejectWithValue(errors);
  const data = { ...buyer, name: buyer.name.trim().replace(/\s+/g, ' '), quantity: Number(buyer.quantity) };
  dispatch(buyer.id ? updateBuyer(data) : addBuyer(data));
  return data;
});
