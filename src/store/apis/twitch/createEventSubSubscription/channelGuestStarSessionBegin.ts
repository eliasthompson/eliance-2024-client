import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

const type = 'channel.guest_star_session.begin';
const version = 'beta';
const getCondition = (broadcasterId: string) => ({
  broadcaster_user_id: broadcasterId,
  moderator_user_id: broadcasterId,
});

export interface TwitchApiCreateEventSubSubscriptionChannelGuestStarSessionBeginRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelGuestStarSessionBeginNotificationMessageEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  session_id: string;
  started_at: string;
};
export type TwitchEventSubChannelGuestStarSessionBeginNotificationMessageSubscriptionType = typeof type;
export type TwitchEventSubChannelGuestStarSessionBeginNotificationMessageSubscriptionVersion = typeof version;
export type TwitchEventSubChannelGuestStarSessionBeginNotificationMessageSubscriptionCondition = ReturnType<
  typeof getCondition
>;
export type TwitchEventSubChannelGuestStarSessionBeginNotificationMessage = TwitchEventSubNotificationMessage<
  TwitchEventSubChannelGuestStarSessionBeginNotificationMessageSubscriptionType,
  TwitchEventSubChannelGuestStarSessionBeginNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelGuestStarSessionBeginNotificationMessageSubscriptionCondition,
  TwitchEventSubChannelGuestStarSessionBeginNotificationMessageEvent
>;
export type TwitchEventSubChannelGuestStarSessionBeginRevocationMessage = TwitchEventSubRevocationMessage<
  TwitchEventSubChannelGuestStarSessionBeginNotificationMessageSubscriptionType,
  TwitchEventSubChannelGuestStarSessionBeginNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelGuestStarSessionBeginNotificationMessageSubscriptionCondition
>;

export const { useCreateEventSubSubscriptionChannelGuestStarSessionBeginQuery } = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelGuestStarSessionBegin: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionChannelGuestStarSessionBeginRequest
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
