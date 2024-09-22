import type { InfoState } from '@store/slices/info';
import type { TwitchApiGetChannelChatBadgesResponse } from '@store/apis/twitch/getChannelChatBadges';
import type { TwitchApiGetGlobalChatBadgesResponse } from '@store/apis/twitch/getGlobalChatBadges';

export interface ChatMessageProps {
  event: InfoState['chats'][number];
}

export type TwitchChatBoxBadge = (
  | TwitchApiGetChannelChatBadgesResponse['data'][number]['versions'][number]
  | TwitchApiGetGlobalChatBadgesResponse['data'][number]['versions'][number]
) &
  (
    | Pick<TwitchApiGetChannelChatBadgesResponse['data'][number], 'set_id'>
    | Pick<TwitchApiGetGlobalChatBadgesResponse['data'][number], 'set_id'>
  );
