import type {
  TwitchEventSubChannelChatMessageNotificationMessage,
  TwitchEventSubChannelChatMessageRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscriptionChannelChatMessage';
import type {
  TwitchEventSubChannelChatNotificationNotificationMessage,
  TwitchEventSubChannelChatNotificationRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscriptionChannelChatNotification';
import type {
  TwitchEventSubKeepaliveMessage,
  TwitchEventSubReconnectMessage,
  TwitchEventSubWelcomeMessage,
  TwitchPubSubAuthRevokedMessage,
  TwitchPubSubMessageMessage,
  TwitchPubSubPongMessage,
  TwitchPubSubReconnectMessage,
  TwitchPubSubResponseMessage,
} from '@store/apis/twitch';
import {
  TwitchEventSubChannelChatSettingsUpdateNotificationMessage,
  TwitchEventSubChannelChatSettingsUpdateRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscriptionChannelChatSettingsUpdate';
import {
  TwitchEventSubChannelChatClearNotificationMessage,
  TwitchEventSubChannelChatClearRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscriptionChannelChatClear';
import {
  TwitchEventSubChannelChatClearUserMessagesNotificationMessage,
  TwitchEventSubChannelChatClearUserMessagesRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscriptionChannelChatClearUserMessages';
import {
  TwitchEventSubChannelChatMessageDeleteNotificationMessage,
  TwitchEventSubChannelChatMessageDeleteRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscriptionChannelChatMessageDelete';

export type TwitchEventSubMessage =
  | TwitchEventSubWelcomeMessage
  | TwitchEventSubKeepaliveMessage
  | TwitchEventSubReconnectMessage
  | TwitchEventSubChannelChatClearNotificationMessage
  | TwitchEventSubChannelChatClearRevocationMessage
  | TwitchEventSubChannelChatClearUserMessagesNotificationMessage
  | TwitchEventSubChannelChatClearUserMessagesRevocationMessage
  | TwitchEventSubChannelChatMessageNotificationMessage
  | TwitchEventSubChannelChatMessageRevocationMessage
  | TwitchEventSubChannelChatMessageDeleteNotificationMessage
  | TwitchEventSubChannelChatMessageDeleteRevocationMessage
  | TwitchEventSubChannelChatNotificationNotificationMessage
  | TwitchEventSubChannelChatNotificationRevocationMessage
  | TwitchEventSubChannelChatSettingsUpdateNotificationMessage
  | TwitchEventSubChannelChatSettingsUpdateRevocationMessage;

export type TwitchPubSubMessage =
  | TwitchPubSubPongMessage
  | TwitchPubSubReconnectMessage
  | TwitchPubSubAuthRevokedMessage
  | TwitchPubSubResponseMessage
  | TwitchPubSubMessageMessage;
