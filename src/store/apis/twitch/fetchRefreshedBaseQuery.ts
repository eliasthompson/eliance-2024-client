import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { RootState } from '@store';

import { Mutex } from 'async-mutex';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

import { clientId } from '@config';
import { setTwitchAuth } from '@store/slices/twitchAuth';

export interface TwitchApiRefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  scope: string[];
  token_type: 'bearer';
}

export const mutex = new Mutex();
export const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.twitch.tv/helix',
  prepareHeaders(headers, api) {
    if (api.endpoint !== 'getDeviceCode' && api.endpoint !== 'createToken' && api.endpoint !== 'refreshToken') {
      const {
        twitchAuth: { accessToken },
      } = api.getState() as RootState;

      if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
      if (clientId && api.endpoint !== 'validateToken') headers.set('Client-Id', clientId);
    }

    return headers;
  },
});
export const fetchRefreshedBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  await mutex.waitForUnlock();

  const {
    twitchAuth: { refreshToken },
  } = api.getState() as RootState;
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        if (refreshToken) {
          const { data } = (await baseQuery(
            {
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
            },
            { ...api, endpoint: 'refreshToken' },
            extraOptions,
          )) as { data: TwitchApiRefreshTokenResponse };

          if (data) {
            const { access_token: accessToken, refresh_token: refreshToken } = data;
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
