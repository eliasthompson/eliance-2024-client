import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

export interface FirebotApiErrorResponse {
  status: 'error';
  message: string;
}
export interface FirebotEventSubMessagePayload {
  type: 'invoke';
  name: 'subscribe-events';
}
export interface FirebotEventSubMessage {
  type: string;
  name: string;
  data?: object;
}

export const firebotApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:7472/api/v1' }),
  endpoints: () => ({}),
  reducerPath: 'firebotApi',
});

export const { util: firebotApiUtil } = firebotApi;
