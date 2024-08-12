import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { RootState } from '@store';
import type { TwitchAuthState } from '@store/slices/twitchAuth';

import { Mutex } from 'async-mutex';
import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query';

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
export const baseQuery = fetchBaseQuery({ baseUrl: 'https://api.twitch.tv/helix' });
export const fetchRefreshedBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = retry(async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  const { twitchAuth: { authorized, clientId, refreshToken } } = api.getState() as RootState;
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        if (!authorized) retry.fail(result.error);

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
          }, api, extraOptions) as { data: TwitchAuthTokenSuccessResponse | TwitchAuthTokenErrorResponse };

          if (data && 'access_token' in data) {
            const { access_token: accessToken, refresh_token: refreshToken } = data
            api.dispatch(setTwitchAuth({ accessToken, refreshToken }));
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(setTwitchAuth({ authorized: false }));
          }
        } else {
          api.dispatch(setTwitchAuth({ authorized: false }));
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
});
