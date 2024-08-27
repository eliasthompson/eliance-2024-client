import { css } from '@emotion/react';

import type { ChatMessageProps, TwitchChatBoxBadge } from '@components/ChatMessage/types';

import { useGetChannelChatBadgesQuery } from '@store/apis/twitch/getChannelChatBadges';
import { useGetGlobalChatBadgesQuery } from '@store/apis/twitch/getGlobalChatBadges';
import { useGetGlobalEmotesQuery } from '@store/apis/twitch/getGlobalEmotes';
import { useGetPronounsQuery } from '@store/apis/chatPronouns/getPronouns';
import { useGetUserQuery } from '@store/apis/chatPronouns/getUser';
import { useSelector } from '@store';

export const ChatMessage = ({ event }: ChatMessageProps) => {
  const { badges: messageBadges, message: { fragments } } = event;
  console.log(fragments);

  const { broadcasterId } = useSelector(({ info }) => info);
  const { data: channelChatBadgesData, error: channelChatBadgesError, isLoading: isChannelChatBadgesLoading } = useGetChannelChatBadgesQuery({ broadcasterId });
  const { data: globalChatBadgesData, error: globalChatBadgesError, isLoading: isGlobalChatBadgesLoading } = useGetGlobalChatBadgesQuery();
  const { data: globalEmotesData, error: globalEmotesError, isLoading: isGlobalEmotesLoading } = useGetGlobalEmotesQuery();
  const { data: pronounsData, error: pronounsError, isLoading: isPronounsLoading } = useGetPronounsQuery();
  const { data: userData, error: userError, isLoading: isUserLoading } = useGetUserQuery({ login: event.chatter_user_login });
  const isLoading = (
    isChannelChatBadgesLoading
    || isGlobalChatBadgesLoading
    || isGlobalEmotesLoading
    || isPronounsLoading
    || isUserLoading
  );
  const isRenderable = !!(
    channelChatBadgesData
    && globalChatBadgesData
    && globalEmotesData
    && pronounsData
    && userData
  );
  const cssStrong = css`
    color: #ff0000;
  `;

  const { template = '' } = globalEmotesData || {};
  const badgesData = [...((globalChatBadgesData || {}).data || []), ...((channelChatBadgesData || {}).data || [])];
  const messageEmotes = fragments.filter(({ type }) => type === 'emote').map(({ emote }) => emote);
  const pronouns = ((pronounsData || []).find(({ name }) => name === (userData || [{}])[0].pronoun_id) || {}).display;
  const badges = badgesData.reduce((acc: TwitchChatBoxBadge[], { set_id: setId, versions }) => [
    ...acc,
    ...versions.map((version) => ({ ...version, set_id: setId })),
  ], []);
  const emotes = messageEmotes.map((emote) => {
    const format = (emote.format.includes('animated')) ? 'animated' : 'static';
    const url = template.replace('{{id}}', emote.id).replace('{{format}}', format).replace('{{theme_mode}}', 'dark').replace('{{scale}}', '3.0');

    return { ...emote, url };
  });

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return null;

  // Render component
  return (
    <p>
      { 
        messageBadges.map((messageBadge, i) => {
          const { image_url_4x: imageUrl4x } = badges.find(({ id, set_id: setId }) => id === messageBadge.id && setId === messageBadge.set_id) || {};

          if (imageUrl4x) return <img key={ i } src={ imageUrl4x } />;
          return null;
        })
      }

      <strong style={ { color: event.color || '#808080' } }>
        { event.chatter_user_name }
        { (pronouns) ? ` (${pronouns.toLowerCase()})` : null }
      </strong>:&nbsp;

      { 
        fragments.map((fragment, i) => {
          const { url } = emotes.find(({ id }) => id === fragment.emote?.id) || {};

          if (url) return <img key={ i } src={ url } />;
          if (fragment.type === 'mention') return <strong key={ i }>{ fragment.text }</strong>;
          return <span key={ i }>{ fragment.text }</span>;
        })
      }
    </p>
  );
};
