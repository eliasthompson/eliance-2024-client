import RelativeTime from '@yaireo/relative-time';
import { DateTime, TimeZone } from 'timezonecomplete';
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';

import type { PersonInfoProps } from './types';

import { FlexContainer } from '@components/shared/FlexContainer';
import { LinkIcon } from '@components/shared/svgs/LinkIcon';
import { TwitchIcon } from '@components/shared/svgs/TwitchIcon';
import { XIcon } from '@components/shared/svgs/XIcon';
import { TwitchProfileImage } from '@components/shared/TwitchProfileImage';
import { useGetChannelStreamScheduleQuery } from '@store/apis/twitch/getChannelStreamSchedule';
import { useGetPronounsQuery } from '@store/apis/chatPronouns/getPronouns';
import { useGetUserQuery } from '@store/apis/chatPronouns/getUser';
import { useLazyCreateEventSubSubscriptionStreamOfflineQuery } from '@store/apis/twitch/createEventSubSubscription/streamOffline';
import { useLazyCreateEventSubSubscriptionStreamOnlineQuery } from '@store/apis/twitch/createEventSubSubscription/streamOnline';
import { useSelector } from '@store';

export const socialPlatforms = {
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
  const { sessionId } = useSelector(({ twitchEventSub }) => twitchEventSub);
  const [
    createEventSubSubscriptionStreamOffline,
    {
      data: eventSubSubscriptionStreamOfflineData,
      // error: eventSubSubscriptionStreamOfflineError,
      isLoading: isEventSubSubscriptionStreamOffline,
    },
  ] = useLazyCreateEventSubSubscriptionStreamOfflineQuery();
  const [
    createEventSubSubscriptionStreamOnline,
    {
      data: eventSubSubscriptionStreamOnlineData,
      // error: eventSubSubscriptionStreamOnlineError,
      isLoading: isEventSubSubscriptionStreamOnline,
    },
  ] = useLazyCreateEventSubSubscriptionStreamOnlineQuery();
  const {
    data: channelStreamScheduleData,
    error: channelStreamScheduleError,
    isLoading: isChannelStreamScheduleLoading,
  } = useGetChannelStreamScheduleQuery({ broadcasterId: person.id });
  const { data: pronounsData, /* error: pronounsError, */ isLoading: isPronounsLoading } = useGetPronounsQuery();
  const { data: userData, /* error: userError, */ isLoading: isUserLoading } = useGetUserQuery({ login: person.login });
  const [nextStream, setNextStream] = useState<{ title: string; startTime: string }>(null);
  const [personInfo, setPersonInfo] = useState<string>('primaryInfo');
  const personInfoIntervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const isLoading =
    isChannelStreamScheduleLoading ||
    isEventSubSubscriptionStreamOffline ||
    isEventSubSubscriptionStreamOnline ||
    isPronounsLoading ||
    isUserLoading;
  const isRenderable = !!(
    (channelStreamScheduleData || channelStreamScheduleError) &&
    eventSubSubscriptionStreamOfflineData &&
    eventSubSubscriptionStreamOnlineData &&
    pronounsData &&
    userData
  );

  const personIndex = persons.findIndex(({ id }) => id === person.id);
  const unadjustedPosition = personIndex - persons.findIndex(({ isActive }) => isActive);
  const position = unadjustedPosition < 0 ? unadjustedPosition + persons.length : unadjustedPosition;
  const apiPronouns = ((pronounsData || []).find(({ name }) => name === ((userData || [])[0] || {}).pronoun_id) || {})
    .display;
  const pronouns = apiPronouns || person.pronouns;
  const timeZone = personIndex === 0 ? Intl.DateTimeFormat().resolvedOptions().timeZone : person.timeZone;
  let SocialIcon = socialPlatforms.twitch;
  let socialHandlePrefix = '@';
  let socialHandle = person.login;

  if (person.socialPlatform && person.socialHandle) {
    const socialPlatform = person.socialPlatform.toLowerCase();

    SocialIcon = socialPlatforms[socialPlatform] || socialPlatforms.generic;
    socialHandle = person.socialHandle;

    if (socialPlatform === 'website') socialHandlePrefix = '';
  }

  const opacityContainerInfo = person.isActive ? '1' : '0';
  const opacityContainerPrimaryInfo = personInfo === 'primaryInfo' ? '1' : '0';
  const opacityContainerSchedule = personInfo === 'schedule' ? '1' : '0';
  const transitionContainerInfo = person.isActive
    ? 'padding-left 0.5s, opacity 0.5s 1s'
    : 'padding-left 0.5s, opacity 0.5s';

  const cssContainer = css`
    position: absolute;
    z-index: ${(position + 1) * -1};
    box-sizing: border-box;
    max-width: 100%;
    min-width: 100%;
    padding: var(--padding) var(--padding) var(--padding) calc(var(--padding) + ${position * 12}px);
    transition:
      z-index 0s 0.5s,
      padding-left 0.5s 0.5s;
  `;
  const cssContainerInfo = css`
    position: absolute;
    box-sizing: border-box;
    max-width: calc(100% - (var(--padding) * 2));
    width: calc(100% - (var(--padding) * 2));
    height: calc(100% - (var(--padding) * 2));
    padding-left: calc(
      (var(--padding) * ${persons.length}) + var(--bar-height) - (var(--padding) * 2) + (var(--padding) * 1.75)
    );
    opacity: ${opacityContainerInfo};
    transition: ${transitionContainerInfo};
  `;
  const cssContainerPrimaryInfo = css`
    flex: 1;
    position: absolute;
    max-width: calc(100% - ((var(--padding) * 1) + var(--bar-height) - (var(--padding) * 2) + (var(--padding) * 1.75)));
    opacity: ${opacityContainerPrimaryInfo};
    transition: opacity 0.5s;
  `;
  const cssContainerSchedule = css`
    flex: 1;
    position: absolute;
    max-width: calc(100% - ((var(--padding) * 1) + var(--bar-height) - (var(--padding) * 2) + (var(--padding) * 1.75)));
    opacity: ${opacityContainerSchedule};
    transition: opacity 0.5s;
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

  // Subscribe to twitch event sub events id sessionId is set
  useEffect(() => {
    if (person.id && sessionId) {
      createEventSubSubscriptionStreamOffline({ broadcasterId: person.id, sessionId });
      createEventSubSubscriptionStreamOnline({ broadcasterId: person.id, sessionId });
    }
  }, [person.id, sessionId]);

  // Set next stream data
  useEffect(() => {
    if (channelStreamScheduleData && channelStreamScheduleData.data.segments) {
      let { title, start_time: startTime } = channelStreamScheduleData.data.segments[0];

      if (new Date(startTime).getTime() - new Date().getTime() < 0)
        ({ title, start_time: startTime } = channelStreamScheduleData.data.segments[1]) || {};

      if (startTime) setNextStream({ title, startTime });
    }
  }, [channelStreamScheduleData, setNextStream]);

  // Set person info interval
  useEffect(() => {
    if (nextStream) {
      clearInterval(personInfoIntervalIdRef.current);
      personInfoIntervalIdRef.current = setInterval(
        () => setPersonInfo((state) => (state === 'primaryInfo' ? 'schedule' : 'primaryInfo')),
        15 * 1000,
      );
    }

    return () => clearInterval(personInfoIntervalIdRef.current);
  }, [nextStream, personInfoIntervalIdRef, setPersonInfo]);

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return false;

  // Render component
  return (
    <FlexContainer cssContainer={cssContainer}>
      <TwitchProfileImage size="var(--bar-height) - (var(--padding) * 2)" src={person.profileImageUrl} />

      <FlexContainer cssContainer={cssContainerInfo}>
        <FlexContainer column={true} cssContainer={cssContainerPrimaryInfo}>
          <p css={cssPTopInfo}>
            <span css={cssSpanName}>{person.name}</span>
            {pronouns ? <span css={cssSpanPronouns}>&nbsp;({pronouns.toLowerCase()})</span> : null}
          </p>

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

        <FlexContainer column={true} cssContainer={cssContainerSchedule}>
          <p css={cssPTopInfo}>
            <span css={cssSpanName}>{nextStream?.title || 'Next Stream'}</span>
          </p>

          <p css={cssPBottomInfo}>
            {person.isLive ? <span css={cssSpanLive} /> : null}

            <span css={cssSpanHandle}>
              <SocialIcon cssIcon={cssIconSocial} />
              <span>
                {socialHandlePrefix}
                {socialHandle}
              </span>

              {nextStream?.startTime ? (
                <span css={cssSpanStreamStartTime}>
                  &nbsp;&#8226;&nbsp;
                  {new Date(nextStream.startTime) >= new Date()
                    ? new RelativeTime({ options: { numeric: 'always' } }).from(new Date(nextStream.startTime))
                    : 'now'}
                </span>
              ) : null}
            </span>
          </p>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};
