import { defineConfig } from '@rsbuild/core';
import path from 'path';
import { pluginReact } from '@rsbuild/plugin-react';
import { defaultAppEnvironment, getAppConfig } from './app-env.config';

const appConfig = getAppConfig(process.env.APP_ENV ?? defaultAppEnvironment);
const devServerPort = Number(process.env.DEV_SERVER_PORT ?? '8083');
const devHmrPort = Number(process.env.DEV_HMR_PORT ?? '8083');

export default defineConfig({
  source: {
    entry: {
      index: './src/main.tsx',
    },
    define: {
      API_END_POINT: JSON.stringify(appConfig.API_END_POINT),
      LOGIN_URL: JSON.stringify(appConfig.LOGIN_URL),
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
    port: devServerPort,
  },
  dev: {
    client: {
      port: devHmrPort,
    },
  },
});
