import Amplify from 'aws-amplify';

import { CognitoConfig, AppSyncConfig } from './config';

export function configureAmplify() {
  Amplify.configure(Object.assign({},
    {
      Auth: CognitoConfig
    },
    AppSyncConfig
  ));
}
