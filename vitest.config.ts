import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@core': resolve(__dirname, 'packages/core'),
      '@calculator': resolve(__dirname, 'packages/calculator'),
      '@glossary': resolve(__dirname, 'packages/glossary'),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'src'],
  },
});
