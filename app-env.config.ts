export const appEnvironments = ['dev', 'staging', 'prod'] as const;

export type AppEnvironment = (typeof appEnvironments)[number];

type AppConfig = {
  API_END_POINT: string;
  LOGIN_URL: string;
};

const appConfigMap: Record<AppEnvironment, AppConfig> = {
  dev: {
    API_END_POINT: 'https://brando-dev-api.delbertbeta.life',
    LOGIN_URL: 'https://sso-dev.delbertbeta.life',
  },
  staging: {
    API_END_POINT: 'https://brando-staging-api.delbertbeta.life',
    LOGIN_URL: 'https://sso-staging.delbertbeta.life',
  },
  prod: {
    API_END_POINT: 'https://brando-api.delbertbeta.life',
    LOGIN_URL: 'https://sso.delbertbeta.life',
  },
};

export const defaultAppEnvironment: AppEnvironment = 'prod';

export const getAppConfig = (appEnv = defaultAppEnvironment): AppConfig => {
  if (appEnv in appConfigMap) {
    return appConfigMap[appEnv as AppEnvironment];
  }

  throw new Error(
    `Unsupported APP_ENV "${appEnv}". Expected one of: ${appEnvironments.join(', ')}`,
  );
};
