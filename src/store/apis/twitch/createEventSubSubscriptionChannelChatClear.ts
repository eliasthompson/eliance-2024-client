import type { TwitchApiCreateEventSubSubscriptionResponse } from '@store/apis/twitch';
import type { TwitchEventSubNotificationMessage } from '@components/Container/types';

import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiCreateEventSubSubscriptionChannelChatClearRequest {
  broadcasterId: string,
  sessionId: string,
};

export interface TwitchEventSubChannelChatClearNotificationMessage extends TwitchEventSubNotificationMessage {
  metadata: TwitchEventSubNotificationMessage['metadata'] & {
    subscription_type: 'channel.chat.clear',
    subscription_version: '1',
  },
  payload: TwitchEventSubNotificationMessage['payload'] & {
    subscription: TwitchEventSubNotificationMessage['payload']['subscription'] & {
      type: 'channel.chat.clear',
      version: '1',
      condition: {
        broadcaster_user_id: string,
        user_id: string,
      },
    },
    event: {
      broadcaster_user_id: string,
      broadcaster_user_login: string,
      broadcaster_user_name: string,
    },
  },
};

export const { useCreateEventSubSubscriptionChannelChatClearQuery } = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelChatClear: build.query<TwitchApiCreateEventSubSubscriptionResponse, TwitchApiCreateEventSubSubscriptionChannelChatClearRequest>({
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
  })
});
