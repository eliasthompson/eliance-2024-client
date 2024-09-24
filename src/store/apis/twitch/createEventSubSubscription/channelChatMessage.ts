import type {
  TwitchApiCreateEventSubSubscriptionResponse,
  TwitchEventSubNotificationMessage,
  TwitchEventSubRevocationMessage,
} from '@store/apis/twitch';

import { twitchApi } from '@store/apis/twitch';

const type = 'channel.chat.message';
const version = '1';
const getCondition = (broadcasterId: string) => ({
  broadcaster_user_id: broadcasterId,
  user_id: broadcasterId,
});

export interface TwitchApiCreateEventSubSubscriptionChannelChatMessageRequest {
  broadcasterId: string;
  sessionId: string;
}
export type TwitchEventSubChannelChatMessageBadge = {
  set_id: string;
  id: string;
  info: string;
};
export type TwitchEventSubChannelChatMessageNotificationMessageEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  chatter_user_id: string;
  chatter_user_login: string;
  chatter_user_name: string;
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
  message_type:
    | 'text'
    | 'channel_points_highlighted'
    | 'channel_points_sub_only'
    | 'user_intro'
    | 'power_ups_message_effect'
    | 'power_ups_gigantified_emote';
  badges: TwitchEventSubChannelChatMessageBadge[];
  cheer: {
    bits: number;
  } | null;
  color: string;
  reply: {
    parent_message_id: string;
    parent_message_body: string;
    parent_user_id: string;
    parent_user_name: string;
    parent_user_login: string;
    thread_message_id: string;
    thread_user_id: string;
    thread_user_name: string;
    thread_user_login: string;
  } | null;
  channel_points_custom_reward_id: string | null;
  channel_points_animation_id: string | null;
  source_broadcaster_user_id: string | null;
  source_broadcaster_user_name: string | null;
  source_broadcaster_user_login: string | null;
  source_message_id: string | null;
  source_badges: TwitchEventSubChannelChatMessageBadge[] | null;
};
export type TwitchEventSubChannelChatMessageNotificationMessageSubscriptionType = typeof type;
export type TwitchEventSubChannelChatMessageNotificationMessageSubscriptionVersion = typeof version;
export type TwitchEventSubChannelChatMessageNotificationMessageSubscriptionCondition = ReturnType<typeof getCondition>;
export type TwitchEventSubChannelChatMessageNotificationMessage = TwitchEventSubNotificationMessage<
  TwitchEventSubChannelChatMessageNotificationMessageSubscriptionType,
  TwitchEventSubChannelChatMessageNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelChatMessageNotificationMessageSubscriptionCondition,
  TwitchEventSubChannelChatMessageNotificationMessageEvent
>;
export type TwitchEventSubChannelChatMessageRevocationMessage = TwitchEventSubRevocationMessage<
  TwitchEventSubChannelChatMessageNotificationMessageSubscriptionType,
  TwitchEventSubChannelChatMessageNotificationMessageSubscriptionVersion,
  TwitchEventSubChannelChatMessageNotificationMessageSubscriptionCondition
>;

export const {
  useCreateEventSubSubscriptionChannelChatMessageQuery,
  useLazyCreateEventSubSubscriptionChannelChatMessageQuery,
} = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscriptionChannelChatMessage: build.query<
      TwitchApiCreateEventSubSubscriptionResponse,
      TwitchApiCreateEventSubSubscriptionChannelChatMessageRequest
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
