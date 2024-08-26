import type { TwitchApiGetChannelChatBadgesResponse } from '@store/apis/twitch/getChannelChatBadges';
import type { TwitchApiGetChannelEmotesResponse } from '@store/apis/twitch/getChannelEmotes';
import type { TwitchApiGetEmoteSetsResponse } from '@store/apis/twitch/getEmoteSets';
import type { TwitchApiGetGlobalChatBadgesResponse } from '@store/apis/twitch/getGlobalChatBadges';
import type { TwitchApiGetGlobalEmotesResponse } from '@store/apis/twitch/getGlobalEmotes';
import type { TwitchEventSubChannelChatMessageNotificationMessage } from '@components/ChatBox/types';

export interface ChatMessageProps {
  event: TwitchEventSubChannelChatMessageNotificationMessage['payload']['event'],
};

export type TwitchChatBoxBadge = (TwitchApiGetChannelChatBadgesResponse['data'][number]['versions'][number] | TwitchApiGetGlobalChatBadgesResponse['data'][number]['versions'][number]) & (
  Pick<TwitchApiGetChannelChatBadgesResponse['data'][number], 'set_id'> | Pick<TwitchApiGetGlobalChatBadgesResponse['data'][number], 'set_id'>
);
