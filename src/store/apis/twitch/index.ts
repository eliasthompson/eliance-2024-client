import type { TwitchAuthState } from '@store/slices/twitchAuth';

import { createApi } from '@reduxjs/toolkit/query/react';

import { fetchRefreshedBaseQuery } from '@store/apis/fetchRefreshedBaseQuery';

export interface TwitchGetDeviceCodeSuccessResponse {
  device_code: string,
  expires_in: number,
  interval: number,
  user_code: string,
  verification_uri: string,
};

export interface TwitchGetTokensErrorResponse {
  message: string,
  status: number,
};

export interface TwitchGetTokensSuccessResponse {
  access_token: string,
  expires_in: number,
  refresh_token: string,
  scope: string[],
  token_type: string,
};

export const getTwitchApiHeaders = ({ accessToken, clientId }: Partial<TwitchAuthState>) => ({
  ...((accessToken) ? { 'Authorization': `Bearer ${accessToken}` } : {}),
  ...((clientId) ? { 'Client-Id': `Bearer ${clientId}` } : {}),
});

export const twitch = createApi({
  baseQuery: fetchRefreshedBaseQuery,
  endpoints: (builder) => ({
    getChannel: builder.query<any, Partial<TwitchAuthState> & { broadcasterId: string }>({
      query: ({ accessToken, broadcasterId, clientId }) => ({
        method: 'GET',
        url: `/channels?broadcaster_id=${broadcasterId}`,
        headers: getTwitchApiHeaders({ accessToken, clientId }),
      }),
      providesTags: (result, error, { broadcasterId }) => {
        if (result) return [{ type: 'CHANNEL', id: broadcasterId }];
        if (error?.status === 401) return ['UNAUTHORIZED'];
        return ['UNKNOWN_ERROR'];
      }
    }),
    getTokens: builder.mutation<TwitchGetTokensSuccessResponse | TwitchGetTokensErrorResponse, Partial<TwitchAuthState>>({
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
      invalidatesTags: (result) => ((result) ? ['UNAUTHORIZED'] : []),
    }),
    getDeviceCode: builder.query<TwitchGetDeviceCodeSuccessResponse, Partial<TwitchAuthState>>({
      query: ({ clientId, scopes }) => ({
        body: new URLSearchParams({
          client_id: clientId,
          scopes: scopes.join(' '),
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        url: 'https://id.twitch.tv/oauth2/device',
      }),
    }),
  }),
  reducerPath: 'twitch',
  tagTypes: ['CHANNEL', 'UNAUTHORIZED', 'UNKNOWN_ERROR'],
});

export const {
  useGetChannelQuery,
  useGetTokensMutation,
  useLazyGetDeviceCodeQuery,
} = twitch;