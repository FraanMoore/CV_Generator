/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    pool: 'threads',
    server: {
      deps: {
        inline: [/@mui/, /@emotion/, 'styled-components', /@csstools/],
      },
    },
  },
  resolve: {
    alias: {
      '@csstools/css-calc': '@csstools/css-calc/dist/index.mjs',
    },
  },
});