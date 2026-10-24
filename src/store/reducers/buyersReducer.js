import createCrudReducer from './createCrudReducer';
import { addBuyer, updateBuyer, removeBuyer } from '../actions/buyerActions';

export default createCrudReducer('buyers', { add: addBuyer, update: updateBuyer, remove: removeBuyer });
