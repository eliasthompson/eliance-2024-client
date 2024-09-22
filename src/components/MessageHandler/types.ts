import type { TwitchPubSubBaseMessage } from '@store/apis/twitch';

export type TwitchPubSubPinMessagePinnedChatUpdatesMessageMessage = TwitchPubSubBaseMessage<
  'pin-message',
  {
    id: string;
    pinned_by: {
      id: string;
      display_name: string;
    };
    message: {
      id: string;
      sender: {
        id: string;
        display_name: string;
        badges: {
          id: string;
          version: string;
        }[];
        chat_color: string;
      };
      content: {
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
      type: string;
      starts_at: number;
      updated_at: number;
      ends_at: number;
      sent_at: number;
    };
  }
>;
export type TwitchPubSubUpdateMessagePinnedChatUpdatesMessageMessage = TwitchPubSubBaseMessage<
  'update-message',
  {
    id: string;
    updated_at: number;
    ends_at?: number;
  }
>;
export type TwitchPubSubUnpinMessagePinnedChatUpdatesMessageMessage = TwitchPubSubBaseMessage<
  'unpin-message',
  {
    id: string;
    unpinned_by: {
      id: string;
      display_name: string;
    };
    reason: string;
  }
>;
export type TwitchPubSubPinnedChatUpdatesMessageMessage =
  | TwitchPubSubPinMessagePinnedChatUpdatesMessageMessage
  | TwitchPubSubUpdateMessagePinnedChatUpdatesMessageMessage
  | TwitchPubSubUnpinMessagePinnedChatUpdatesMessageMessage;
