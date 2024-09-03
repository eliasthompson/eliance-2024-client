import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiCreateEventSubSubscriptionChannelChatClearUserMessagesRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelChatClearUserMessagesNotificationMessageSubscriptionType =
  'channel.chat.clear_user_messages';
export type TwitchEventSubChannelChatClearUserMessagesNotificationMessageSubscriptionVersion = '1';
export type TwitchEventSubChannelChatClearUserMessagesNotificationMessageSubscriptionCondition = {
  broadcaster_user_id: string;
  user_id: string;
};
export type TwitchEventSubChannelChatClearUserMessagesNotificationMessageEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  target_user_id: string;
  target_user_login: string;
  target_user_name: string;
};
export type TwitchEventSubChannelChatClearUserMessagesNotificationMessage = TwitchEventSubNotificationMessage<
  TwitchEventSubChannelChatClearUserMessagesNotificationMessageSubscriptionType,
  TwitchEventSubChannelChatClearUserMessagesNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelChatClearUserMessagesNotificationMessageSubscriptionCondition,
  TwitchEventSubChannelChatClearUserMessagesNotificationMessageEvent
>;
export type TwitchEventSubChannelChatClearUserMessagesRevocationMessage = TwitchEventSubRevocationMessage<
  TwitchEventSubChannelChatClearUserMessagesNotificationMessageSubscriptionType,
  TwitchEventSubChannelChatClearUserMessagesNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelChatClearUserMessagesNotificationMessageSubscriptionCondition
>;

export const { useCreateEventSubSubscriptionChannelChatClearUserMessagesQuery } = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelChatClearUserMessages: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionChannelChatClearUserMessagesRequest
    >({
      query: ({ broadcasterId, sessionId }) => ({
        body: {
          type: 'channel.chat.clear_user_messages',
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
