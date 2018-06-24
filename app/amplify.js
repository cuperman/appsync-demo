import Amplify from 'aws-amplify';

import { AppSyncConfig } from './config';

export function configureAmplify() {
  Amplify.configure(AppSyncConfig);
}
