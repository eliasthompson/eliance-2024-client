import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

const type = 'channel.shared_chat.end';
const version = '1';
const getCondition = (broadcasterId: string) => ({
  broadcaster_user_id: broadcasterId,
});

export interface TwitchApiCreateEventSubSubscriptionChannelSharedChatEndRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelSharedChatEndNotificationMessageEvent = {
  session_id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  host_broadcaster_user_id: string;
  host_broadcaster_user_login: string;
  host_broadcaster_user_name: string;
};
export type TwitchEventSubChannelSharedChatEndNotificationMessageSubscriptionType = typeof type;
export type TwitchEventSubChannelSharedChatEndNotificationMessageSubscriptionVersion = typeof version;
export type TwitchEventSubChannelSharedChatEndNotificationMessageSubscriptionCondition = ReturnType<
  typeof getCondition
>;
export type TwitchEventSubChannelSharedChatEndNotificationMessage = TwitchEventSubNotificationMessage<
  TwitchEventSubChannelSharedChatEndNotificationMessageSubscriptionType,
  TwitchEventSubChannelSharedChatEndNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelSharedChatEndNotificationMessageSubscriptionCondition,
  TwitchEventSubChannelSharedChatEndNotificationMessageEvent
>;
export type TwitchEventSubChannelSharedChatEndRevocationMessage = TwitchEventSubRevocationMessage<
  TwitchEventSubChannelSharedChatEndNotificationMessageSubscriptionType,
  TwitchEventSubChannelSharedChatEndNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelSharedChatEndNotificationMessageSubscriptionCondition
>;

export const {
  useCreateEventSubSubscriptionChannelSharedChatEndQuery,
  useLazyCreateEventSubSubscriptionChannelSharedChatEndQuery,
} = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelSharedChatEnd: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionChannelSharedChatEndRequest
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
