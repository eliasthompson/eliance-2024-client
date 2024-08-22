import type { ReactNode } from 'react';

import type { TwitchEventSubMessage, TwitchEventSubNotificationMessage } from '@src/types'

export interface TwitchEventSubChannelChatMessageNotificationMessage extends TwitchEventSubNotificationMessage {
  metadata: TwitchEventSubNotificationMessage['metadata'] & {
    subscription_type: 'channel.chat.message',
    subscription_version: '1',
  },
  payload: TwitchEventSubNotificationMessage['payload'] & {
    subscription: TwitchEventSubNotificationMessage['payload']['subscription'] & {
      type: 'channel.chat.message',
      version: '1',
      condition: {
        broadcaster_user_id: string,
        user_id: string,
      },
    },
    event: {
      broadcaster_user_id: string,
      broadcaster_user_login: string,
      broadcaster_user_name: string,
      chatter_user_id: string,
      chatter_user_login: string,
      chatter_user_name: string,
      message_id: string,
      message: {
        text: string,
        fragments: {
          type: 'text' | 'cheermote' | 'emote' | 'mention',
          text: string,
          cheermote: {
            prefix: string,
            bits: number,
            tier: number,
          } | null,
          emote: {
            id: string,
            emote_set_id: string,
            owner_id: string,
            format: ('static' | 'animated')[],
          } | null,
          mention: {
            user_id: string,
            user_name: string,
            user_login: string,
          } | null
        }[],
      },
      message_type: 'text' | 'channel_points_highlighted' | 'channel_points_sub_only' | 'user_intro' | 'power_ups_message_effect' | 'power_ups_gigantified_emote',
      badges: {
        set_id: string,
        id: string,
        info: string
      }[],
      cheer: {
        bits: number,
      } | null,
      color: string,
      reply: {
        parent_message_id: string,
        parent_message_body: string,
        parent_user_id: string,
        parent_user_name: string,
        parent_user_login: string,
        thread_message_id: string,
        thread_user_id: string,
        thread_user_name: string,
        thread_user_login: string,
      } | null,
      channel_points_custom_reward_id: string | null,
      channel_points_animation_id: string | null
    }
  },
};

export interface TwitchEventSubChannelChatMessageRevocationMessage extends TwitchEventSubChannelChatMessageNotificationMessage {
  metadata: TwitchEventSubChannelChatMessageNotificationMessage['metadata'] & {
    message_type: 'revocation',
  },
  payload: TwitchEventSubChannelChatMessageNotificationMessage['payload'] & {
    subscription: TwitchEventSubChannelChatMessageNotificationMessage['payload']['subscription'] & {
      status: 'authorization_revoked' | 'user_removed' | 'version_removed',
    },
    event: undefined,
  },
};

export type TwitchEventSubChatBoxMessage = TwitchEventSubMessage | TwitchEventSubChannelChatMessageNotificationMessage | TwitchEventSubChannelChatMessageRevocationMessage;
export type ChatBoxChat = TwitchEventSubChannelChatMessageNotificationMessage['payload']['event'] & { messageJsx: ReactNode | ReactNode[] };
