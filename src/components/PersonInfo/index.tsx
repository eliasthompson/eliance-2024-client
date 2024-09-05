import { css } from '@emotion/react';

import type { PersonInfoProps } from './types';

import { FlexContainer } from '@components/shared/FlexContainer';
import { TwitchIcon } from '@components/shared/svgs/TwitchIcon';
import { TwitchProfileImage } from '@components/shared/TwitchProfileImage';
import { useGetChannelStreamScheduleQuery } from '@store/apis/twitch/getChannelStreamSchedule';
import { useGetPronounsQuery } from '@store/apis/chatPronouns/getPronouns';
import { useGetUserQuery } from '@store/apis/chatPronouns/getUser';
import { useGetViewerQuery } from '@store/apis/firebot/getViewer';
import { useSelector } from '@store';

export const PersonInfo = ({ person, index: personIndex }: PersonInfoProps) => {
  const { persons } = useSelector(({ info }) => info);
  const {
    data: channelStreamScheduleData,
    error: channelStreamScheduleError,
    isLoading: isChannelStreamScheduleLoading,
  } = useGetChannelStreamScheduleQuery({ broadcasterId: person.id });
  const { data: pronounsData, /* error: pronounsError, */ isLoading: isPronounsLoading } = useGetPronounsQuery();
  const {
    data: userData,
    // error: userError,
    isLoading: isUserLoading,
  } = useGetUserQuery({ login: person.login });
  const {
    data: viewerData,
    // error: viewerError,
    isLoading: isViewerLoading,
  } = useGetViewerQuery({ userId: person.id });
  const isLoading = isChannelStreamScheduleLoading || isPronounsLoading || isUserLoading || isViewerLoading;
  const isRenderable = !!((channelStreamScheduleData || channelStreamScheduleError) && pronounsData && userData);

  const apiPronouns = ((pronounsData || []).find(({ name }) => name === ((userData || [])[0] || {}).pronoun_id) || {})
    .display;
  const pronouns = apiPronouns || viewerData?.metadata?.pronouns;

  const cssContainer = css`
    position: absolute;
    left: ${personIndex * 12}px;
    z-index: ${(personIndex + 1) * -1};
    padding: var(--padding);
  `;
  const cssContainerInfo = css`
    margin-left: calc(var(--padding) * ${persons.length});
  `;
  const cssIconTwitch = css`
    vertical-align: text-bottom;
  `;
  const cssContainerPrimaryInfo = css`
    flex: 1;
  `;
  const cssDivMarker = css`
    width: calc(var(--padding) * (3 / 4));
    margin-right: calc(var(--padding) * (3 / 4));
    background-color: ${person.color || viewerData.metadata.color || '#808080'};
  `;
  const cssSpanName = css`
    font-size: calc(var(--font-size) * 2);
  `;
  const cssSpanPronouns = css`
    filter: brightness(67%);
  `;
  const cssPHandle = css`
    filter: brightness(67%);
  `;

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return null;

  // Render component
  return (
    <FlexContainer cssContainer={cssContainer}>
      <TwitchProfileImage size="var(--bar-height) - (var(--padding) * 2)" src={person.profile_image_url} />

      {person.isActive ? (
        <FlexContainer cssContainer={cssContainerInfo}>
          <div css={cssDivMarker}></div>

          <FlexContainer column={true} cssContainer={cssContainerPrimaryInfo}>
            <p>
              <span css={cssSpanName}>{viewerData?.metadata?.name || person.display_name}</span>
              {pronouns ? <span css={cssSpanPronouns}> ({pronouns.toLowerCase()})</span> : null}
            </p>

            <p css={cssPHandle}>
              <TwitchIcon cssIcon={cssIconTwitch} />/{person.login}
            </p>
          </FlexContainer>
        </FlexContainer>
      ) : null}
    </FlexContainer>
  );
};
