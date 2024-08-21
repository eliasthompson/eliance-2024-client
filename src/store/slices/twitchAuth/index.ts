import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

export interface TwitchAuthState {
  accessToken: string | null,
  broadcasterId: string | null,
  clientId: string,
  refreshToken: string | null,
  sessionId: string | null,
  scopes: string[],
};

export const initialTwitchAuthState: TwitchAuthState = {
  accessToken: localStorage.getItem('accessToken'),
  broadcasterId: null,
  clientId: 'rauupizoywti00mgyshjkvewuvlepx',
  refreshToken: localStorage.getItem('refreshToken'),
  sessionId: null,
  scopes: [
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
    'chat:read',
    'whispers:read',
  ],
};

export const twitchAuthSlice = createSlice({
  initialState: initialTwitchAuthState,
  name: 'twitchAuth',
  reducers: {
    setTwitchAuth: (state, { payload }: PayloadAction<Partial<TwitchAuthState>>) => {
      Object.assign(state, payload);

      for (const [key, value] of Object.entries(payload)) {
        if (key === 'accessToken' || key === 'refreshToken') {
          if (typeof value === 'string') localStorage.setItem(key, value);
          else localStorage.removeItem(key);
        }
      }
    },
  },
})

export const {
  actions: {
    setTwitchAuth,
  },
} = twitchAuthSlice;