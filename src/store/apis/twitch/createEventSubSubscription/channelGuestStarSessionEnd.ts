import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

const type = 'channel.guest_star_session.end';
const version = 'beta';
const getCondition = (broadcasterId: string) => ({
  broadcaster_user_id: broadcasterId,
  moderator_user_id: broadcasterId,
});

export interface TwitchApiCreateEventSubSubscriptionChannelGuestStarSessionEndRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelGuestStarSessionEndNotificationMessageEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  session_id: string;
  started_at: string;
  ended_at: string;
  host_user_id: string;
  host_user_name: string;
  host_user_login: string;
};
export type TwitchEventSubChannelGuestStarSessionEndNotificationMessageSubscriptionType = typeof type;
export type TwitchEventSubChannelGuestStarSessionEndNotificationMessageSubscriptionVersion = typeof version;
export type TwitchEventSubChannelGuestStarSessionEndNotificationMessageSubscriptionCondition = ReturnType<
  typeof getCondition
>;
export type TwitchEventSubChannelGuestStarSessionEndNotificationMessage = TwitchEventSubNotificationMessage<
  TwitchEventSubChannelGuestStarSessionEndNotificationMessageSubscriptionType,
  TwitchEventSubChannelGuestStarSessionEndNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelGuestStarSessionEndNotificationMessageSubscriptionCondition,
  TwitchEventSubChannelGuestStarSessionEndNotificationMessageEvent
>;
export type TwitchEventSubChannelGuestStarSessionEndRevocationMessage = TwitchEventSubRevocationMessage<
  TwitchEventSubChannelGuestStarSessionEndNotificationMessageSubscriptionType,
  TwitchEventSubChannelGuestStarSessionEndNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelGuestStarSessionEndNotificationMessageSubscriptionCondition
>;

export const { useCreateEventSubSubscriptionChannelGuestStarSessionEndQuery } = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelGuestStarSessionEnd: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionChannelGuestStarSessionEndRequest
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
