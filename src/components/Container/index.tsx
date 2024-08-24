import useWebSocket from 'react-use-websocket';
import { Fragment, useEffect, useState } from 'react';

import type { TwitchApiGetUsersResponse } from '@store/apis/twitch/getUsers';
import type { TwitchEventSubMessage } from '@src/types';
import type { InfoUser } from '@store/slices/info';

import { Authentication } from '@components/Authentication';
import { ChatBox } from '@components/ChatBox';
import { FlexContainer } from '@components/shared/FlexContainer';
import { TwitchProfileImage } from '@components/shared/TwitchProfileImage';
import { addTwitchEventSubMessageId, setTwitchEventSub } from '@src/store/slices/twitchEventSub';
import { setInfo } from '@store/slices/info';
import { useDispatch, useSelector } from '@store/hooks';
import { useGetPronounsQuery } from '@store/apis/chatPronouns/getPronouns';
import { useLazyGetCreatorGoalsQuery } from '@store/apis/twitch/getCreatorGoals';
import { useLazyGetGuestStarSessionQuery } from '@store/apis/twitch/getGuestStarSession';
import { useLazyGetUserQuery } from '@store/apis/chatPronouns/getUser';
import { useLazyGetUsersQuery } from '@store/apis/twitch/getUsers';
import { useValidateTokenQuery } from '@src/store/apis/twitch/validateToken';

export const Container = () => {
  const dispatch = useDispatch();
  const { lastJsonMessage: twitchMessage } = useWebSocket<TwitchEventSubMessage>('wss://eventsub.wss.twitch.tv/ws', { share: true });
  const { lastJsonMessage: firebotMessage, readyState } = useWebSocket<TwitchEventSubMessage>('ws://localhost:7472', { share: true });
  const { goal, guests, user } = useSelector(({ info }) => info);
  const { messageIds, sessionId } = useSelector(({ twitchEventSub }) => twitchEventSub);
  const { data: pronounsData, error: pronounsError, isLoading: isPronounsLoading } = useGetPronounsQuery();
  const { data: tokenData, error: tokenError, isLoading: isTokenLoading } = useValidateTokenQuery();
  const [getCreatorGoals, { data: creatorGoalsData, error: creatorGoalsError, isLoading: isCreatorGoalsLoading }] = useLazyGetCreatorGoalsQuery();
  const [getGuestStarSession, { data: guestStarSessionData, error: guestStarSessionError, isLoading: isGuestStarSessionLoading }] = useLazyGetGuestStarSessionQuery();
  const [getUser, { data: userData, error: userError, isLoading: isUserLoading }] = useLazyGetUserQuery();
  const [getUsers, { data: usersData, error: usersError, isLoading: isUsersLoading }] = useLazyGetUsersQuery();
  const [people, setPeople] = useState<InfoUser[]>([]);
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

  // Query twitch data if token data exists and lazy data has not been queried
  useEffect(() => {
    if (tokenData && !isLazyQueried) {
      const guestsParam = new URLSearchParams(window.location.search).get('guests');
      const guestLogins = (guestsParam) ? guestsParam.split(',') : [];

      getCreatorGoals({ broadcasterId: tokenData.user_id });
      getGuestStarSession({ broadcasterId: tokenData.user_id });
      getUser({ login: tokenData.login });
      // getUsers({ logins: [tokenData.login, ...guestLogins] });
    }
  }, [getUsers, getCreatorGoals, isLazyQueried, tokenData]);

  // Set twitch info if user & creator goal data exists
  useEffect(() => {
    if (creatorGoalsData && guestStarSessionData && pronounsData && tokenData && userData && usersData) {
      const guestsParam = new URLSearchParams(window.location.search).get('guests');
      const guestLogins = (guestsParam) ? guestsParam.split(',') : [];
      const usersDataOrdered: TwitchApiGetUsersResponse['data'] = [tokenData.login, ...guestLogins].map((login) => (
        usersData.data.reduce((acc, userData) => ({
          ...acc,
          [userData.login]: userData,
        }), {})
      )[login]);
      // TODO: revisit this when getting all guest pronouns (empty array if no pronouns set)
      const users = usersDataOrdered.map((userDataOrdered) => {
        const userPronouns = userData.filter(({ id }) => id === userDataOrdered.id);
        const pronouns = userPronouns.map(({ pronoun_id: pronounId }) => (
          pronounsData.find(({ name }) => pronounId === name)?.display || null
        ))[0];

        return { ...userDataOrdered, pronouns };
      });

      dispatch(setInfo({
        goal: creatorGoalsData.data[0],
        guests: users.filter((_, i) => i),
        user: users[0],
      }));
    }
  }, [creatorGoalsData, dispatch, guestStarSessionData, pronounsData, tokenData, userData, usersData]);

  // Set people if user exists
  useEffect(() => {
    if (user) setPeople([user, ...guests]);
  }, [guests, setPeople, user]);

  // Set session id on new session welcome
  useEffect(() => {
    if (twitchMessage) {
      const { metadata, payload } = twitchMessage;
      const { message_id: messageId, message_type: messageType } = metadata;

      if (!messageIds.includes(messageId) && messageType === 'session_welcome' && 'session' in payload) {
        dispatch(setTwitchEventSub({ sessionId: payload.session.id }));
        dispatch(addTwitchEventSubMessageId(messageId));
      }
    }          
  }, [dispatch, messageIds, twitchMessage]);

  // Render auth buttons when twitch api isn't authorized
  if (!isAuthorized) return <Authentication />;

  // Render nothing if data is incomplete
  if (!isRenderable) return null;

  // Render component
  return (
    <Fragment>
      <FlexContainer reverse={ true }>
        { (people.length) ? people.slice().reverse().map((person) => (
          <TwitchProfileImage key={ person.id } size="100px" src={ person.profile_image_url } />
        )) : null }
      </FlexContainer>

      <h1>{ user.display_name }</h1>
      { (user.pronouns) ? <h3>({ user.pronouns.toLowerCase() })</h3> : null } 
      <h4>{ goal.type }: { goal.current_amount }/{ goal.target_amount }</h4>
      <ChatBox />
    </Fragment>
  );
};
