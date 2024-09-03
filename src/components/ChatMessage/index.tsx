import { Fragment } from 'react';
import { css } from '@emotion/react';

import type { ChatMessageProps, TwitchChatBoxBadge } from '@components/ChatMessage/types';

import { AnnouncementIcon } from '@components/shared/svgs/AnnouncementIcon';
import { ChannelPointIcon } from '@components/shared/svgs/ChannelPointIcon';
import { FlexContainer } from '@components/shared/FlexContainer';
import { SparkleIcon } from '@components/shared/svgs/SparkleIcon';
import { SubscriberIcon } from '@components/shared/svgs/SubscriberIcon';
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
  default: SubscriberIcon, // TwitchIcon,
  resub: SubscriberIcon,
  user_intro: SparkleIcon,
  // power_ups_message_effect: BitsIcon,
  // power_ups_gigantified_emote: BitsIcon,
} as const;

export const announcementColors = {
  BLUE: 'linear-gradient(#00d6d6, #9146ff)',
  GREEN: 'linear-gradient(#00db84, #57bee6)',
  ORANGE: 'linear-gradient(#ffb31a, #e0e000)',
  PURPLE: 'linear-gradient(#9146ff, #ff75e6)',
} as const;

export const ChatMessage = ({ event }: ChatMessageProps) => {
  const { broadcasterId, broadcasterColor } = useSelector(({ info }) => info);
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
  const isAction = event.message.text.startsWith('\u0001ACTION');
  const isDeleted = !!event.deletedTimestamp;
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
    IconComponent = noticeTypes[specialType] || noticeTypes.default;
  }

  const backgroundColorContainer = isSpecialMessage ? 'rgba(0, 0, 0, 33%)' : 'transparent';
  const backgroundColorSpanFragments = isHighlightMessage ? '#755ebc' : 'transparent';
  const backgroundDivMarker =
    'notice_type' in event && event.notice_type === 'announcement' && event.announcement?.color !== 'PRIMARY'
      ? announcementColors[event.announcement?.color]
      : broadcasterColor;
  const colorSpanFragments = isDeleted ? '#adadb8' : 'inherit';
  const colorStrongLogin = event.color || '#808080';
  const filterContainer = isSpecialMessage ? 'drop-shadow(#000000 0 0 calc(var(--padding) * 0.75))' : 'none';
  const filterPMessageChild = isSpecialMessage ? 'none' : 'drop-shadow(#000000 0 0 calc(var(--padding) * 0.75))';
  const filterSpanPronouns = isSpecialMessage
    ? 'brightness(67%)'
    : 'brightness(67%) drop-shadow(#000000 0 0 calc(var(--padding) * 0.75))';
  const fontStyleSpanFragments = isAction || isDeleted ? 'italic' : 'normal';
  const paddingSpanFragments = isHighlightMessage ? '0 calc(var(--padding) / 4)' : '0';
  const cssContainer = css`
    position: relative;
    gap: calc(var(--padding) / 2);
    align-items: center;
    background-color: ${backgroundColorContainer};
    filter: ${filterContainer};
  `;
  const cssDivMarker = css`
    position: absolute;
    left: 0;
    width: calc(var(--padding) / 2);
    height: 100%;
    margin: auto 0;
    background: ${backgroundDivMarker};
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

    * {
      filter: ${filterPMessageChild};
    }
  `;
  const cssImgBadge = css`
    height: calc(((var(--bar-height) - (var(--padding) * 1.5)) / 3) - (var(--padding) / 2));
    width: calc(((var(--bar-height) - (var(--padding) * 1.5)) / 3) - (var(--padding) / 2));
    margin: 0 calc(var(--padding) / 4) 0 0;
    vertical-align: text-bottom;
  `;
  const cssStrongLogin = css`
    color: ${colorStrongLogin};
  `;
  const cssSpanPronouns = css`
    color: ${colorStrongLogin};
    filter: ${filterSpanPronouns};
  `;
  const cssSpanFragments = css`
    background-color: ${backgroundColorSpanFragments};
    padding: ${paddingSpanFragments};
    color: ${colorSpanFragments};
    font-style: ${fontStyleSpanFragments};
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
    <FlexContainer cssContainer={cssContainer}>
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
        <strong css={cssStrongLogin}>{event.chatter_user_name}</strong>
        {pronouns ? <strong css={cssSpanPronouns}> ({pronouns.toLowerCase()})</strong> : null}
        :&nbsp;
        <span css={cssSpanFragments}>
          {isDeleted
            ? 'message deleted'
            : fragments.map((fragment, i) => {
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
