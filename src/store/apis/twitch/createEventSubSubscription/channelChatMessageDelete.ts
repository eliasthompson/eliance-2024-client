import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

const type = 'channel.chat.message_delete';
const version = '1';
const getCondition = (broadcasterId: string) => ({
  broadcaster_user_id: broadcasterId,
  user_id: broadcasterId,
});

export interface TwitchApiCreateEventSubSubscriptionChannelChatMessageDeleteRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelChatMessageDeleteNotificationMessageEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  target_user_id: string;
  target_user_login: string;
  target_user_name: string;
  message_id: string;
};
export type TwitchEventSubChannelChatMessageDeleteNotificationMessageSubscriptionType = typeof type;
export type TwitchEventSubChannelChatMessageDeleteNotificationMessageSubscriptionVersion = typeof version;
export type TwitchEventSubChannelChatMessageDeleteNotificationMessageSubscriptionCondition = ReturnType<
  typeof getCondition
>;
export type TwitchEventSubChannelChatMessageDeleteNotificationMessage = TwitchEventSubNotificationMessage<
  TwitchEventSubChannelChatMessageDeleteNotificationMessageSubscriptionType,
  TwitchEventSubChannelChatMessageDeleteNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelChatMessageDeleteNotificationMessageSubscriptionCondition,
  TwitchEventSubChannelChatMessageDeleteNotificationMessageEvent
>;
export type TwitchEventSubChannelChatMessageDeleteRevocationMessage = TwitchEventSubRevocationMessage<
  TwitchEventSubChannelChatMessageDeleteNotificationMessageSubscriptionType,
  TwitchEventSubChannelChatMessageDeleteNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelChatMessageDeleteNotificationMessageSubscriptionCondition
>;

export const {
  useCreateEventSubSubscriptionChannelChatMessageDeleteQuery,
  useLazyCreateEventSubSubscriptionChannelChatMessageDeleteQuery,
} = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelChatMessageDelete: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionChannelChatMessageDeleteRequest
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
