import { css } from '@emotion/react';
import { skipToken } from '@reduxjs/toolkit/query';

import { ChatMessage } from '@/components/ChatMessage';
import { ChatSettings } from '@/components/ChatSettings';
import { FlexContainer } from '@/components/shared/FlexContainer';
import { useGetChatSettingsQuery } from '@/store/apis/twitch/getChatSettings';
import { useSelector } from '@/store';
import { useGetSharedChatSessionQuery } from '@/store/apis/twitch/getSharedChatSession';
import { useOrientation } from '@/lib/useOrientation';

export const ChatBox = () => {
  const orientation = useOrientation();
  const { broadcasterId, chats } = useSelector(({ info }) => info);
  const {
    data: chatSettingsData,
    // error: chatSettingsError,
    isLoading: isChatSettingsLoading,
  } = useGetChatSettingsQuery(broadcasterId ? { broadcasterId } : skipToken);
  const {
    data: sharedChatSessionData,
    // error: sharedChatSessionError,
    isLoading: isSharedChatSessionLoading,
  } = useGetSharedChatSessionQuery(broadcasterId ? { broadcasterId } : skipToken);
  const isLoading = isChatSettingsLoading || isSharedChatSessionLoading;
  const isRenderable = !!(chatSettingsData && sharedChatSessionData);
  // Portrait puts the chat settings in the person block's corner, and the goals right under the messages
  const isPortrait = orientation === 'portrait';
  const paddingBottomContainerMessages = isPortrait ? '0' : 'var(--padding)';

  const cssContainer = css`
    flex: 3;
  `;
  const cssContainerMessages = css`
    flex: 1;
    gap: calc(var(--padding) / 4);
    justify-content: flex-end;
    line-height: calc((var(--bar-height) - (var(--padding) * 1.5)) / 3);
    padding: 0 0 ${paddingBottomContainerMessages} var(--padding);
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
      {!isPortrait && <ChatSettings />}
    </FlexContainer>
  );
};
