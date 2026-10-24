import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom/server';

const mem = new Map();
globalThis.localStorage = { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k) };

const { makeStore } = await import('../store');
const { loadFromStorage } = await import('../store/thunks/loadFromStorage');
const { loginUser } = await import('../store/thunks/loginUser');
const { default: App } = await import('../App');

// Smoke test: every route renders without throwing, for both roles
describe('pages render', () => {
  for (const [user, pass] of [['admin', 'admin123'], ['manager', 'manager123']]) {
    for (const path of ['/', '/crops', '/harvest-orders', '/buyers', '/tasks', '/expenses', '/inventory', '/reports']) {
      it(`${user} ${path}`, async () => {
        const store = makeStore();
        await store.dispatch(loadFromStorage());
        await store.dispatch(loginUser({ username: user, password: pass }));
        const html = renderToString(<Provider store={store}><StaticRouter location={path}><App /></StaticRouter></Provider>);
        expect(html.length).toBeGreaterThan(500);
      });
    }
  }
  it('signed-out user sees the login page', async () => {
    mem.clear(); // drop the session saved by earlier tests
    const store = makeStore();
    await store.dispatch(loadFromStorage());
    const html = renderToString(<Provider store={store}><StaticRouter location="/login"><App /></StaticRouter></Provider>);
    expect(html).toContain('Sign in');
  });
});
