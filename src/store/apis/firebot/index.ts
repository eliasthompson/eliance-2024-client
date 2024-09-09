import { createApi } from '@reduxjs/toolkit/query/react';

import { fetchStaggeredBaseQuery } from '@store/apis/firebot/fetchStaggeredBaseQuery';

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
  baseQuery: fetchStaggeredBaseQuery,
  endpoints: () => ({}),
  reducerPath: 'firebotApi',
});

export const { util: firebotApiUtil } = firebotApi;
