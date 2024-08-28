import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

export const chatPronounsApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pronouns.alejo.io/api' }),
  endpoints: () => ({}),
  reducerPath: 'chatPronounsApi',
});

export const { util: chatPronounsApiUtil } = chatPronounsApi;
