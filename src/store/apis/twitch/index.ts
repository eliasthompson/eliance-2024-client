import { createApi } from '@reduxjs/toolkit/query/react';

import { fetchRefreshedBaseQuery } from '@store/apis/twitch/fetchRefreshedBaseQuery';

export interface TwitchApiCreateEventSubSubscriptionResponse {
  data: {
    id: string,
    status: 'enabled',
    type: string,
    version: number,
    condition: object,
    created_at: string,
    transport: {
      method: 'websocket',
      session_id: string,
    },
    connected_at: string,
    cost: number,
  }[],
  total: number,
  total_cost: number,
  max_total_cost: number,
};

export interface TwitchEventSubRevocationMessage<Metadata, Payload, Subscription> {
  metadata: Metadata & {
    message_type: 'revocation',
  },
  payload: Payload & {
    subscription: Subscription & {
      status: 'authorization_revoked' | 'user_removed' | 'version_removed',
    },
    event: undefined,
  },
};

export interface TwitchApiErrorResponse {
  error?: string,
  status: number,
  message: string,
};

export const twitchApi = createApi({
  baseQuery: fetchRefreshedBaseQuery,
  endpoints: () => ({}),
  reducerPath: 'twitchApi',
  tagTypes: ['UNAUTHORIZED'],
});

export const { util: twitchApiUtil } = twitchApi;