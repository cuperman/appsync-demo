import Amplify from 'aws-amplify';

import { AppSyncConfig } from '../config.json';

export function configureAmplify() {
  Amplify.configure(AppSyncConfig);
}
