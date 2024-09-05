import type { InfoBarProps } from '@components/InfoBar/types';

import { css } from '@emotion/react';

import { ChatBox } from '@components/ChatBox';
// import { EventBox } from '@components/EventBox';
import { FlexContainer } from '@components/shared/FlexContainer';
import { PersonBox } from '@components/PersonBox';
import { useDispatch, useSelector } from '@store';
import { useGetUserChatColorsQuery } from '@store/apis/twitch/getUserChatColors';
import { useEffect } from 'react';
import { setInfo } from '@store/slices/info';

export const InfoBar = ({ cssBar: cssBarProvided }: InfoBarProps) => {
  const dispatch = useDispatch();
  const { broadcasterId, broadcasterColor } = useSelector(({ info }) => info);
  const {
    data: userChatColorsData,
    // error: userChatColorsError,
    isLoading: isUserChatColorsLoading,
  } = useGetUserChatColorsQuery({ userIds: [broadcasterId] });
  const isRenderable = !!(broadcasterId && broadcasterColor !== null);
  const cssBar = css`
    overflow: hidden;
    ${cssBarProvided?.styles}
  `;

  // Set broadcaster color if user chat colors data exists
  useEffect(() => {
    if (userChatColorsData) dispatch(setInfo({ broadcasterColor: userChatColorsData.data[0].color }));
  }, [dispatch, userChatColorsData]);

  // Render nothing if data is loading or required data is incomplete
  if (isUserChatColorsLoading || !isRenderable) return null;

  // Render component
  return (
    <FlexContainer css={cssBar}>
      <PersonBox />
      {/* <EventBox /> */}
      <div style={{ flex: 2 }} />
      <ChatBox />
    </FlexContainer>
  );
};
