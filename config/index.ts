import type { LayoutOptions } from 'obs-layout-generator';

import * as uuid from 'uuid';

import {
  clientId as clientIdSecret,
  firebotGuestRoleId as firebotGuestRoleIdSecret,
  namespace as namespaceSecret,
} from './secrets';

export const clientId = clientIdSecret;
export const firebotGuestRoleId = firebotGuestRoleIdSecret;
export const layoutOptions = {
  canvasWidth: 1920,
  canvasHeight: 1080,
  canvasMarginTop: 105,
  canvasMarginBottom: 105,
  canvasPadding: 24,
  canvasGap: 24,
  layoutGap: 18,
  regionBorder: 6,
} as const satisfies LayoutOptions;
export const namespace = namespaceSecret || uuid.v4();
export const scopes = [
  'bits:read',
  'channel:bot',
  'channel:read:ads',
  'channel:read:charity',
  'channel:read:editors',
  'channel:read:goals',
  'channel:read:guest_star',
  'channel:read:hype_train',
  'channel:read:polls',
  'channel:read:predictions',
  'channel:read:redemptions',
  'channel:read:subscriptions',
  'channel:read:vips',
  'chat:read',
  'moderation:read',
  'moderator:read:automod_settings',
  'moderator:read:chat_messages',
  'moderator:read:chat_settings',
  'moderator:read:chatters',
  'moderator:read:followers',
  'moderator:read:guest_star',
  'moderator:read:shield_mode',
  'moderator:read:shoutouts',
  'moderator:read:suspicious_users',
  'moderator:read:unban_requests',
  'moderator:read:warnings',
  'user:read:broadcast',
  'user:read:chat',
  'user:read:emotes',
  'user:read:follows',
  'user:read:moderated_channels',
  'user:read:subscriptions',
  'user:read:whispers',
  'whispers:read',
];
