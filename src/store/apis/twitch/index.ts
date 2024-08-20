import { createApi } from '@reduxjs/toolkit/query/react';

import { fetchRefreshedBaseQuery } from '@store/apis/fetchRefreshedBaseQuery';

export const twitchApi = createApi({
  baseQuery: fetchRefreshedBaseQuery,
  endpoints: () => ({}),
  reducerPath: 'twitchApi',
  tagTypes: ['UNAUTHORIZED'],
});

export const { util: twitchApiUtil } = twitchApi;