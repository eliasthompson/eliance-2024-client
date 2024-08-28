import type { TwitchApiCreateEventSubSubscriptionResponse } from '@store/apis/twitch';
import type { TwitchEventSubNotificationMessage } from '@components/Container/types';

import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiCreateEventSubSubscriptionChannelChatSettingsUpdateRequest {
  broadcasterId: string;
  sessionId: string;
}

export interface TwitchEventSubChannelChatSettingsUpdateNotificationMessage extends TwitchEventSubNotificationMessage {
  metadata: TwitchEventSubNotificationMessage['metadata'] & {
    subscription_type: 'channel.chat.notification';
    subscription_version: '1';
  };
  payload: TwitchEventSubNotificationMessage['payload'] & {
    subscription: TwitchEventSubNotificationMessage['payload']['subscription'] & {
      type: 'channel.chat.notification';
      version: '1';
      condition: {
        broadcaster_user_id: string;
        user_id: string;
      };
    };
    event: {
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
  };
}

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
