import type { TwitchEventSubChannelChatNotificationNotificationMessageEvent } from '@store/apis/twitch/createEventSubSubscription/channelChatNotification';

export interface MessageProps {
  message?: Partial<TwitchEventSubChannelChatNotificationNotificationMessageEvent['message']>;
  isAction?: boolean;
  isDeleted?: boolean;
  isGigantifiedEmote?: boolean;
  isHighlightMessage?: boolean;
}
