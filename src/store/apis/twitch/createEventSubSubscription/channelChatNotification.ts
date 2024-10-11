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
export type TwitchEventSubChannelChatNotificationBadge = {
  set_id: string;
  id: string;
  info: string;
};
export type TwitchEventSubChannelChatNotificationSub = {
  sub_tier: '1000' | '2000' | '3000';
  is_prime: boolean;
  duration_months: number;
};
export type TwitchEventSubChannelChatNotificationResub = {
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
};
export type TwitchEventSubChannelChatNotificationSubGift = {
  duration_months: number;
  cumulative_total: number | null;
  recipient_user_id: string;
  recipient_user_name: string;
  recipient_user_login: string;
  sub_tier: '1000' | '2000' | '3000';
  community_gift_id: string | null;
};
export type TwitchEventSubChannelChatNotificationCommunitySubGift = {
  id: string;
  total: number;
  sub_tier: '1000' | '2000' | '3000';
  cumulative_total: number | null;
};
export type TwitchEventSubChannelChatNotificationGiftPaidUpgrade = {
  gifter_is_anonymous: boolean;
  gifter_user_id: string | null;
  gifter_user_name: string | null;
  gifter_user_login: string | null;
};
export type TwitchEventSubChannelChatNotificationPrimePaidUpgrade = {
  sub_tier: '1000' | '2000' | '3000';
};
export type TwitchEventSubChannelChatNotificationRaid = {
  user_id: string;
  user_name: string;
  user_login: string;
  viewer_count: number;
  profile_image_url: string;
};
export type TwitchEventSubChannelChatNotificationPayItForward = {
  gifter_is_anonymous: boolean;
  gifter_user_id: string | null;
  gifter_user_name: string | null;
  gifter_user_login: string | null;
};
export type TwitchEventSubChannelChatNotificationAnnouncement = {
  color: string;
};
export type TwitchEventSubChannelChatNotificationNotificationMessageEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  chatter_user_id: string | null;
  chatter_user_login: string | null;
  chatter_user_name: string | null;
  chatter_is_anonymous: boolean;
  color: string;
  badges: TwitchEventSubChannelChatNotificationBadge[];
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
    | 'charity_donation'
    | 'shared_chat_sub'
    | 'shared_chat_resub'
    | 'shared_chat_sub_gift'
    | 'shared_chat_community_sub_gift'
    | 'shared_chat_gift_paid_upgrade'
    | 'shared_chat_prime_paid_upgrade'
    | 'shared_chat_raid'
    | 'shared_chat_pay_it_forward'
    | 'shared_chat_announcement';
  sub: TwitchEventSubChannelChatNotificationSub | null;
  resub: TwitchEventSubChannelChatNotificationResub | null;
  sub_gift: TwitchEventSubChannelChatNotificationSubGift | null;
  community_sub_gift: TwitchEventSubChannelChatNotificationCommunitySubGift | null;
  gift_paid_upgrade: TwitchEventSubChannelChatNotificationGiftPaidUpgrade | null;
  prime_paid_upgrade: TwitchEventSubChannelChatNotificationPrimePaidUpgrade | null;
  raid: TwitchEventSubChannelChatNotificationRaid | null;
  unraid: object | null;
  pay_it_forward: TwitchEventSubChannelChatNotificationPayItForward | null;
  announcement: TwitchEventSubChannelChatNotificationAnnouncement | null;
  bits_badge_tier: {
    tier: number;
  } | null;
  charity_donation: {
    charity_name: string;
    amount: {
      value: number;
      decimal_place: number;
      currency: string;
    };
  } | null;
  source_broadcaster_user_id: string | null;
  source_broadcaster_user_name: string | null;
  source_broadcaster_user_login: string | null;
  source_message_id: string | null;
  source_badges: TwitchEventSubChannelChatNotificationBadge[] | null;
  shared_chat_sub: TwitchEventSubChannelChatNotificationSub | null;
  shared_chat_resub: TwitchEventSubChannelChatNotificationResub | null;
  shared_chat_sub_gift: TwitchEventSubChannelChatNotificationSubGift | null;
  shared_chat_community_sub_gift: TwitchEventSubChannelChatNotificationCommunitySubGift | null;
  shared_chat_gift_paid_upgrade: TwitchEventSubChannelChatNotificationGiftPaidUpgrade | null;
  shared_chat_prime_paid_upgrade: TwitchEventSubChannelChatNotificationPrimePaidUpgrade | null;
  shared_chat_raid: TwitchEventSubChannelChatNotificationRaid | null;
  shared_chat_pay_it_forward: TwitchEventSubChannelChatNotificationPayItForward | null;
  shared_chat_announcement: TwitchEventSubChannelChatNotificationAnnouncement | null;
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
