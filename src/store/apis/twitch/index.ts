import { createApi } from '@reduxjs/toolkit/query/react';

import { fetchRefreshedBaseQuery } from '@store/apis/twitch/fetchRefreshedBaseQuery';

export interface TwitchApiErrorResponse {
  error?: string,
  message: string,
  status: number,
}

export const twitchApi = createApi({
  baseQuery: fetchRefreshedBaseQuery,
  endpoints: () => ({}),
  reducerPath: 'twitchApi',
  tagTypes: ['UNAUTHORIZED'],
});

export const { util: twitchApiUtil } = twitchApi;