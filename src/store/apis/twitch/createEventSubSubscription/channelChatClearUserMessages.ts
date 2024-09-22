import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

const type = 'channel.chat.clear_user_messages';
const version = '1';
const getCondition = (broadcasterId: string) => ({
  broadcaster_user_id: broadcasterId,
  user_id: broadcasterId,
});

export interface TwitchApiCreateEventSubSubscriptionChannelChatClearUserMessagesRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelChatClearUserMessagesNotificationMessageEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  target_user_id: string;
  target_user_login: string;
  target_user_name: string;
};
export type TwitchEventSubChannelChatClearUserMessagesNotificationMessageSubscriptionType = typeof type;
export type TwitchEventSubChannelChatClearUserMessagesNotificationMessageSubscriptionVersion = typeof version;
export type TwitchEventSubChannelChatClearUserMessagesNotificationMessageSubscriptionCondition = ReturnType<
  typeof getCondition
>;
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

export const {
  useCreateEventSubSubscriptionChannelChatClearUserMessagesQuery,
  useLazyCreateEventSubSubscriptionChannelChatClearUserMessagesQuery,
} = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelChatClearUserMessages: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionChannelChatClearUserMessagesRequest
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
