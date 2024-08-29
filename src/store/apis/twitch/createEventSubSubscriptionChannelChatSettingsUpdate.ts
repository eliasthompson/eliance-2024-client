import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiCreateEventSubSubscriptionChannelChatSettingsUpdateRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelChatSettingsUpdateNotificationMessageSubscriptionType = 'channel.chat_settings.update';
export type TwitchEventSubChannelChatSettingsUpdateNotificationMessageSubscriptionVersion = '1';
export type TwitchEventSubChannelChatSettingsUpdateNotificationMessageSubscriptionCondition = {
  broadcaster_user_id: string;
  user_id: string;
};
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

export const { useCreateEventSubSubscriptionChannelChatSettingsUpdateQuery } = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelChatSettingsUpdate: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionChannelChatSettingsUpdateRequest
    >({
      query: ({ broadcasterId, sessionId }) => ({
        body: {
          type: 'channel.chat_settings.update',
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
