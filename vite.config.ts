import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '../../content/engine': path.resolve(__dirname, './tests/mocks/engine-mock.ts'),
    },
  },
});
