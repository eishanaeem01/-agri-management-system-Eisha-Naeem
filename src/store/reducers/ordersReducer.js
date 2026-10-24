import createCrudReducer from './createCrudReducer';
import { addOrder, updateOrder, removeOrder } from '../actions/orderActions';

export default createCrudReducer('orders', { add: addOrder, update: updateOrder, remove: removeOrder });
