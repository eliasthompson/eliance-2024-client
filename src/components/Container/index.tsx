import useWebSocket from 'react-use-websocket';
import { Fragment, useEffect, useState } from 'react';

import type { TwitchApiGetUsersResponse } from '@store/apis/twitch/getUsers';
import type { TwitchEventSubMessage } from '@src/types';
import type { TwitchInfoState } from '@store/slices/twitchInfo';

import { Authentication } from '@components/Authentication';
import { ChatBox } from '@components/ChatBox';
import { FlexContainer } from '@components/shared/FlexContainer';
import { TwitchProfileImage } from '@components/shared/TwitchProfileImage';
import { addTwitchEventSubMessageId, setTwitchEventSub } from '@src/store/slices/twitchEventSub';
import { setTwitchInfo } from '@store/slices/twitchInfo';
import { useDispatch, useSelector } from '@store/hooks';
import { useGetPronounsQuery } from '@store/apis/chatPronouns/getPronouns';
import { useLazyGetCreatorGoalsQuery } from '@store/apis/twitch/getCreatorGoals';
import { useLazyGetUserQuery } from '@store/apis/chatPronouns/getUser';
import { useLazyGetUsersQuery } from '@store/apis/twitch/getUsers';
import { useValidateTokenQuery } from '@src/store/apis/twitch/validateToken';

export const Container = () => {
  const dispatch = useDispatch();
  const { lastJsonMessage: twitchMessage } = useWebSocket<TwitchEventSubMessage>('wss://eventsub.wss.twitch.tv/ws', { share: true });
  const { lastJsonMessage: firebotMessage, readyState } = useWebSocket<TwitchEventSubMessage>('ws://localhost:7472', { share: true });
  const { goal, guests, user } = useSelector(({ twitchInfo }) => twitchInfo);
  const { messageIds, sessionId } = useSelector(({ twitchEventSub }) => twitchEventSub);
  const { data: pronounsData, error: pronounsError, isLoading: isPronounsLoading } = useGetPronounsQuery();
  const { data: tokenData, error: tokenError, isLoading: isTokenLoading } = useValidateTokenQuery();
  const [getUser, { data: userData, error: userError, isLoading: isUserLoading }] = useLazyGetUserQuery();
  const [getUsers, { data: usersData, error: usersError, isLoading: isUsersLoading }] = useLazyGetUsersQuery();
  const [getCreatorGoals, { data: creatorGoalsData, error: creatorGoalsError, isLoading: isCreatorGoalsLoading }] = useLazyGetCreatorGoalsQuery();
  const [streamers, setStreamers] = useState<TwitchInfoState['user'][]>([]);
  const isAuthorized = !(
    (tokenError && 'status' in tokenError && tokenError.status === 401)
    || (usersError && 'status' in usersError && usersError.status === 401)
    || (creatorGoalsError && 'status' in creatorGoalsError && creatorGoalsError.status === 401)
  );
  const isError = (
    pronounsError
    || tokenError
    || usersError
    || creatorGoalsError
  );
  const isLoading = (
    isPronounsLoading
    || isTokenLoading
    || isUsersLoading
    || isCreatorGoalsLoading
  );
  const isRenderable = (
    !isLoading
    && !isError
    && sessionId
    && goal
    && user
  );
  const isLazyQueried = (
    userData
    || usersData
    || creatorGoalsData
    || userError
    || usersError
    || creatorGoalsError
    || isUserLoading
    || isUsersLoading
    || isCreatorGoalsLoading
  );
  console.log(readyState, firebotMessage);

  // Query twitch data if token data exists and lazy data has not been queried
  useEffect(() => {
    if (tokenData && !isLazyQueried) {
      const guestsParam = new URLSearchParams(window.location.search).get('guests');
      const guestLogins = (guestsParam) ? guestsParam.split(',') : [];

      getUser({ login: tokenData.login });
      getUsers({ logins: [tokenData.login, ...guestLogins] });
      getCreatorGoals({ broadcasterId: tokenData.user_id });
    }
  }, [getUsers, getCreatorGoals, isLazyQueried, tokenData]);

  // Set twitch info if user & creator goal data exists
  useEffect(() => {
    if (creatorGoalsData && pronounsData && tokenData && userData && usersData) {
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

      dispatch(setTwitchInfo({
        goal: creatorGoalsData.data[0],
        guests: users.filter((_, i) => i),
        user: users[0],
      }));
    }
  }, [creatorGoalsData, dispatch, pronounsData, tokenData, userData, usersData]);

  // Set streamers if user exists
  useEffect(() => {
    if (user) setStreamers([user, ...guests]);
  }, [guests, setStreamers, user]);

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
        { (streamers.length) ? streamers.slice().reverse().map((streamer) => (
          <TwitchProfileImage key={ streamer.id } size="100px" src={ streamer.profile_image_url } />
        )) : null }
      </FlexContainer>

      <h1>{ user.display_name }</h1>
      <h3>({ user.pronouns })</h3>
      <h4>{ goal.type }: { goal.current_amount }/{ goal.target_amount }</h4>
      <ChatBox />
    </Fragment>
  );
};
