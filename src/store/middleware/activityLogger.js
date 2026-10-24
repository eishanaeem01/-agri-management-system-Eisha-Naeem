import { addActivity } from '../actions/activityActions';
import { loginUser } from '../thunks/loginUser';
import { AUTH_LOGOUT } from '../actions/authActions';

const ENTITY = { crops: 'Crop', orders: 'Order', buyers: 'Buyer', tasks: 'Task', expenses: 'Expense', inventory: 'Inventory' };
const VERB = { add: 'Added', update: 'Updated', remove: 'Deleted', use: 'Used stock' };

const labelOf = (item) => (item ? item.name || item.title || item.item || item.category || (item.quantity ? `${item.quantity} kg` : '') : '');

// Records who did what and when for every add / update / remove (plus login and logout).
const activityLogger = (store) => (next) => (action) => {
  const m = /^(\w+)\/(add|update|remove|use)$/.exec(action.type);
  if (m && ENTITY[m[1]]) {
    const [, slice, verb] = m;
    const before = store.getState()[slice];
    const result = next(action);
    const p = action.payload;
    const id = typeof p === 'object' ? p.id : p;
    const prev = before.find((i) => i.id === id);
    const { user, role } = store.getState().auth;
    const label = (typeof p === 'object' && labelOf(p)) || labelOf(prev) || id;
    store.dispatch(
      addActivity({ user: user || 'system', role: role || '-', action: VERB[verb], entity: `${ENTITY[slice]}: ${label}` })
    );
    return result;
  }
  if (loginUser.fulfilled.match(action)) {
    const result = next(action);
    store.dispatch(addActivity({ user: action.payload.user, role: action.payload.role, action: 'Logged in', entity: 'Session' }));
    return result;
  }
  if (action.type === AUTH_LOGOUT) {
    const { user, role } = store.getState().auth;
    if (user) store.dispatch(addActivity({ user, role, action: 'Logged out', entity: 'Session' }));
  }
  return next(action);
};

export default activityLogger;
