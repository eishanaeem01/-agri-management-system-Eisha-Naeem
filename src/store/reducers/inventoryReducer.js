import createCrudReducer from './createCrudReducer';
import { addInventory, updateInventory, removeInventory, consumeInventory } from '../actions/inventoryActions';

export default createCrudReducer(
  'inventory',
  { add: addInventory, update: updateInventory, remove: removeInventory },
  (builder) => {
    builder.addCase(consumeInventory, (state, action) => {
      const { id, qty, note, date } = action.payload;
      const item = state.find((i) => i.id === id);
      if (!item) return;
      item.qty = Math.max(0, Number(item.qty) - Number(qty));
      item.history = [{ date, qty: Number(qty), note }, ...(item.history || [])];
    });
  }
);
