import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

const type = 'channel.chat.clear';
const version = '1';
const getCondition = (broadcasterId: string) => ({
  broadcaster_user_id: broadcasterId,
  user_id: broadcasterId,
});

export interface TwitchApiCreateEventSubSubscriptionChannelChatClearRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelChatClearNotificationMessageEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
};
export type TwitchEventSubChannelChatClearNotificationMessageSubscriptionType = typeof type;
export type TwitchEventSubChannelChatClearNotificationMessageSubscriptionVersion = typeof version;
export type TwitchEventSubChannelChatClearNotificationMessageSubscriptionCondition = ReturnType<typeof getCondition>;
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

export const {
  useCreateEventSubSubscriptionChannelChatClearQuery,
  useLazyCreateEventSubSubscriptionChannelChatClearQuery,
} = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelChatClear: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionChannelChatClearRequest
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
