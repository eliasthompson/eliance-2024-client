import useWebSocket from 'react-use-websocket';
import { Fragment, useEffect, useState } from 'react';

import type { TwitchApiGetUsersResponse } from '@store/apis/twitch/getUsers';
import type { TwitchEventSubMessage } from '@src/types';
import type { InfoUser } from '@store/slices/info';

import { FlexContainer } from '@components/shared/FlexContainer';
import { TwitchProfileImage } from '@components/shared/TwitchProfileImage';
import { addTwitchEventSubMessageId, setTwitchEventSub } from '@src/store/slices/twitchEventSub';
import { customRoleId } from '@config';
import { setInfo } from '@store/slices/info';
import { useDispatch, useSelector } from '@store';
import { useGetCustomRoleQuery } from '@store/apis/firebot/getCustomRole';
import { useGetPronounsQuery } from '@store/apis/chatPronouns/getPronouns';
import { useLazyGetCreatorGoalsQuery } from '@store/apis/twitch/getCreatorGoals';
import { useLazyGetGuestStarSessionQuery } from '@store/apis/twitch/getGuestStarSession';
import { useLazyGetStreamsQuery } from '@store/apis/twitch/getStreams';
import { useLazyGetUserChatColorsQuery } from '@store/apis/twitch/getUserChatColors';
import { useLazyGetUserQuery } from '@store/apis/chatPronouns/getUser';
import { useLazyGetUsersQuery } from '@store/apis/twitch/getUsers';
import { useLazyGetViewerQuery } from '@store/apis/firebot/getViewer';
import { useValidateTokenQuery } from '@src/store/apis/twitch/validateToken';

export const PersonBox = () => {
  const dispatch = useDispatch();
  const { lastJsonMessage: firebotMessage, readyState } = useWebSocket<TwitchEventSubMessage>('ws://localhost:7472', { share: true });
  const { lastJsonMessage: twitchMessage } = useWebSocket<TwitchEventSubMessage>('wss://eventsub.wss.twitch.tv/ws', { share: true });
  const { goal, guests, user } = useSelector(({ info }) => info);
  const { messageIds, sessionId } = useSelector(({ twitchEventSub }) => twitchEventSub);
  const { data: customRoleData, error: customRoleError, isLoading: isCustomRoleLoading } = useGetCustomRoleQuery({ customRoleId });
  const { data: pronounsData, error: pronounsError, isLoading: isPronounsLoading } = useGetPronounsQuery();
  const { data: tokenData, error: tokenError, isLoading: isTokenLoading } = useValidateTokenQuery();
  const [getCreatorGoals, { data: creatorGoalsData, error: creatorGoalsError, isLoading: isCreatorGoalsLoading }] = useLazyGetCreatorGoalsQuery();
  const [getGuestStarSession, { data: guestStarSessionData, error: guestStarSessionError, isLoading: isGuestStarSessionLoading }] = useLazyGetGuestStarSessionQuery();
  const [getStreams, { data: streamsData, error: streamsError, isLoading: isStreamsLoading }] = useLazyGetStreamsQuery();
  const [getUser, { data: userData, error: userError, isLoading: isUserLoading }] = useLazyGetUserQuery();
  const [getUserChatColors, { data: userChatColorsData, error: userChatColorsError, isLoading: isUserChatColorsLoading }] = useLazyGetUserChatColorsQuery();
  const [getUsers, { data: usersData, error: usersError, isLoading: isUsersLoading }] = useLazyGetUsersQuery();
  const [getViewer, { data: viewerData, error: viewerError, isLoading: isViewerLoading }] = useLazyGetViewerQuery();
  const [persons, setPersons] = useState<InfoUser[]>([]);
  const isAuthorized = !(
    (tokenError && 'status' in tokenError && tokenError.status === 401)
    || (creatorGoalsError && 'status' in creatorGoalsError && creatorGoalsError.status === 401)
    || (guestStarSessionError && 'status' in guestStarSessionError && guestStarSessionError.status === 401)
    || (usersError && 'status' in usersError && usersError.status === 401)
  );
  const isError = (
    pronounsError
    || tokenError
    || creatorGoalsError
    || guestStarSessionError
    || userError
    || usersError
  );
  const isLoading = (
    isPronounsLoading
    || isTokenLoading
    || isCreatorGoalsLoading
    || isGuestStarSessionLoading
    || isUserLoading
    || isUsersLoading
  );
  const isRenderable = (
    !isLoading
    && !isError
    && sessionId
    && goal
    && user
  );
  const isLazyQueried = (
    creatorGoalsData
    || guestStarSessionData
    || userData
    // || usersData
    || creatorGoalsError
    || guestStarSessionError
    || userError
    // || usersError
    || isCreatorGoalsLoading
    || isGuestStarSessionLoading
    || isUserLoading
    // || isUsersLoading
  );
  const isGuestStarSessionQueried = (
    guestStarSessionData
    || guestStarSessionError
    || isGuestStarSessionLoading
  );
  const isTokenDataLoaded = !!(
    tokenData
    && !tokenError
    && !isTokenLoading
  );
  const isGuestDataLoaded = !!(
    customRoleData
    && pronounsData
    && guestStarSessionData
    && !customRoleError
    && !guestStarSessionError
    && !pronounsError
    && !isCustomRoleLoading
    && !isGuestStarSessionLoading
    && !isPronounsLoading
  );

  useEffect(() => {
    if (tokenData && !isGuestStarSessionQueried) getGuestStarSession({ broadcasterId: tokenData.user_id });
  }, [tokenData, isGuestStarSessionQueried]);

  useEffect(() => {
    if (tokenData && customRoleData && pronounsData && guestStarSessionData) {
      const guestStarGuests = guestStarSessionData.data.map(({ guests }) => guests);
      const guestStarIds = (guestStarGuests.length) ? guestStarGuests[0].map(({ user_id: userId }) => userId) : [];
      const viewerIds = customRoleData.viewers.map(({ id }) => id);
      const personIds = [...new Set([tokenData.user_id, ...guestStarIds, ...viewerIds])];

      getStreams({ userIds: personIds });
      getUserChatColors({ userIds: personIds });
      getUsers({ ids: personIds });

      console.log(personIds);
    }
  }, [tokenData, customRoleData, pronounsData, guestStarSessionData]);

  // Set persons if user exists
  useEffect(() => {
    if (user) setPersons([user, ...guests]);
  }, [guests, setPersons, user]);

  // Render nothing if data is incomplete
  if (!isRenderable) return null;

  // Render component
  return (
    <FlexContainer reverse={ true }>
      { (persons.length) ? persons.slice().reverse().map((person) => (
        <TwitchProfileImage key={ person.id } size="100px" src={ person.profile_image_url } />
      )) : null }
    </FlexContainer>
  );
};
