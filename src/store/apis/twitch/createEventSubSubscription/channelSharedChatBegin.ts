import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

const type = 'channel.shared_chat.begin';
const version = '1';
const getCondition = (broadcasterId: string) => ({
  broadcaster_user_id: broadcasterId,
});

export interface TwitchApiCreateEventSubSubscriptionChannelSharedChatBeginRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelSharedChatBeginNotificationMessageEvent = {
  session_id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  host_broadcaster_user_id: string;
  host_broadcaster_user_login: string;
  host_broadcaster_user_name: string;
  participants: {
    broadcaster_user_id: string;
    broadcaster_user_name: string;
    broadcaster_user_login: string;
  }[];
};
export type TwitchEventSubChannelSharedChatBeginNotificationMessageSubscriptionType = typeof type;
export type TwitchEventSubChannelSharedChatBeginNotificationMessageSubscriptionVersion = typeof version;
export type TwitchEventSubChannelSharedChatBeginNotificationMessageSubscriptionCondition = ReturnType<
  typeof getCondition
>;
export type TwitchEventSubChannelSharedChatBeginNotificationMessage = TwitchEventSubNotificationMessage<
  TwitchEventSubChannelSharedChatBeginNotificationMessageSubscriptionType,
  TwitchEventSubChannelSharedChatBeginNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelSharedChatBeginNotificationMessageSubscriptionCondition,
  TwitchEventSubChannelSharedChatBeginNotificationMessageEvent
>;
export type TwitchEventSubChannelSharedChatBeginRevocationMessage = TwitchEventSubRevocationMessage<
  TwitchEventSubChannelSharedChatBeginNotificationMessageSubscriptionType,
  TwitchEventSubChannelSharedChatBeginNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelSharedChatBeginNotificationMessageSubscriptionCondition
>;

export const {
  useCreateEventSubSubscriptionChannelSharedChatBeginQuery,
  useLazyCreateEventSubSubscriptionChannelSharedChatBeginQuery,
} = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelSharedChatBegin: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionChannelSharedChatBeginRequest
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
