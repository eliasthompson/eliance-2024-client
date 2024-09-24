import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

const type = 'channel.channel_points_custom_reward_redemption.add';
const version = '1';
const getCondition = (broadcasterId: string) => ({
  broadcaster_user_id: broadcasterId,
});

export interface TwitchApiCreateEventSubSubscriptionChannelChannelPointsCustomRewardRedemptionAddRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelChannelPointsCustomRewardRedemptionAddNotificationMessageEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  user_id: string;
  user_login: string;
  user_name: string;
  user_input: string;
  status: 'unknown' | 'unfulfilled' | 'fulfilled' | 'canceled';
  reward: {
    id: string;
    title: string;
    cost: number;
    prompt: string;
  };
  redeemed_at: string;
};
export type TwitchEventSubChannelChannelPointsCustomRewardRedemptionAddNotificationMessageSubscriptionType =
  typeof type;
export type TwitchEventSubChannelChannelPointsCustomRewardRedemptionAddNotificationMessageSubscriptionVersion =
  typeof version;
export type TwitchEventSubChannelChannelPointsCustomRewardRedemptionAddNotificationMessageSubscriptionCondition =
  ReturnType<typeof getCondition>;
export type TwitchEventSubChannelChannelPointsCustomRewardRedemptionAddNotificationMessage =
  TwitchEventSubNotificationMessage<
    TwitchEventSubChannelChannelPointsCustomRewardRedemptionAddNotificationMessageSubscriptionType,
    TwitchEventSubChannelChannelPointsCustomRewardRedemptionAddNotificationMessageSubscriptionVersion,
    TwitchEventSubChannelChannelPointsCustomRewardRedemptionAddNotificationMessageSubscriptionCondition,
    TwitchEventSubChannelChannelPointsCustomRewardRedemptionAddNotificationMessageEvent
  >;
export type TwitchEventSubChannelChannelPointsCustomRewardRedemptionAddRevocationMessage =
  TwitchEventSubRevocationMessage<
    TwitchEventSubChannelChannelPointsCustomRewardRedemptionAddNotificationMessageSubscriptionType,
    TwitchEventSubChannelChannelPointsCustomRewardRedemptionAddNotificationMessageSubscriptionVersion,
    TwitchEventSubChannelChannelPointsCustomRewardRedemptionAddNotificationMessageSubscriptionCondition
  >;

export const {
  useCreateEventSubSubscriptionChannelChannelPointsCustomRewardRedemptionAddQuery,
  useLazyCreateEventSubSubscriptionChannelChannelPointsCustomRewardRedemptionAddQuery,
} = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelChannelPointsCustomRewardRedemptionAdd: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionChannelChannelPointsCustomRewardRedemptionAddRequest
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
