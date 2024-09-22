import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

const type = 'channel.chat_settings.update';
const version = '1';
const getCondition = (broadcasterId: string) => ({
  broadcaster_user_id: broadcasterId,
  user_id: broadcasterId,
});

export interface TwitchApiCreateEventSubSubscriptionChannelChatSettingsUpdateRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelChatSettingsUpdateNotificationMessageEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  emote_mode: boolean;
  follower_mode: boolean;
  follower_mode_duration: number | null;
  slow_mode: boolean;
  slow_mode_wait_time: number | null;
  subscriber_mode: boolean;
  unique_chat_mode: boolean;
};
export type TwitchEventSubChannelChatSettingsUpdateNotificationMessageSubscriptionType = typeof type;
export type TwitchEventSubChannelChatSettingsUpdateNotificationMessageSubscriptionVersion = typeof version;
export type TwitchEventSubChannelChatSettingsUpdateNotificationMessageSubscriptionCondition = ReturnType<
  typeof getCondition
>;
export type TwitchEventSubChannelChatSettingsUpdateNotificationMessage = TwitchEventSubNotificationMessage<
  TwitchEventSubChannelChatSettingsUpdateNotificationMessageSubscriptionType,
  TwitchEventSubChannelChatSettingsUpdateNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelChatSettingsUpdateNotificationMessageSubscriptionCondition,
  TwitchEventSubChannelChatSettingsUpdateNotificationMessageEvent
>;
export type TwitchEventSubChannelChatSettingsUpdateRevocationMessage = TwitchEventSubRevocationMessage<
  TwitchEventSubChannelChatSettingsUpdateNotificationMessageSubscriptionType,
  TwitchEventSubChannelChatSettingsUpdateNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelChatSettingsUpdateNotificationMessageSubscriptionCondition
>;

export const {
  useCreateEventSubSubscriptionChannelChatSettingsUpdateQuery,
  useLazyCreateEventSubSubscriptionChannelChatSettingsUpdateQuery,
} = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelChatSettingsUpdate: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionChannelChatSettingsUpdateRequest
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
