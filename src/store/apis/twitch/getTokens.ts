import type { TwitchAuthState } from '@store/slices/twitchAuth';

import { twitchApi } from '.';

export interface TwitchApiGetTokensRequest {
  clientId: string,
  deviceCode: string,
  scopes: TwitchAuthState['scopes'],
}

export interface TwitchApiGetTokensResponse {
  access_token: string,
  expires_in: number,
  refresh_token: string,
  scope: string[],
  token_type: string,
};

export const { useLazyGetTokensQuery } = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    getTokens: build.query<TwitchApiGetTokensResponse, TwitchApiGetTokensRequest>({
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
  })
});
