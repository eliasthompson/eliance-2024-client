import { createApi } from '@reduxjs/toolkit/query/react';

import { fetchRefreshedBaseQuery } from '@store/apis/twitch/fetchRefreshedBaseQuery';

export interface TwitchApiCreateEventSubSubscriptionResponse {
  data: {
    id: string;
    status: 'enabled';
    type: string;
    version: number;
    condition: object;
    created_at: string;
    transport: {
      method: 'websocket';
      session_id: string;
    };
    connected_at: string;
    cost: number;
  }[];
  total: number;
  total_cost: number;
  max_total_cost: number;
}

export interface TwitchApiErrorResponse {
  error?: string;
  status: number;
  message: string;
}

export type TwitchEventSubBaseMessage<Metadata, Payload> = {
  metadata: Metadata;
  payload: Payload;
};
export type TwitchEventSubSystemMessage<MessageType, Payload> = TwitchEventSubBaseMessage<
  {
    message_id: string;
    message_type: MessageType;
    message_timestamp: string;
  },
  Payload
>;
export type TwitchEventSubSystemSessionMessage<MessageType, Status> = TwitchEventSubSystemMessage<
  MessageType,
  {
    session: {
      id: string;
      status: Status;
      keepalive_timeout_seconds: null;
      reconnect_url: string;
      connected_at: string;
    };
  }
>;
export type TwitchEventSubSubscriptionMessage<
  MessageType,
  SubscriptionType,
  SubscriptionVersion,
  SubscriptionStatus,
  SubscriptionCondition,
  Event,
> = TwitchEventSubBaseMessage<
  {
    message_id: string;
    message_type: MessageType;
    message_timestamp: string;
    subscription_type: SubscriptionType;
    subscription_version: SubscriptionVersion;
  },
  {
    subscription: {
      id: string;
      status: SubscriptionStatus;
      type: SubscriptionType;
      version: SubscriptionVersion;
      cost: number;
      condition: SubscriptionCondition;
      transport: {
        method: 'websocket';
        session_id: string;
      };
      created_at: string;
    };
    event: Event;
  }
>;
export type TwitchEventSubNotificationMessage<SubscriptionType, SubscriptionVersion, SubscriptionCondition, Event> =
  TwitchEventSubSubscriptionMessage<
    'notification',
    SubscriptionType,
    SubscriptionVersion,
    'enabled',
    SubscriptionCondition,
    Event
  >;
export type TwitchEventSubRevocationMessage<SubscriptionType, SubscriptionVersion, SubscriptionCondition> =
  TwitchEventSubSubscriptionMessage<
    'revocation',
    SubscriptionType,
    SubscriptionVersion,
    'authorization_revoked' | 'user_removed' | 'version_removed',
    SubscriptionCondition,
    undefined
  >;
export type TwitchEventSubWelcomeMessage = TwitchEventSubSystemSessionMessage<'session_welcome', 'connected'>;
export type TwitchEventSubKeepaliveMessage = TwitchEventSubSystemMessage<'session_keepalive', object>;
export type TwitchEventSubReconnectMessage = TwitchEventSubSystemSessionMessage<'session_reconnect', 'reconnecting'>;

export type TwitchPubSubBaseMessage<Type, Data> = {
  type: Type;
  data: Data;
};
export type TwitchPubSubPongMessage = TwitchPubSubBaseMessage<'PONG', undefined>;
export type TwitchPubSubReconnectMessage = TwitchPubSubBaseMessage<'RECONNECT', undefined>;
export type TwitchPubSubAuthRevokedMessage = TwitchPubSubBaseMessage<
  'AUTH_REVOKED',
  {
    topics: string[];
  }
>;
export type TwitchPubSubResponseMessage = TwitchPubSubBaseMessage<'RESPONSE', undefined> & {
  nonce: string;
  error: string;
};
export type TwitchPubSubMessageMessage = TwitchPubSubBaseMessage<
  'MESSAGE',
  {
    topic: string;
    message: string;
  }
>;

export const twitchApi = createApi({
  baseQuery: fetchRefreshedBaseQuery,
  endpoints: () => ({}),
  reducerPath: 'twitchApi',
  tagTypes: ['UNAUTHORIZED'],
});

export const {
  util: { invalidateTags: invalidateTwitchApiTags },
} = twitchApi;
