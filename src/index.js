import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/custom.css';
import store from './store';
import { loadFromStorage } from './store/thunks/loadFromStorage';
import App from './App';

const root = createRoot(document.getElementById('root'));

// Rehydrate the store from localStorage first, then render
store.dispatch(loadFromStorage()).finally(() => {
  root.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
});
