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
// Web Locks reach every page on the origin; without them, a page only serializes its own refreshes
const withSharedRefreshLock = (callback: () => Promise<void>) =>
  'locks' in navigator ? navigator.locks.request('twitchRefresh', callback) : callback();
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
    // Every overlay on this origin, such as the landscape and portrait info bars, shares the stored tokens, and Twitch
    // takes each refresh token only once, so refresh under a lock they all share, and take up tokens another refreshed
    await withSharedRefreshLock(async () => {
      const { twitchAuth } = api.getState() as RootState;
      const accessToken = localStorage.getItem('accessToken') ?? twitchAuth.accessToken;
      const refreshToken = localStorage.getItem('refreshToken') ?? twitchAuth.refreshToken;
      const wasRefreshedSinceRequest = accessToken !== null && accessToken !== accessTokenUsedByRequest;

      if (wasRefreshedSinceRequest) {
        if (accessToken !== twitchAuth.accessToken) api.dispatch(setTwitchAuth({ accessToken, refreshToken }));

        result = await helixBaseQuery(args, api, extraOptions);

        return;
      }

      if (!refreshToken) {
        api.dispatch(clearTwitchAuth());

        return;
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
    });
  } finally {
    release();
  }

  return result;
};
