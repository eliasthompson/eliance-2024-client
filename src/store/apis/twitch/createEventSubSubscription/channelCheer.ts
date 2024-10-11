import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

const type = 'channel.cheer';
const version = '1';
const getCondition = (broadcasterId: string) => ({
  broadcaster_user_id: broadcasterId,
});

export interface TwitchApiCreateEventSubSubscriptionChannelCheerRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelCheerNotificationMessageEvent = {
  is_anonymous: boolean;
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  message: string;
  bits: number;
};
export type TwitchEventSubChannelCheerNotificationMessageSubscriptionType = typeof type;
export type TwitchEventSubChannelCheerNotificationMessageSubscriptionVersion = typeof version;
export type TwitchEventSubChannelCheerNotificationMessageSubscriptionCondition = ReturnType<typeof getCondition>;
export type TwitchEventSubChannelCheerNotificationMessage = TwitchEventSubNotificationMessage<
  TwitchEventSubChannelCheerNotificationMessageSubscriptionType,
  TwitchEventSubChannelCheerNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelCheerNotificationMessageSubscriptionCondition,
  TwitchEventSubChannelCheerNotificationMessageEvent
>;
export type TwitchEventSubChannelCheerRevocationMessage = TwitchEventSubRevocationMessage<
  TwitchEventSubChannelCheerNotificationMessageSubscriptionType,
  TwitchEventSubChannelCheerNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelCheerNotificationMessageSubscriptionCondition
>;

export const { useCreateEventSubSubscriptionChannelCheerQuery, useLazyCreateEventSubSubscriptionChannelCheerQuery } =
  twitchApi.injectEndpoints({
    endpoints: (build) => ({
      createEventSubSubscriptionChannelCheer: build.query<
        TwitchApiCreateEventSubSubscriptionResponse,
        TwitchApiCreateEventSubSubscriptionChannelCheerRequest
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
