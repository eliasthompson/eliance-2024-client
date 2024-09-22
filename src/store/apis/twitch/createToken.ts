import type { scopes } from '@config';

import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiCreateTokenRequest {
  clientId: string;
  deviceCode: string;
  scopes: typeof scopes;
}

export interface TwitchApiCreateTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: string;
}

export const { useCreateTokenMutation } = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createToken: build.mutation<TwitchApiCreateTokenResponse, TwitchApiCreateTokenRequest>({
      query: ({ clientId, deviceCode, scopes }) => ({
        body: new URLSearchParams({
          client_id: clientId,
          device_code: deviceCode,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
          scopes: scopes.join(' '),
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        url: 'https://id.twitch.tv/oauth2/token',
      }),
    }),
  }),
});
