import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import config from './dev.config';

import dotenv from 'dotenv';
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: config.port,
    hmr: {
      port: config.hmr,
      clientPort: config.clientPort,
    },
  },
  define: {
    API_END_POINT: `'${config.apiEndPoint}'`,
    LOGIN_URL: `'${process.env.LOGIN_URL}'`,
  },
  resolve: {
    alias: {
      $hooks: path.resolve(__dirname, './src/hooks'),
      $components: path.resolve(__dirname, './src/components'),
      $consts: path.resolve(__dirname, './src/consts'),
      $utils: path.resolve(__dirname, './src/utils'),
      $typings: path.resolve(__dirname, './src/typings'),
    },
  },
});
