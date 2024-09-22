import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

const type = 'channel.chat.notification';
const version = '1';
const getCondition = (broadcasterId: string) => ({
  broadcaster_user_id: broadcasterId,
  user_id: broadcasterId,
});

export interface TwitchApiCreateEventSubSubscriptionChannelChatNotificationRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelChatNotificationNotificationMessageEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  chatter_user_id: string;
  chatter_user_login: string;
  chatter_user_name: string;
  chatter_is_anonymous: boolean;
  color: string;
  badges: {
    set_id: string;
    id: string;
    info: string;
  }[];
  system_message: string;
  message_id: string;
  message: {
    text: string;
    fragments: {
      type: 'text' | 'cheermote' | 'emote' | 'mention';
      text: string;
      cheermote: {
        prefix: string;
        bits: number;
        tier: number;
      } | null;
      emote: {
        id: string;
        emote_set_id: string;
        owner_id: string;
        format: ('static' | 'animated')[];
      } | null;
      mention: {
        user_id: string;
        user_name: string;
        user_login: string;
      } | null;
    }[];
  };
  notice_type:
    | 'sub'
    | 'resub'
    | 'sub_gift'
    | 'community_sub_gift'
    | 'gift_paid_upgrade'
    | 'prime_paid_upgrade'
    | 'raid'
    | 'unraid'
    | 'pay_it_forward'
    | 'announcement'
    | 'bits_badge_tier'
    | 'charity_donation';
  sub: {
    sub_tier: '1000' | '2000' | '3000';
    is_prime: boolean;
    duration_months: number;
  } | null;
  resub: {
    cumulative_months: number;
    duration_months: number;
    streak_months: number;
    sub_tier: '1000' | '2000' | '3000';
    is_prime: boolean | null;
    is_gift: boolean;
    gifter_is_anonymous: boolean | null;
    gifter_user_id: string | null;
    gifter_user_name: string | null;
    gifter_user_login: string | null;
  } | null;
  sub_gift: {
    duration_months: number;
    cumulative_total: number | null;
    recipient_user_id: string;
    recipient_user_name: string;
    recipient_user_login: string;
    sub_tier: '1000' | '2000' | '3000';
    community_gift_id: string | null;
  } | null;
  community_sub_gift: {
    id: string;
    total: number;
    sub_tier: '1000' | '2000' | '3000';
    cumulative_total: number | null;
  } | null;
  gift_paid_upgrade: {
    gifter_is_anonymous: boolean;
    gifter_user_id: string | null;
    gifter_user_name: string | null;
    gifter_user_login: string | null;
  } | null;
  prime_paid_upgrade: {
    sub_tier: '1000' | '2000' | '3000';
  } | null;
  raid: {
    user_id: string;
    user_name: string;
    user_login: string;
    viewer_count: number;
    profile_image_url: string;
  } | null;
  unraid: object | null;
  pay_it_forward: {
    gifter_is_anonymous: boolean;
    gifter_user_id: string | null;
    gifter_user_name: string | null;
    gifter_user_login: string | null;
  } | null;
  announcement: {
    color: string;
  } | null;
  charity_donation: {
    charity_name: string;
    amount: {
      value: number;
      decimal_place: number;
      currency: string;
    };
  } | null;
  bits_badge_tier: {
    tier: number;
  } | null;
};
export type TwitchEventSubChannelChatNotificationNotificationMessageSubscriptionType = typeof type;
export type TwitchEventSubChannelChatNotificationNotificationMessageSubscriptionVersion = typeof version;
export type TwitchEventSubChannelChatNotificationNotificationMessageSubscriptionCondition = ReturnType<
  typeof getCondition
>;
export type TwitchEventSubChannelChatNotificationNotificationMessage = TwitchEventSubNotificationMessage<
  TwitchEventSubChannelChatNotificationNotificationMessageSubscriptionType,
  TwitchEventSubChannelChatNotificationNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelChatNotificationNotificationMessageSubscriptionCondition,
  TwitchEventSubChannelChatNotificationNotificationMessageEvent
>;
export type TwitchEventSubChannelChatNotificationRevocationMessage = TwitchEventSubRevocationMessage<
  TwitchEventSubChannelChatNotificationNotificationMessageSubscriptionType,
  TwitchEventSubChannelChatNotificationNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelChatNotificationNotificationMessageSubscriptionCondition
>;

export const {
  useCreateEventSubSubscriptionChannelChatNotificationQuery,
  useLazyCreateEventSubSubscriptionChannelChatNotificationQuery,
} = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelChatNotification: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionChannelChatNotificationRequest
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
