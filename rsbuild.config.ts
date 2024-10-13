import { defineConfig } from '@rsbuild/core';
import path from 'path';
import config from './dev.config';
import dotenv from 'dotenv';
import { pluginReact } from '@rsbuild/plugin-react';

dotenv.config();

export default defineConfig({
  source: {
    entry: {
      index: './src/main.tsx',
    },
    define: {
      API_END_POINT: `'${process.env.API_END_POINT}'`,
      LOGIN_URL: `'${process.env.LOGIN_URL}'`,
    },
    alias: {
      $hooks: path.resolve(__dirname, './src/hooks'),
      $components: path.resolve(__dirname, './src/components'),
      $consts: path.resolve(__dirname, './src/consts'),
      $utils: path.resolve(__dirname, './src/utils'),
      $typings: path.resolve(__dirname, './src/typings'),
    },
  },
  html: {
    template: './index.html',
  },
  plugins: [pluginReact()],
  server: {
    host: '0.0.0.0',
    port: config.port,
  },
  dev: {
    client: {
      port: config.hmr,
    },
  },
});
