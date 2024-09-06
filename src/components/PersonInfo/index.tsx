import RelativeTime from '@yaireo/relative-time';
import { DateTime, TimeZone } from 'timezonecomplete';
import { css } from '@emotion/react';

import type { PersonInfoProps } from './types';

import { FlexContainer } from '@components/shared/FlexContainer';
import { LinkIcon } from '@components/shared/svgs/LinkIcon';
import { TwitchIcon } from '@components/shared/svgs/TwitchIcon';
import { XIcon } from '@components/shared/svgs/XIcon';
import { TwitchProfileImage } from '@components/shared/TwitchProfileImage';
import { useGetChannelStreamScheduleQuery } from '@store/apis/twitch/getChannelStreamSchedule';
import { useGetPronounsQuery } from '@store/apis/chatPronouns/getPronouns';
import { useGetUserQuery } from '@store/apis/chatPronouns/getUser';
import { useGetViewerQuery } from '@store/apis/firebot/getViewer';
import { useSelector } from '@store';

export const socialPlatforms = {
  default: TwitchIcon,
  // facebook: FacebookIcon,
  generic: LinkIcon,
  // instagram: InstagramIcon,
  // reddit: RedditIcon,
  // tiktok: TikTokIcon,
  twitch: TwitchIcon,
  x: XIcon,
  // youtube: YouTubeIcon,
  website: LinkIcon,
} as const;

export const PersonInfo = ({ person }: PersonInfoProps) => {
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

  const personIndex = persons.findIndex(({ id }) => id === person.id);
  const unadjustedPosition = personIndex - persons.findIndex(({ isActive }) => isActive);
  const position = unadjustedPosition < 0 ? unadjustedPosition + persons.length : unadjustedPosition;
  const apiPronouns = ((pronounsData || []).find(({ name }) => name === ((userData || [])[0] || {}).pronoun_id) || {})
    .display;
  const pronouns = apiPronouns || viewerData?.metadata?.pronouns;
  const timeZone =
    personIndex === 0 ? Intl.DateTimeFormat().resolvedOptions().timeZone : viewerData?.metadata?.timeZone;
  let nextStream = null;
  let SocialIcon = socialPlatforms.default;
  let socialHandlePrefix = '@';
  let socialHandle = person.login;

  if (channelStreamScheduleData) {
    let { title, start_time: startTime } = channelStreamScheduleData.data.segments[0];

    if (new Date(startTime).getTime() - new Date().getTime() < 0)
      ({ title, start_time: startTime } = channelStreamScheduleData.data.segments[1]) || {};

    if (startTime) nextStream = { title, startTime };
  }

  if (viewerData?.metadata?.socialPlatform && viewerData?.metadata?.socialHandle) {
    const socialPlatform = viewerData.metadata.socialPlatform.toLowerCase();

    SocialIcon = socialPlatforms[socialPlatform] || socialPlatforms.generic;
    socialHandle = viewerData?.metadata?.socialHandle;

    if (socialPlatform === 'website') socialHandlePrefix = '';
  }

  const opacityContainerInfo = person.isActive ? '1' : '0';

  const cssContainer = css`
    position: absolute;
    z-index: ${(position + 1) * -1};
    box-sizing: border-box;
    max-width: 100%;
    min-width: 100%;
    padding: var(--padding) var(--padding) var(--padding) calc(var(--padding) + ${position * 12}px);
  `;
  const cssContainerInfo = css`
    position: absolute;
    box-sizing: border-box;
    max-width: calc(100% - (var(--padding) * 2));
    padding-left: calc((var(--padding) * ${persons.length}) + (var(--bar-height) - (var(--padding) * 2)));
    opacity: ${opacityContainerInfo};
  `;
  const cssDivMarker = css`
    min-width: calc(var(--padding) * 0.75);
    margin-right: calc(var(--padding) * 0.75);
    background-color: ${person.color || viewerData?.metadata?.color || '#808080'};
  `;
  const cssContainerPrimaryInfo = css`
    flex: 1;
    max-width: calc(100% - (var(--padding) * 1.5));
  `;
  const cssPTopInfo = css`
    display: inline-flex;
    align-items: baseline;
  `;
  const cssSpanName = css`
    overflow-x: hidden;
    font-size: calc(var(--font-size) * 2);
    text-overflow: ellipsis;
    white-space: nowrap;
  `;
  const cssSpanPronouns = css`
    flex: 1 0 0%;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    filter: brightness(67%);
  `;
  const cssSpanStreamStartTime = css`
    white-space: nowrap;
    filter: brightness(67%);
  `;
  const cssPBottomInfo = css`
    display: flex;
    align-items: center;
  `;
  const cssSpanLive = css`
    display: inline-flex;
    width: var(--line-height);
    height: var(--line-height);
    margin-right: calc(var(--padding) / 3);
    border-radius: calc(var(--line-height) / 2);
    background-color: #eb0400;
  `;
  const cssIconSocial = css`
    vertical-align: text-bottom;
  `;
  const cssSpanHandle = css`
    filter: brightness(67%);
  `;

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return null;

  // Render component
  return (
    <FlexContainer cssContainer={cssContainer}>
      <TwitchProfileImage size="var(--bar-height) - (var(--padding) * 2)" src={person.profile_image_url} />

      <FlexContainer cssContainer={cssContainerInfo}>
        <div css={cssDivMarker}></div>

        <FlexContainer column={true} cssContainer={cssContainerPrimaryInfo}>
          {!nextStream ? (
            <p css={cssPTopInfo}>
              <span css={cssSpanName}>{viewerData?.metadata?.name || person.display_name}</span>
              {pronouns ? <span css={cssSpanPronouns}>&nbsp;({pronouns.toLowerCase()})</span> : null}
            </p>
          ) : (
            <p css={cssPTopInfo}>
              <span css={cssSpanName}>{nextStream.title || 'Next Stream'}</span>
              <span css={cssSpanStreamStartTime}>
                &nbsp;{new RelativeTime({ options: { numeric: 'always' } }).from(new Date(nextStream.startTime))}
              </span>
            </p>
          )}

          <p css={cssPBottomInfo}>
            {person.isLive ? <span css={cssSpanLive} /> : null}

            <span css={cssSpanHandle}>
              <SocialIcon cssIcon={cssIconSocial} />
              <span>
                {socialHandlePrefix}
                {socialHandle}
              </span>
              {timeZone ? (
                <span>
                  &nbsp;&#8226;&nbsp;
                  {new DateTime(`${new Date().toISOString()}`, 'y-MM-ddTHH:mm:ss.SSSZ')
                    .toZone(TimeZone.zone(timeZone))
                    .format('h:mmaaaaa z')
                    .split(' ')
                    .map((time, i) => (i === 0 ? time.toLowerCase() : time))
                    .join(' ')}
                </span>
              ) : null}
            </span>
          </p>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};
