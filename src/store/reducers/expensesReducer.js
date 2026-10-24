import createCrudReducer from './createCrudReducer';
import { addExpense, updateExpense, removeExpense } from '../actions/expenseActions';

export default createCrudReducer('expenses', { add: addExpense, update: updateExpense, remove: removeExpense });
