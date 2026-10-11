import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { RootState } from '@store';

import { Mutex } from 'async-mutex';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

import { clientId } from '@config';
import { clearTwitchAuth, setTwitchAuth } from '@store/slices/twitchAuth';

interface TwitchApiRefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  scope: string[];
  token_type: 'bearer';
}

const refreshMutex = new Mutex();
const oauthBaseQuery = fetchBaseQuery({ baseUrl: 'https://id.twitch.tv/oauth2' });
const helixBaseQuery = fetchBaseQuery({
  baseUrl: 'https://api.twitch.tv/helix',
  prepareHeaders(headers, api) {
    if (api.endpoint !== 'getDeviceCode' && api.endpoint !== 'createToken') {
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
  await refreshMutex.waitForUnlock();

  const {
    twitchAuth: { accessToken: accessTokenUsedByRequest },
  } = api.getState() as RootState;
  let result = await helixBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) return result;

  const isAnotherRequestRefreshing = refreshMutex.isLocked();

  if (isAnotherRequestRefreshing) {
    await refreshMutex.waitForUnlock();

    return helixBaseQuery(args, api, extraOptions);
  }

  const release = await refreshMutex.acquire();

  try {
    const {
      twitchAuth: { accessToken, refreshToken },
    } = api.getState() as RootState;
    const wasRefreshedSinceRequest = accessToken !== accessTokenUsedByRequest;

    if (wasRefreshedSinceRequest) return await helixBaseQuery(args, api, extraOptions);

    if (!refreshToken) {
      api.dispatch(clearTwitchAuth());

      return result;
    }

    const refreshResult = await oauthBaseQuery(
      {
        body: new URLSearchParams({ client_id: clientId, grant_type: 'refresh_token', refresh_token: refreshToken }),
        method: 'POST',
        url: '/token',
      },
      api,
      extraOptions,
    );
    const isRefreshTokenRejected = refreshResult.error?.status === 400 || refreshResult.error?.status === 401;

    if (refreshResult.data) {
      const { access_token: newAccessToken, refresh_token: newRefreshToken } =
        refreshResult.data as TwitchApiRefreshTokenResponse;

      api.dispatch(setTwitchAuth({ accessToken: newAccessToken, refreshToken: newRefreshToken }));
      result = await helixBaseQuery(args, api, extraOptions);
    } else if (isRefreshTokenRejected) {
      api.dispatch(clearTwitchAuth());
    }
  } finally {
    release();
  }

  return result;
};
