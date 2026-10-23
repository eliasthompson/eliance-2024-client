import type { InfoBarProps } from '@components/InfoBar/types';

import { css } from '@emotion/react';
import { skipToken } from '@reduxjs/toolkit/query';
import { Fragment, useEffect } from 'react';

import { ChatBox } from '@components/ChatBox';
import { ChatSettings } from '@components/ChatSettings';
import { EventBox } from '@components/EventBox';
import { FlexContainer } from '@components/shared/FlexContainer';
import { LayoutSync } from '@components/LayoutSync';
import { MessageHandler } from '@components/MessageHandler';
import { PersonBox } from '@components/PersonBox';
import { infoBlockHeights, layoutCanvases } from '@config';
import { useDispatch, useSelector } from '@store';
import { useGetUserChatColorsQuery } from '@store/apis/twitch/getUserChatColors';
import { setInfo } from '@store/slices/info';
import { useOrientation } from '@lib/useOrientation';

/**
 * The landscape person section's width for its height: three eighths of the bar (its weight among the sections' 3,
 * 2, and 3), one block tall. The portrait person box keeps it, so names fit and cut off exactly as they do there.
 */
const personAspectRatio = (() => {
  const { canvasWidth, canvasPadding, regionBorder } = layoutCanvases.landscape;

  return ((canvasWidth - (canvasPadding + regionBorder) * 2) * 3) / 8 / infoBlockHeights.landscape;
})();

export const InfoBar = ({ cssBar: cssBarProvided }: InfoBarProps) => {
  const dispatch = useDispatch();
  const orientation = useOrientation();
  const { activeAlert, broadcasterId, broadcasterColor } = useSelector(({ info }) => info);
  const {
    data: userChatColorsData,
    // error: userChatColorsError,
    isLoading: isUserChatColorsLoading,
  } = useGetUserChatColorsQuery(broadcasterId ? { userIds: [broadcasterId] } : skipToken);
  const isRenderable = !!(broadcasterId && broadcasterColor !== null);
  const isPortrait = orientation === 'portrait';
  // Chat's messages start a line and two paddings in, past the gutter its special messages mark, and in portrait the
  // chat and goals keep that far from both sides
  const sideInset = 'calc(var(--line-height) + var(--padding))';
  // An alert covers the portrait chat and goals, so chat fades out under it as the goals do
  const opacityPortraitChat = activeAlert ? '0' : '1';

  const cssBar = css`
    overflow: hidden;
    ${cssBarProvided?.styles}
  `;
  // Portrait: the person box on top, as wide for its height as in landscape, with the chat settings in the corner;
  // then chat with the goals at its foot, climbing up from them to fill what the bar has left and cut at the
  // separator, which is just its line, a padding below the person
  const cssPortraitPerson = css`
    display: flex;
    flex: none;
    justify-content: space-between;
    height: var(--bar-height);
  `;
  const cssPortraitPersonBox = css`
    display: flex;
    flex: none;
    width: calc(var(--bar-height) * ${String(personAspectRatio)});
  `;
  const cssPortraitSeparator = css`
    position: relative;
    flex: none;
    height: 2px;

    &::after {
      content: '';
      position: absolute;
      right: var(--padding);
      bottom: 0;
      left: var(--padding);
      height: 2px;
      background-color: rgba(255, 255, 255, 0.3);
    }
  `;
  const cssPortraitActivity = css`
    position: relative;
    flex: 1;
    min-height: 0;
  `;
  const cssPortraitChat = css`
    display: flex;
    flex: 1;
    box-sizing: border-box;
    min-height: 0;
    padding-right: ${sideInset};
    overflow: hidden;
    opacity: ${opacityPortraitChat};
    transition: opacity 0.5s;
  `;
  const cssPortraitGoals = css`
    display: flex;
    flex: none;
    box-sizing: border-box;
    padding: 0 ${sideInset};
  `;

  // Set broadcaster color if user chat colors data exists
  useEffect(() => {
    if (userChatColorsData) dispatch(setInfo({ broadcasterColor: userChatColorsData.data[0].color }));
  }, [dispatch, userChatColorsData]);

  // Render nothing if data is loading or required data is incomplete
  if (isUserChatColorsLoading || !isRenderable) return false;

  // Render component; the landscape bar alone keeps OBS in step, for every canvas, so a portrait one never writes twice
  return (
    <FlexContainer column={isPortrait} css={cssBar}>
      <MessageHandler />
      {isPortrait ? (
        <Fragment>
          <div css={cssPortraitPerson}>
            <div css={cssPortraitPersonBox}>
              <PersonBox />
            </div>
            <ChatSettings />
          </div>
          <div css={cssPortraitSeparator} />
          <FlexContainer column css={cssPortraitActivity}>
            <div css={cssPortraitChat}>
              <ChatBox />
            </div>
            <div css={cssPortraitGoals}>
              <EventBox />
            </div>
          </FlexContainer>
        </Fragment>
      ) : (
        <Fragment>
          <LayoutSync />
          <PersonBox />
          <EventBox />
          <ChatBox />
        </Fragment>
      )}
    </FlexContainer>
  );
};
