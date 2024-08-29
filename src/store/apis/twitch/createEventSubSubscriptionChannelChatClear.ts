import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiCreateEventSubSubscriptionChannelChatClearRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelChatClearNotificationMessageSubscriptionType = 'channel.chat.clear';
export type TwitchEventSubChannelChatClearNotificationMessageSubscriptionVersion = '1';
export type TwitchEventSubChannelChatClearNotificationMessageSubscriptionCondition = {
  broadcaster_user_id: string;
  user_id: string;
};
export type TwitchEventSubChannelChatClearNotificationMessageEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
};
export type TwitchEventSubChannelChatClearNotificationMessage = TwitchEventSubNotificationMessage<
  TwitchEventSubChannelChatClearNotificationMessageSubscriptionType,
  TwitchEventSubChannelChatClearNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelChatClearNotificationMessageSubscriptionCondition,
  TwitchEventSubChannelChatClearNotificationMessageEvent
>;
export type TwitchEventSubChannelChatClearRevocationMessage = TwitchEventSubRevocationMessage<
  TwitchEventSubChannelChatClearNotificationMessageSubscriptionType,
  TwitchEventSubChannelChatClearNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelChatClearNotificationMessageSubscriptionCondition
>;

export const { useCreateEventSubSubscriptionChannelChatClearQuery } = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelChatClear: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionChannelChatClearRequest
    >({
      query: ({ broadcasterId, sessionId }) => ({
        body: {
          type: 'channel.chat.clear',
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
