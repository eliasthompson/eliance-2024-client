import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiCreateEventSubSubscriptionChannelChatMessageDeleteRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelChatMessageDeleteNotificationMessageSubscriptionType = 'channel.chat.message_delete';
export type TwitchEventSubChannelChatMessageDeleteNotificationMessageSubscriptionVersion = '1';
export type TwitchEventSubChannelChatMessageDeleteNotificationMessageSubscriptionCondition = {
  broadcaster_user_id: string;
  user_id: string;
};
export type TwitchEventSubChannelChatMessageDeleteNotificationMessageEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  target_user_id: string;
  target_user_login: string;
  target_user_name: string;
  message_id: string;
};
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

export const { useCreateEventSubSubscriptionChannelChatMessageDeleteQuery } = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelChatMessageDelete: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionChannelChatMessageDeleteRequest
    >({
      query: ({ broadcasterId, sessionId }) => ({
        body: {
          type: 'channel.chat.message_delete',
          version: 1,
          condition: {
            broadcaster_user_id: broadcasterId,
            user_id: broadcasterId,
          },
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
