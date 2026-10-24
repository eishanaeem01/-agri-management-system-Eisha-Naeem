import createCrudReducer from './createCrudReducer';
import { addCrop, updateCrop, removeCrop } from '../actions/cropActions';

export default createCrudReducer('crops', { add: addCrop, update: updateCrop, remove: removeCrop });
