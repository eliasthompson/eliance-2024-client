import type { scopes } from '@config';

import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiValidateTokenResponse {
  client_id: string;
  login: string;
  scopes: typeof scopes;
  user_id: string;
  expires_in: number;
}

export const { useValidateTokenQuery } = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    validateToken: build.query<TwitchApiValidateTokenResponse, void>({
      query: () => ({
        method: 'GET',
        url: 'https://id.twitch.tv/oauth2/validate',
      }),
      providesTags: (result, error) => {
        if (error?.status === 401) return ['UNAUTHORIZED'];
        return [];
      },
    }),
  }),
});
