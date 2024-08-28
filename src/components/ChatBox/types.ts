import type { TwitchEventSubChannelChatMessageNotificationMessage } from '@store/apis/twitch/createEventSubSubscriptionChannelChatMessage';
import type { TwitchEventSubChannelChatNotificationNotificationMessage } from '@store/apis/twitch/createEventSubSubscriptionChannelChatNotification';
import type { TwitchEventSubMessage } from '@components/Container/types'
import type { TwitchEventSubRevocationMessage } from '@store/apis/twitch';

export type TwitchEventSubChatBoxMessage =
  TwitchEventSubMessage
  | TwitchEventSubChannelChatMessageNotificationMessage
  | TwitchEventSubRevocationMessage<TwitchEventSubChannelChatMessageNotificationMessage['metadata'], TwitchEventSubChannelChatMessageNotificationMessage['payload'], TwitchEventSubChannelChatMessageNotificationMessage['payload']['subscription']>
  | TwitchEventSubChannelChatNotificationNotificationMessage
  | TwitchEventSubRevocationMessage<TwitchEventSubChannelChatNotificationNotificationMessage['metadata'], TwitchEventSubChannelChatNotificationNotificationMessage['payload'], TwitchEventSubChannelChatNotificationNotificationMessage['payload']['subscription']>;
