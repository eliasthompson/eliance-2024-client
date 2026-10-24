import * as uuid from 'uuid';

import {
  clientId as clientIdSecret,
  firebotGuestRoleId as firebotGuestRoleIdSecret,
  namespace as namespaceSecret,
  obsWebSocketPassword as obsWebSocketPasswordSecret,
} from '@/config/secrets';

export const clientId = clientIdSecret;
export const firebotGuestRoleId = firebotGuestRoleIdSecret;
export const namespace = namespaceSecret || uuid.v4();
export const obsWebSocketUrl = 'ws://localhost:4455';
export const obsWebSocketPassword = obsWebSocketPasswordSecret;
