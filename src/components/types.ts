import type {
  TwitchEventSubChannelChatMessageNotificationMessage,
  TwitchEventSubChannelChatMessageRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChatMessage';
import type {
  TwitchEventSubChannelChatNotificationNotificationMessage,
  TwitchEventSubChannelChatNotificationRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChatNotification';
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
} from '@store/apis/twitch/createEventSubSubscription/channelChatSettingsUpdate';
import {
  TwitchEventSubChannelChatClearNotificationMessage,
  TwitchEventSubChannelChatClearRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChatClear';
import {
  TwitchEventSubChannelChatClearUserMessagesNotificationMessage,
  TwitchEventSubChannelChatClearUserMessagesRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChatClearUserMessages';
import {
  TwitchEventSubChannelChatMessageDeleteNotificationMessage,
  TwitchEventSubChannelChatMessageDeleteRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChatMessageDelete';
import {
  TwitchEventSubChannelGuestStarSessionBeginNotificationMessage,
  TwitchEventSubChannelGuestStarSessionBeginRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelGuestStarSessionBegin';
import {
  TwitchEventSubChannelGuestStarSessionEndNotificationMessage,
  TwitchEventSubChannelGuestStarSessionEndRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelGuestStarSessionEnd';
import {
  TwitchEventSubChannelGuestStarGuestUpdateNotificationMessage,
  TwitchEventSubChannelGuestStarGuestUpdateRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelGuestStarGuestUpdate';
import {
  TwitchEventSubStreamOnlineNotificationMessage,
  TwitchEventSubStreamOnlineRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/streamOnline';
import {
  TwitchEventSubStreamOfflineNotificationMessage,
  TwitchEventSubStreamOfflineRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/streamOffline';

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
  | TwitchEventSubChannelChatSettingsUpdateRevocationMessage
  | TwitchEventSubChannelGuestStarSessionBeginNotificationMessage
  | TwitchEventSubChannelGuestStarSessionBeginRevocationMessage
  | TwitchEventSubChannelGuestStarSessionEndNotificationMessage
  | TwitchEventSubChannelGuestStarSessionEndRevocationMessage
  | TwitchEventSubChannelGuestStarGuestUpdateNotificationMessage
  | TwitchEventSubChannelGuestStarGuestUpdateRevocationMessage
  | TwitchEventSubStreamOfflineNotificationMessage
  | TwitchEventSubStreamOfflineRevocationMessage
  | TwitchEventSubStreamOnlineNotificationMessage
  | TwitchEventSubStreamOnlineRevocationMessage;

export type TwitchPubSubMessage =
  | TwitchPubSubPongMessage
  | TwitchPubSubReconnectMessage
  | TwitchPubSubAuthRevokedMessage
  | TwitchPubSubResponseMessage
  | TwitchPubSubMessageMessage;
