import type { TwitchAuthState } from '@store/slices/twitchAuth';

import { twitchApi } from '.';

export interface TwitchApiValidateTokenResponse {
  client_id: string,
  login: string,
  scopes: TwitchAuthState['scopes'],
  user_id: string,
  expires_in: number,
};

export const { useValidateTokenQuery } = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    validateToken: build.query<TwitchApiValidateTokenResponse, void>({
      query: () => ({
        method: 'GET',
        url: 'https://id.twitch.tv/oauth2/validate',
      }),
    }),
  })
});
