import config from '../config.json';
import { merge } from 'lodash';

const env = (process.env.NODE_ENV === 'production') ? 'production' : 'development';

export const AppSyncConfig = merge(
  {},
  config.global.appsync,
  (config[env].appsync || {})
);

export const CognitoConfig = merge(
  {},
  config.global.cognito,
  (config[env].cognito || {})
);
