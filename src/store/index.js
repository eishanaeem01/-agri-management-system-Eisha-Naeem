import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import persistMiddleware from './middleware/persistMiddleware';
import activityLogger from './middleware/activityLogger';

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefault) =>
      getDefault({ immutableCheck: { warnAfter: 300 }, serializableCheck: { warnAfter: 300 } }).concat(activityLogger, persistMiddleware),
    devTools: true, // Redux DevTools enabled
  });

const store = makeStore();
export default store;
