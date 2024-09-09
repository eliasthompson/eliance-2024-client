import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

const type = 'stream.offline';
const version = '1';
const getCondition = (broadcasterId: string) => ({
  broadcaster_user_id: broadcasterId,
});

export interface TwitchApiCreateEventSubSubscriptionStreamOfflineRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubStreamOfflineNotificationMessageEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
};
export type TwitchEventSubStreamOfflineNotificationMessageSubscriptionType = typeof type;
export type TwitchEventSubStreamOfflineNotificationMessageSubscriptionVersion = typeof version;
export type TwitchEventSubStreamOfflineNotificationMessageSubscriptionCondition = ReturnType<typeof getCondition>;
export type TwitchEventSubStreamOfflineNotificationMessage = TwitchEventSubNotificationMessage<
  TwitchEventSubStreamOfflineNotificationMessageSubscriptionType,
  TwitchEventSubStreamOfflineNotificationMessageSubscriptionVersion,
  TwitchEventSubStreamOfflineNotificationMessageSubscriptionCondition,
  TwitchEventSubStreamOfflineNotificationMessageEvent
>;
export type TwitchEventSubStreamOfflineRevocationMessage = TwitchEventSubRevocationMessage<
  TwitchEventSubStreamOfflineNotificationMessageSubscriptionType,
  TwitchEventSubStreamOfflineNotificationMessageSubscriptionVersion,
  TwitchEventSubStreamOfflineNotificationMessageSubscriptionCondition
>;

export const { useCreateEventSubSubscriptionStreamOfflineQuery } = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionStreamOffline: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionStreamOfflineRequest
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
