import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Source files use the .js extension (App.js, index.js) but contain JSX.
export default defineConfig({
  plugins: [react({ include: /\.(js|jsx)$/ })],
  esbuild: { loader: 'jsx', include: /src\/.*\.jsx?$/, exclude: [] },
  optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } },
  test: { environment: 'node', include: ['src/**/*.test.js'] },
});
