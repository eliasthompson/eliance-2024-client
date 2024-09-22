import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

const type = 'stream.online';
const version = '1';
const getCondition = (broadcasterId: string) => ({
  broadcaster_user_id: broadcasterId,
});

export interface TwitchApiCreateEventSubSubscriptionStreamOnlineRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubStreamOnlineNotificationMessageEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  type: 'live' | 'playlist' | 'watch_party' | 'premiere' | 'rerun';
  started_at: string;
};
export type TwitchEventSubStreamOnlineNotificationMessageSubscriptionType = typeof type;
export type TwitchEventSubStreamOnlineNotificationMessageSubscriptionVersion = typeof version;
export type TwitchEventSubStreamOnlineNotificationMessageSubscriptionCondition = ReturnType<typeof getCondition>;
export type TwitchEventSubStreamOnlineNotificationMessage = TwitchEventSubNotificationMessage<
  TwitchEventSubStreamOnlineNotificationMessageSubscriptionType,
  TwitchEventSubStreamOnlineNotificationMessageSubscriptionVersion,
  TwitchEventSubStreamOnlineNotificationMessageSubscriptionCondition,
  TwitchEventSubStreamOnlineNotificationMessageEvent
>;
export type TwitchEventSubStreamOnlineRevocationMessage = TwitchEventSubRevocationMessage<
  TwitchEventSubStreamOnlineNotificationMessageSubscriptionType,
  TwitchEventSubStreamOnlineNotificationMessageSubscriptionVersion,
  TwitchEventSubStreamOnlineNotificationMessageSubscriptionCondition
>;

export const { useCreateEventSubSubscriptionStreamOnlineQuery, useLazyCreateEventSubSubscriptionStreamOnlineQuery } =
  twitchApi.injectEndpoints({
    endpoints: (build) => ({
      createEventSubSubscriptionStreamOnline: build.query<
        TwitchApiCreateEventSubSubscriptionResponse,
        TwitchApiCreateEventSubSubscriptionStreamOnlineRequest
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
