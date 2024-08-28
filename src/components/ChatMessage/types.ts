import type { TwitchApiGetChannelChatBadgesResponse } from '@store/apis/twitch/getChannelChatBadges';
import type { TwitchApiGetGlobalChatBadgesResponse } from '@store/apis/twitch/getGlobalChatBadges';
import { InfoState } from '@store/slices/info';

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
