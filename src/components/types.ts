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
  TwitchEventSubChannelChannelPointsCustomRewardRedemptionAddNotificationMessage,
  TwitchEventSubChannelChannelPointsCustomRewardRedemptionAddRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChannelPointsCustomRewardRedemptionAdd';
import type {
  TwitchEventSubChannelChatClearNotificationMessage,
  TwitchEventSubChannelChatClearRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChatClear';
import type {
  TwitchEventSubChannelChatClearUserMessagesNotificationMessage,
  TwitchEventSubChannelChatClearUserMessagesRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChatClearUserMessages';
import type {
  TwitchEventSubChannelChatMessageDeleteNotificationMessage,
  TwitchEventSubChannelChatMessageDeleteRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChatMessageDelete';
import type {
  TwitchEventSubChannelChatMessageNotificationMessage,
  TwitchEventSubChannelChatMessageRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChatMessage';
import type {
  TwitchEventSubChannelChatNotificationNotificationMessage,
  TwitchEventSubChannelChatNotificationRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChatNotification';
import type {
  TwitchEventSubChannelChatSettingsUpdateNotificationMessage,
  TwitchEventSubChannelChatSettingsUpdateRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChatSettingsUpdate';
import {
  TwitchEventSubChannelCheerNotificationMessage,
  TwitchEventSubChannelCheerRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelCheer';
import {
  TwitchEventSubChannelFollowNotificationMessage,
  TwitchEventSubChannelFollowRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelFollow';
import type {
  TwitchEventSubChannelGuestStarGuestUpdateNotificationMessage,
  TwitchEventSubChannelGuestStarGuestUpdateRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelGuestStarGuestUpdate';
import type {
  TwitchEventSubChannelGuestStarSessionBeginNotificationMessage,
  TwitchEventSubChannelGuestStarSessionBeginRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelGuestStarSessionBegin';
import type {
  TwitchEventSubChannelGuestStarSessionEndNotificationMessage,
  TwitchEventSubChannelGuestStarSessionEndRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelGuestStarSessionEnd';
import type {
  TwitchEventSubChannelSharedChatBeginNotificationMessage,
  TwitchEventSubChannelSharedChatBeginRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelSharedChatBegin';
import type {
  TwitchEventSubChannelSharedChatEndNotificationMessage,
  TwitchEventSubChannelSharedChatEndRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelSharedChatEnd';
import type {
  TwitchEventSubChannelSharedChatUpdateNotificationMessage,
  TwitchEventSubChannelSharedChatUpdateRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelSharedChatUpdate';
import type {
  TwitchEventSubStreamOfflineNotificationMessage,
  TwitchEventSubStreamOfflineRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/streamOffline';
import type {
  TwitchEventSubStreamOnlineNotificationMessage,
  TwitchEventSubStreamOnlineRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/streamOnline';

export type TwitchEventSubMessage =
  | TwitchEventSubWelcomeMessage
  | TwitchEventSubKeepaliveMessage
  | TwitchEventSubReconnectMessage
  | TwitchEventSubChannelChannelPointsCustomRewardRedemptionAddNotificationMessage
  | TwitchEventSubChannelChannelPointsCustomRewardRedemptionAddRevocationMessage
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
  | TwitchEventSubChannelCheerNotificationMessage
  | TwitchEventSubChannelCheerRevocationMessage
  | TwitchEventSubChannelFollowNotificationMessage
  | TwitchEventSubChannelFollowRevocationMessage
  | TwitchEventSubChannelGuestStarSessionBeginNotificationMessage
  | TwitchEventSubChannelGuestStarSessionBeginRevocationMessage
  | TwitchEventSubChannelGuestStarSessionEndNotificationMessage
  | TwitchEventSubChannelGuestStarSessionEndRevocationMessage
  | TwitchEventSubChannelGuestStarGuestUpdateNotificationMessage
  | TwitchEventSubChannelGuestStarGuestUpdateRevocationMessage
  | TwitchEventSubChannelSharedChatBeginNotificationMessage
  | TwitchEventSubChannelSharedChatBeginRevocationMessage
  | TwitchEventSubChannelSharedChatEndNotificationMessage
  | TwitchEventSubChannelSharedChatEndRevocationMessage
  | TwitchEventSubChannelSharedChatUpdateNotificationMessage
  | TwitchEventSubChannelSharedChatUpdateRevocationMessage
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
