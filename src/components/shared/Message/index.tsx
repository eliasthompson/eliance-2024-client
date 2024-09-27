import type { MessageProps } from '@components/shared/Message/types';

import { Fragment } from 'react/jsx-runtime';
import { css } from '@emotion/react';

import cheer1Image from '@assets/images/cheer1.gif';
import cheer100Image from '@assets/images/cheer100.gif';
import cheer1000Image from '@assets/images/cheer1000.gif';
import cheer5000Image from '@assets/images/cheer5000.gif';
import cheer10000Image from '@assets/images/cheer10000.gif';
import cheer100000Image from '@assets/images/cheer100000.gif';
import { useGetGlobalEmotesQuery } from '@store/apis/twitch/getGlobalEmotes';

export const cheermotes = {
  cheer: {
    '1': {
      color: 'rgb(151, 151, 151)',
      url: cheer1Image,
    },
    '100': {
      color: 'rgb(156, 62, 232)',
      url: cheer100Image,
    },
    '1000': {
      color: 'rgb(29, 178, 165)',
      url: cheer1000Image,
    },
    '5000': {
      color: 'rgb(0, 153, 254)',
      url: cheer5000Image,
    },
    '10000': {
      color: 'rgb(244, 48, 33)',
      url: cheer10000Image,
    },
    '100000': {
      color: 'rgb(243, 167, 26)',
      url: cheer100000Image,
    },
  },
} as const;

export const Message = ({
  message = {},
  isAction = false,
  isDeleted = false,
  isGigantifiedEmote = false,
  isHighlightMessage = false,
}: MessageProps) => {
  const { data: globalEmotesData /* , error: globalEmotesError */ } = useGetGlobalEmotesQuery();

  const { fragments = [], text = '' } = message;
  const { template = '' } = globalEmotesData || {};
  const messageEmotes = fragments
    .filter(({ type }) => type === 'cheermote' || type === 'emote')
    .map(({ cheermote, emote }) => cheermote || emote);
  const emotes = messageEmotes.map((emote) => {
    let color = null;
    let url = null;

    if ('id' in emote) {
      const format = emote.format.includes('animated') ? 'animated' : 'static';
      url = template
        .replace('{{id}}', emote.id)
        .replace('{{format}}', format)
        .replace('{{theme_mode}}', 'dark')
        .replace('{{scale}}', '3.0');
    } else {
      const cheermote = cheermotes[emote.prefix];

      ({ color, url } = cheermote ? cheermote[emote.tier] : cheermotes.cheer[emote.tier]);
    }

    return { ...emote, color, url };
  });

  const backgroundColorSpanFragments = isHighlightMessage ? '#755ebc' : 'transparent';
  const paddingSpanFragments = isHighlightMessage ? '0 calc(var(--padding) / 4)' : '0';
  const colorSpanFragments = isDeleted ? '#adadb8' : 'inherit';
  const fontStyleSpanFragments = isAction || isDeleted ? 'italic' : 'normal';
  const heightImgEmote = isGigantifiedEmote
    ? 'calc(var(--bar-height) - (((var(--bar-height) - (var(--padding) * 1.5)) / 3) - (var(--padding) / 2)) - var(--padding))'
    : 'var(--line-height)';

  const cssSpanFragments = css`
    background-color: ${backgroundColorSpanFragments};
    padding: ${paddingSpanFragments};
    color: ${colorSpanFragments};
    font-style: ${fontStyleSpanFragments};
  `;
  const cssImgEmote = css`
    height: ${heightImgEmote};
    margin: calc(var(--padding) / -4) 0;
    vertical-align: text-bottom;
  `;

  // Render deleted message if is deleted
  if (isDeleted) return <span css={cssSpanFragments}>message deleted</span>;

  // Render text if no fragments exist
  if (!fragments.length) return <span css={cssSpanFragments}>{text}</span>;

  // Render component
  return (
    <span css={cssSpanFragments}>
      {fragments.map((fragment, i) => {
        const emote =
          emotes.find((emote) =>
            'id' in emote
              ? emote.id === fragment.emote?.id
              : emote.prefix === fragment.cheermote?.prefix && emote.bits === fragment.cheermote?.bits,
          ) || {};

        if ('url' in emote && typeof emote.url === 'string') {
          return (
            <Fragment key={i}>
              {isGigantifiedEmote ? <br /> : null}
              <img src={emote.url} css={cssImgEmote} />
              {'bits' in emote &&
              'color' in emote &&
              typeof emote.bits === 'number' &&
              typeof emote.color === 'string' ? (
                <strong style={{ color: emote.color }}>{emote.bits}</strong>
              ) : null}
            </Fragment>
          );
        }

        if (fragment.type === 'mention') return <strong key={i}>{fragment.text}</strong>;
        return <span key={i}>{fragment.text}</span>;
      })}
    </span>
  );
};
