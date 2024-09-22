import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

const type = 'channel.guest_star_guest.update';
const version = 'beta';
const getCondition = (broadcasterId: string) => ({
  broadcaster_user_id: broadcasterId,
  moderator_user_id: broadcasterId,
});

export interface TwitchApiCreateEventSubSubscriptionChannelGuestStarGuestUpdateRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelGuestStarGuestUpdateNotificationMessageEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  session_id: string;
  moderator_user_id: string | null;
  moderator_user_name: string | null;
  moderator_user_login: string | null;
  guest_user_id: string | null;
  guest_user_name: string | null;
  guest_user_login: string | null;
  slot_id: string | null;
  state: 'invited' | 'accepted' | 'ready' | 'backstage' | 'live' | 'removed' | 'accepted' | null;
  host_user_id: string;
  host_user_name: string;
  host_user_login: string;
  host_video_enabled: boolean | null;
  host_audio_enabled: boolean | null;
  host_volume: number | null;
};
export type TwitchEventSubChannelGuestStarGuestUpdateNotificationMessageSubscriptionType = typeof type;
export type TwitchEventSubChannelGuestStarGuestUpdateNotificationMessageSubscriptionVersion = typeof version;
export type TwitchEventSubChannelGuestStarGuestUpdateNotificationMessageSubscriptionCondition = ReturnType<
  typeof getCondition
>;
export type TwitchEventSubChannelGuestStarGuestUpdateNotificationMessage = TwitchEventSubNotificationMessage<
  TwitchEventSubChannelGuestStarGuestUpdateNotificationMessageSubscriptionType,
  TwitchEventSubChannelGuestStarGuestUpdateNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelGuestStarGuestUpdateNotificationMessageSubscriptionCondition,
  TwitchEventSubChannelGuestStarGuestUpdateNotificationMessageEvent
>;
export type TwitchEventSubChannelGuestStarGuestUpdateRevocationMessage = TwitchEventSubRevocationMessage<
  TwitchEventSubChannelGuestStarGuestUpdateNotificationMessageSubscriptionType,
  TwitchEventSubChannelGuestStarGuestUpdateNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelGuestStarGuestUpdateNotificationMessageSubscriptionCondition
>;

export const {
  useCreateEventSubSubscriptionChannelGuestStarGuestUpdateQuery,
  useLazyCreateEventSubSubscriptionChannelGuestStarGuestUpdateQuery,
} = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelGuestStarGuestUpdate: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionChannelGuestStarGuestUpdateRequest
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
