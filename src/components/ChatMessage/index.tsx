import { Fragment } from 'react';
import { css } from '@emotion/react';

import type { ChatMessageProps, TwitchChatBoxBadge } from '@components/ChatMessage/types';

import { AnnouncementIcon } from '@components/shared/svgs/AnnouncementIcon';
import { ChannelPointIcon } from '@components/shared/svgs/ChannelPointIcon';
import { FlexContainer } from '@components/shared/FlexContainer';
import { useGetChannelChatBadgesQuery } from '@store/apis/twitch/getChannelChatBadges';
import { useGetGlobalChatBadgesQuery } from '@store/apis/twitch/getGlobalChatBadges';
import { useGetGlobalEmotesQuery } from '@store/apis/twitch/getGlobalEmotes';
import { useGetPronounsQuery } from '@store/apis/chatPronouns/getPronouns';
import { useGetUserQuery } from '@store/apis/chatPronouns/getUser';
import { useSelector } from '@store';

export const noticeTypes = {
  announcement: AnnouncementIcon,
  channel_points_highlighted: ChannelPointIcon,
  channel_points_sub_only: ChannelPointIcon,
  power_ups_message_effect: AnnouncementIcon,
  power_ups_gigantified_emote: AnnouncementIcon,
} as const;

export const ChatMessage = ({ event }: ChatMessageProps) => {
  const { broadcasterId } = useSelector(({ info }) => info);
  const {
    data: channelChatBadgesData,
    // error: channelChatBadgesError,
    isLoading: isChannelChatBadgesLoading,
  } = useGetChannelChatBadgesQuery({ broadcasterId });
  const {
    data: globalChatBadgesData,
    // error: globalChatBadgesError,
    isLoading: isGlobalChatBadgesLoading,
  } = useGetGlobalChatBadgesQuery();
  const {
    data: globalEmotesData,
    // error: globalEmotesError,
    isLoading: isGlobalEmotesLoading,
  } = useGetGlobalEmotesQuery();
  const { data: pronounsData, /* error: pronounsError, */ isLoading: isPronounsLoading } = useGetPronounsQuery();
  const {
    data: userData,
    // error: userError,
    isLoading: isUserLoading,
  } = useGetUserQuery({ login: event.chatter_user_login });
  const isLoading =
    isChannelChatBadgesLoading ||
    isGlobalChatBadgesLoading ||
    isGlobalEmotesLoading ||
    isPronounsLoading ||
    isUserLoading;
  const isRenderable = !!(
    channelChatBadgesData &&
    globalChatBadgesData &&
    globalEmotesData &&
    pronounsData &&
    userData
  );
  const isSpecialMessage = 'notice_type' in event || event.message_type !== 'text';
  const isHighlightMessage = 'message_type' in event && event.message_type === 'channel_points_highlighted';
  let IconComponent: (typeof noticeTypes)[keyof typeof noticeTypes] | null = null;
  let specialType: string | null = null;

  const {
    badges: messageBadges,
    message: { fragments },
  } = event;
  const { template = '' } = globalEmotesData || {};
  const badgesData = [...((globalChatBadgesData || {}).data || []), ...((channelChatBadgesData || {}).data || [])];
  const messageEmotes = fragments.filter(({ type }) => type === 'emote').map(({ emote }) => emote);
  const pronouns = ((pronounsData || []).find(({ name }) => name === (userData || [{}])[0].pronoun_id) || {}).display;
  const badges = badgesData.reduce(
    (acc: TwitchChatBoxBadge[], { set_id: setId, versions }) => [
      ...acc,
      ...versions.map((version) => ({ ...version, set_id: setId })),
    ],
    [],
  );
  const emotes = messageEmotes.map((emote) => {
    const format = emote.format.includes('animated') ? 'animated' : 'static';
    const url = template
      .replace('{{id}}', emote.id)
      .replace('{{format}}', format)
      .replace('{{theme_mode}}', 'dark')
      .replace('{{scale}}', '3.0');

    return { ...emote, url };
  });

  if (isSpecialMessage) {
    specialType = 'notice_type' in event ? event.notice_type : event.message_type;
    IconComponent = noticeTypes[specialType];
  }

  const backgroundColorPEvent = isSpecialMessage ? 'rgba(0, 0, 0, 70%)' : 'transparent';
  const backgroundColorSpanFragments = isHighlightMessage ? '#755ebc' : 'transparent';
  const paddingSpanFragments = isHighlightMessage ? '0 calc(var(--padding) / 4)' : '0';
  const cssPEvent = css`
    position: relative;
    gap: calc(var(--padding) / 2);
    align-items: center;
    background-color: ${backgroundColorPEvent};
  `;
  const cssDivMarker = css`
    position: absolute;
    left: 0;
    width: calc(var(--padding) / 2);
    height: 100%;
    margin: auto 0;
    background-color: green;
  `;
  const cssIconNotice = css`
    position: absolute;
    left: var(--padding);
    height: calc(var(--line-height) - (var(--padding) / 2));
  `;
  const cssPMessage = css`
    padding: calc(var(--padding) / 4) 0 calc(var(--padding) / 4)
      calc((var(--line-height) - (var(--padding) / 2)) + (var(--padding) * 1.5));
    line-height: calc(((var(--bar-height) - (var(--padding) * 1.5)) / 3) - (var(--padding) / 2));
    font-size: calc((((var(--bar-height) - (var(--padding) * 1.5)) / 3) - (var(--padding) / 2)) / 6 * 5);
  `;
  const cssImgBadge = css`
    height: calc(((var(--bar-height) - (var(--padding) * 1.5)) / 3) - (var(--padding) / 2));
    width: calc(((var(--bar-height) - (var(--padding) * 1.5)) / 3) - (var(--padding) / 2));
    margin: 0 calc(var(--padding) / 4) 0 0;
    vertical-align: text-bottom;
  `;
  const cssSpanPronouns = css`
    filter: brightness(67%);
  `;
  const cssSpanFragments = css`
    background-color: ${backgroundColorSpanFragments};
    padding: ${paddingSpanFragments};
  `;
  const cssImgEmote = css`
    height: var(--line-height);
    margin: calc(var(--padding) / -4) 0;
    vertical-align: text-bottom;
  `;

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return null;

  // Render component
  return (
    <FlexContainer
      cssContainer={css`
        background-color: ${'notice_type' in event ? 'rgba(255, 255, 255, 5%)' : 'transparent'};
        ${cssPEvent.styles}
      `}
    >
      {IconComponent ? (
        <Fragment>
          <div css={cssDivMarker} />
          <IconComponent cssIcon={cssIconNotice} />
        </Fragment>
      ) : null}

      <p css={cssPMessage}>
        {messageBadges.map((messageBadge, i) => {
          const { image_url_4x: imageUrl4x } =
            badges.find(({ id, set_id: setId }) => id === messageBadge.id && setId === messageBadge.set_id) || {};

          if (imageUrl4x) return <img key={i} src={imageUrl4x} css={cssImgBadge} />;
          return null;
        })}
        <strong style={{ color: event.color || '#808080' }}>
          {event.chatter_user_name}
          {pronouns ? <span css={cssSpanPronouns}> ({pronouns.toLowerCase()})</span> : null}
        </strong>
        :&nbsp;
        <span css={cssSpanFragments}>
          {fragments.map((fragment, i) => {
            const { url } = emotes.find(({ id }) => id === fragment.emote?.id) || {};

            if (url) return <img key={i} src={url} css={cssImgEmote} />;
            if (fragment.type === 'mention') return <strong key={i}>{fragment.text}</strong>;
            return <span key={i}>{fragment.text}</span>;
          })}
        </span>
      </p>
    </FlexContainer>
  );
};
