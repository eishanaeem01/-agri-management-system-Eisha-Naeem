import createCrudReducer from './createCrudReducer';
import { addTask, updateTask, removeTask } from '../actions/taskActions';

export default createCrudReducer('tasks', { add: addTask, update: updateTask, remove: removeTask });
