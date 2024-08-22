import useWebSocket from 'react-use-websocket';
import { Fragment, useEffect, useState } from 'react';

import type { TwitchEventSubMessage } from '@src/types';
import type { TwitchInfoState } from '@store/slices/twitchInfo';

import { Authentication } from '@components/Authentication';
import { ChatBox } from '@components/ChatBox';
import { FlexContainer } from '@components/shared/FlexContainer';
import { TwitchProfileImage } from '@components/shared/TwitchProfileImage';
import { setTwitchInfo } from '@store/slices/twitchInfo';
import { useDispatch, useSelector } from '@store/hooks';
import { useLazyGetUsersQuery } from '@store/apis/twitch/getUsers';
import { useLazyGetCreatorGoalsQuery } from '@store/apis/twitch/getCreatorGoals';
import { addTwitchEventSubMessageId, setTwitchEventSub } from '@src/store/slices/twitchEventSub';
import { useValidateTokenQuery } from '@src/store/apis/twitch/validateToken';

export const Container = () => {
  const dispatch = useDispatch();
  const { lastJsonMessage: newMessage } = useWebSocket<TwitchEventSubMessage>('wss://eventsub.wss.twitch.tv/ws', { share: true });
  const { goal, guests, user } = useSelector(({ twitchInfo }) => twitchInfo);
  const { messageIds, sessionId } = useSelector(({ twitchEventSub }) => twitchEventSub);
  const { data: tokenData, error: tokenError, isLoading: isTokenLoading } = useValidateTokenQuery();
  const [getUsers, { data: usersData, error: usersError, isLoading: isUsersLoading }] = useLazyGetUsersQuery();
  const [getCreatorGoals, { data: creatorGoalsData, error: creatorGoalsError, isLoading: isCreatorGoalsLoading }] = useLazyGetCreatorGoalsQuery();
  const [streamers, setStreamers] = useState<TwitchInfoState['user'][]>([]);
  const isAuthorized = !(
    (tokenError && 'status' in tokenError && tokenError.status === 401)
    || (usersError && 'status' in usersError && usersError.status === 401)
    || (creatorGoalsError && 'status' in creatorGoalsError && creatorGoalsError.status === 401)
  );
  const isError = (
    tokenError
    || usersError
    || creatorGoalsError
  );
  const isLoading = (
    isTokenLoading
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
  const isQueried = (
    usersData
    || creatorGoalsData
    || usersError
    || creatorGoalsError
    || isUsersLoading
    || isCreatorGoalsLoading
  );

  // Query twitch data if token data exists and data has not been queried
  useEffect(() => {
    if (tokenData && !isQueried) {
      const guestsParam = new URLSearchParams(window.location.search).get('guests');
      const guestLogins = (guestsParam) ? guestsParam.split(',') : [];

      getUsers({ logins: [tokenData.login, ...guestLogins] });
      getCreatorGoals({ broadcasterId: tokenData.user_id });
    }
  }, [getUsers, getCreatorGoals, isQueried, tokenData]);

  // Set twitch info if user & creator goal data exists
  useEffect(() => {
    if (creatorGoalsData && tokenData && usersData) {
      const guestsParam = new URLSearchParams(window.location.search).get('guests');
      const guestLogins = (guestsParam) ? guestsParam.split(',') : [];
      const usersDataOrdered = [tokenData.login, ...guestLogins].map((login) => (
        usersData.data.reduce((acc, userData) => ({
          ...acc,
          [userData.login]: userData,
        }), {})
      )[login]);

      dispatch(setTwitchInfo({
        goal: creatorGoalsData.data[0],
        guests: usersDataOrdered.filter((_, i) => i),
        user: usersDataOrdered[0],
      }));
    }
  }, [creatorGoalsData, dispatch, tokenData, usersData]);

  // Set streamers if user exists
  useEffect(() => {
    if (user) setStreamers([user, ...guests]);
  }, [guests, setStreamers, user]);

  // Set session id on new session welcome
  useEffect(() => {
    if (newMessage) {
      const { metadata, payload } = newMessage;
      const { message_id: messageId, message_type: messageType } = metadata;

      if (!messageIds.includes(messageId) && messageType === 'session_welcome' && 'session' in payload) {
        dispatch(setTwitchEventSub({ sessionId: payload.session.id }));
        dispatch(addTwitchEventSubMessageId(messageId));
      }
    }          
  }, [dispatch, messageIds, newMessage]);

  // Render auth buttons when twitch api isn't authorized
  if (!isAuthorized) return <Authentication />;

  // Render nothing if data is incomplete
  if (!isRenderable) return null;

  // Render component
  return (
    <Fragment>
      <FlexContainer $reverse={ true }>
        { (streamers.length) ? streamers.slice().reverse().map((streamer) => (
          <TwitchProfileImage key={ streamer.id } $size="100px" src={ streamer.profile_image_url } />
        )) : null }
      </FlexContainer>

      <h1>{ user.display_name }</h1>
      <h3>{ goal.type }: { goal.current_amount }/{ goal.target_amount }</h3>
      <ChatBox />
    </Fragment>
  );
};
