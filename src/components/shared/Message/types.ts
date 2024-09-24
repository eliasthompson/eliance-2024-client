import type { TwitchEventSubChannelChatNotificationNotificationMessageEvent } from '@store/apis/twitch/createEventSubSubscription/channelChatNotification';

export interface MessageProps {
  message: TwitchEventSubChannelChatNotificationNotificationMessageEvent['message'];
  isAction?: boolean;
  isDeleted?: boolean;
  isGigantifiedEmote?: boolean;
  isHighlightMessage?: boolean;
}
