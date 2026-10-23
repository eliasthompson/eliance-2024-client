import { css } from '@emotion/react';
import { skipToken } from '@reduxjs/toolkit/query';

import { EmoteIcon } from '@components/shared/svgs/EmoteIcon';
import { FlexContainer } from '@components/shared/FlexContainer';
import { FollowerIcon } from '@components/shared/svgs/FollowerIcon';
import { useGetChatSettingsQuery } from '@store/apis/twitch/getChatSettings';
import { useSelector } from '@store';

/**
 * Whether chat is in follower-only and emote-only mode, as two icons stacked to fill a block's height: beside the chat
 * in landscape, in the person block's corner in portrait.
 */
export const ChatSettings = () => {
  const { broadcasterId } = useSelector(({ info }) => info);
  const {
    data: chatSettingsData,
    // error: chatSettingsError,
    isLoading: isChatSettingsLoading,
  } = useGetChatSettingsQuery(broadcasterId ? { broadcasterId } : skipToken);
  const isRenderable = !!chatSettingsData;

  const cssContainer = css`
    gap: calc(var(--padding) / 2);
    padding: var(--padding);
  `;
  const cssIcon = css`
    height: calc((var(--bar-height) - (var(--padding) * 2.5)) / 2);
    filter: drop-shadow(#000000 0 0 calc(var(--padding) * 0.75));
  `;

  // Render nothing if data is loading or required data is incomplete
  if (isChatSettingsLoading || !isRenderable) return false;

  // Render component
  return (
    <FlexContainer column css={cssContainer}>
      <FollowerIcon
        colored={chatSettingsData.data[0].follower_mode}
        filled={chatSettingsData.data[0].follower_mode}
        cssIcon={css`
          opacity: ${chatSettingsData.data[0].follower_mode ? 1 : 0.5};
          ${cssIcon.styles}
        `}
      />
      <EmoteIcon
        colored={chatSettingsData.data[0].emote_mode}
        filled={chatSettingsData.data[0].emote_mode}
        cssIcon={css`
          opacity: ${chatSettingsData.data[0].emote_mode ? 1 : 0.5};
          ${cssIcon.styles}
        `}
      />
    </FlexContainer>
  );
};
