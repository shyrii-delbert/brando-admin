import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '$hooks': path.resolve(__dirname, './src/hooks'),
      '$components': path.resolve(__dirname, './src/components'),
    },
  },
});
