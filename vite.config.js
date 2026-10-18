import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Components are written as .js files (as required by the brief), so JSX is enabled for .js.
export default defineConfig({
  base: './',
  plugins: [react({ include: /\.(js|jsx)$/ })],
  esbuild: { loader: 'jsx', include: /src\/.*\.jsx?$/, exclude: [] },
  optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } },
  test: { environment: 'node', include: ['src/tests/**/*.test.js'] },
});
