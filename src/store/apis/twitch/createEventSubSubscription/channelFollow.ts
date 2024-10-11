import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

const type = 'channel.follow';
const version = '2';
const getCondition = (broadcasterId: string) => ({
  broadcaster_user_id: broadcasterId,
  moderator_user_id: broadcasterId,
});

export interface TwitchApiCreateEventSubSubscriptionChannelFollowRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelFollowNotificationMessageEvent = {
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  followed_at: string;
};
export type TwitchEventSubChannelFollowNotificationMessageSubscriptionType = typeof type;
export type TwitchEventSubChannelFollowNotificationMessageSubscriptionVersion = typeof version;
export type TwitchEventSubChannelFollowNotificationMessageSubscriptionCondition = ReturnType<typeof getCondition>;
export type TwitchEventSubChannelFollowNotificationMessage = TwitchEventSubNotificationMessage<
  TwitchEventSubChannelFollowNotificationMessageSubscriptionType,
  TwitchEventSubChannelFollowNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelFollowNotificationMessageSubscriptionCondition,
  TwitchEventSubChannelFollowNotificationMessageEvent
>;
export type TwitchEventSubChannelFollowRevocationMessage = TwitchEventSubRevocationMessage<
  TwitchEventSubChannelFollowNotificationMessageSubscriptionType,
  TwitchEventSubChannelFollowNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelFollowNotificationMessageSubscriptionCondition
>;

export const { useCreateEventSubSubscriptionChannelFollowQuery, useLazyCreateEventSubSubscriptionChannelFollowQuery } =
  twitchApi.injectEndpoints({
    endpoints: (build) => ({
      createEventSubSubscriptionChannelFollow: build.query<
        TwitchApiCreateEventSubSubscriptionResponse,
        TwitchApiCreateEventSubSubscriptionChannelFollowRequest
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
