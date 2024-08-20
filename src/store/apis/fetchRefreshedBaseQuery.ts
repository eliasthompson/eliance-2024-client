import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { RootState } from '@store';

import { Mutex } from 'async-mutex';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

import { setTwitchAuth } from '@store/slices/twitchAuth';

export interface TwitchAuthTokenErrorResponse {
  error: string,
  status: number,
  message: string,
};

export interface TwitchAuthTokenSuccessResponse {
  access_token: string,
  refresh_token: string,
  scope: string[],
  token_type: 'bearer',
};

export const mutex = new Mutex()
export const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.twitch.tv/helix',
  prepareHeaders(headers, api) {
    if (api.endpoint !== 'getDeviceCode' && api.endpoint !== 'getTokens' && api.endpoint !== 'getRefreshedToken') {
      const { twitchAuth: { accessToken, clientId } } = api.getState() as RootState;

      if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
      if (clientId) headers.set('Client-Id', clientId);
    }

    return headers;
  },
});
export const fetchRefreshedBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  const { twitchAuth: { clientId, refreshToken } } = api.getState() as RootState;
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        if (refreshToken) {
          const { data } = await baseQuery({
            body: new URLSearchParams({
              client_id: clientId,
              grant_type: 'refresh_token',
              refresh_token: refreshToken,
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            url: 'https://id.twitch.tv/oauth2/token',
          }, { ...api, endpoint: 'getRefreshedToken' }, extraOptions) as { data: TwitchAuthTokenSuccessResponse | TwitchAuthTokenErrorResponse };
      
          if (data && 'access_token' in data) {
            const { access_token: accessToken, refresh_token: refreshToken } = data
            api.dispatch(setTwitchAuth({ accessToken, refreshToken }));
            result = await baseQuery(args, api, extraOptions);
          }
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
    }
  }

  return result;
};
