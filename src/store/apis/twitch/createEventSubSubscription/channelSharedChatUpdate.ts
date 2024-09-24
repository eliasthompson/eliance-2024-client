import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

const type = 'channel.shared_chat.update';
const version = '1';
const getCondition = (broadcasterId: string) => ({
  broadcaster_user_id: broadcasterId,
});

export interface TwitchApiCreateEventSubSubscriptionChannelSharedChatUpdateRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelSharedChatUpdateNotificationMessageEvent = {
  session_id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  host_broadcaster_user_id: string;
  host_broadcaster_user_login: string;
  host_broadcaster_user_name: string;
  participants: {
    broadcaster_user_id: string;
    broadcaster_user_name: string;
    broadcaster_user_login: string;
  }[];
};
export type TwitchEventSubChannelSharedChatUpdateNotificationMessageSubscriptionType = typeof type;
export type TwitchEventSubChannelSharedChatUpdateNotificationMessageSubscriptionVersion = typeof version;
export type TwitchEventSubChannelSharedChatUpdateNotificationMessageSubscriptionCondition = ReturnType<
  typeof getCondition
>;
export type TwitchEventSubChannelSharedChatUpdateNotificationMessage = TwitchEventSubNotificationMessage<
  TwitchEventSubChannelSharedChatUpdateNotificationMessageSubscriptionType,
  TwitchEventSubChannelSharedChatUpdateNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelSharedChatUpdateNotificationMessageSubscriptionCondition,
  TwitchEventSubChannelSharedChatUpdateNotificationMessageEvent
>;
export type TwitchEventSubChannelSharedChatUpdateRevocationMessage = TwitchEventSubRevocationMessage<
  TwitchEventSubChannelSharedChatUpdateNotificationMessageSubscriptionType,
  TwitchEventSubChannelSharedChatUpdateNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelSharedChatUpdateNotificationMessageSubscriptionCondition
>;

export const {
  useCreateEventSubSubscriptionChannelSharedChatUpdateQuery,
  useLazyCreateEventSubSubscriptionChannelSharedChatUpdateQuery,
} = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelSharedChatUpdate: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionChannelSharedChatUpdateRequest
    >({
      query: ({ broadcasterId, sessionId }) => ({
        body: {
          type,
          version,
          condition: getCondition(broadcasterId),
          transport: {
            method: 'websocket',
            session_id: sessionId,
          },
        },
        method: 'POST',
        url: '/eventsub/subscriptions',
      }),
    }),
  }),
});
