import { css } from '@emotion/react';

import { ChatMessage } from '@components/ChatMessage';
import { EmoteIcon } from '@components/shared/svgs/EmoteIcon';
import { FlexContainer } from '@components/shared/FlexContainer';
import { FollowerIcon } from '@components/shared/svgs/FollowerIcon';
import { useGetChatSettingsQuery } from '@store/apis/twitch/getChatSettings';
import { useSelector } from '@store';
import { useGetSharedChatSessionQuery } from '@store/apis/twitch/getSharedChatSession';

export const ChatBox = () => {
  const { broadcasterId, chats } = useSelector(({ info }) => info);
  const {
    data: chatSettingsData,
    // error: chatSettingsError,
    isLoading: isChatSettingsLoading,
  } = useGetChatSettingsQuery({ broadcasterId });
  const {
    data: sharedChatSessionData,
    // error: sharedChatSessionError,
    isLoading: isSharedChatSessionLoading,
  } = useGetSharedChatSessionQuery({ broadcasterId });
  const isLoading = isChatSettingsLoading || isSharedChatSessionLoading;
  const isRenderable = !!(chatSettingsData && sharedChatSessionData);

  const cssContainer = css`
    flex: 3;
  `;
  const cssContainerSettings = css`
    gap: calc(var(--padding) / 2);
    padding: var(--padding);
  `;
  const cssIconSettings = css`
    height: calc((var(--bar-height) - (var(--padding) * 2.5)) / 2);
    filter: drop-shadow(#000000 0 0 calc(var(--padding) * 0.75));
  `;
  const cssContainerMessages = css`
    flex: 1;
    gap: calc(var(--padding) / 4);
    justify-content: flex-end;
    line-height: calc((var(--bar-height) - (var(--padding) * 1.5)) / 3);
    padding: 0 0 var(--padding) var(--padding);
  `;

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return false;

  // Render component
  return (
    <FlexContainer cssContainer={cssContainer}>
      <FlexContainer column cssContainer={cssContainerMessages}>
        {chats.map((chat, i) => (
          <ChatMessage key={i} event={chat} />
        ))}
      </FlexContainer>
      <FlexContainer column css={cssContainerSettings}>
        <FollowerIcon
          colored={chatSettingsData.data[0].follower_mode}
          filled={chatSettingsData.data[0].follower_mode}
          cssIcon={css`
            opacity: ${chatSettingsData.data[0].follower_mode ? 1 : 0.5};
            ${cssIconSettings.styles}
          `}
        />
        <EmoteIcon
          colored={chatSettingsData.data[0].emote_mode}
          filled={chatSettingsData.data[0].emote_mode}
          cssIcon={css`
            opacity: ${chatSettingsData.data[0].emote_mode ? 1 : 0.5};
            ${cssIconSettings.styles}
          `}
        />
      </FlexContainer>
    </FlexContainer>
  );
};
