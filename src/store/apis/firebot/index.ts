import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

export interface FirebotApiErrorResponse {
  status: 'error';
  message: string;
}

export const firebotApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:7472/api/v1' }),
  endpoints: () => ({}),
  reducerPath: 'firebotApi',
});

export const { util: firebotApiUtil } = firebotApi;
