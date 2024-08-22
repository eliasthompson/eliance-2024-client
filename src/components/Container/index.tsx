import useWebSocket from 'react-use-websocket';
import { Fragment, useEffect } from 'react';

import type { TwitchEventSubMessage } from '@src/types';

import { Authentication } from '@components/Authentication';
import { ChatBox } from '@components/ChatBox';
// import { TwitchProfileImage } from '@components/shared/TwitchProfileImage';
import { setTwitchInfo } from '@store/slices/twitchInfo';
import { useDispatch, useSelector } from '@store/hooks';
import { useGetUsersQuery } from '@store/apis/twitch/getUsers';
import { useLazyGetCreatorGoalsQuery } from '@store/apis/twitch/getCreatorGoals';
import { addTwitchEventSubMessageId, setTwitchEventSub } from '@src/store/slices/twitchEventSub';

export const Container = () => {
  const dispatch = useDispatch();
  const logins = (new URLSearchParams(window.location.search).get('logins') || '').split(',');
  const { lastJsonMessage: newMessage } = useWebSocket<TwitchEventSubMessage>('wss://eventsub.wss.twitch.tv/ws', { share: true });
  const { broadcasterId } = useSelector(({ twitchInfo }) => twitchInfo);
  const { messageIds, sessionId } = useSelector(({ twitchEventSub }) => twitchEventSub);
  const { data: usersData, error: usersError, isLoading: isUsersLoading } = useGetUsersQuery({ logins });
  const [getCreatorGoals, { data: creatorGoalsData, error: creatorGoalsError, isLoading: isCreatorGoalsLoading }] = useLazyGetCreatorGoalsQuery();
  const isAuthorized = !(
    (usersError && 'status' in usersError && usersError.status === 401)
    || (creatorGoalsError && 'status' in creatorGoalsError && creatorGoalsError.status === 401)
  );
  const isError = (
    usersError
    || creatorGoalsError
  );
  const isLoading = (
    isUsersLoading
    || isCreatorGoalsLoading
  );

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
  }, [broadcasterId, dispatch, messageIds, newMessage]);

  // Set broadcaster id if user data exists
  useEffect(() => {
    if (usersData) dispatch(setTwitchInfo({ broadcasterId: usersData.data[0].id }));
  }, [dispatch, usersData]);

  // Get creator goals if broadcaster id exists
  useEffect(() => {
    if (broadcasterId) getCreatorGoals({ broadcasterId });
  }, [broadcasterId, getCreatorGoals]);

  // Render auth buttons when twitch api isn't authorized
  if (!isAuthorized) return <Authentication />;

  // Render nothing if data is loading or errors unexpectedly
  if (!broadcasterId || isLoading || isError || !sessionId) return null;

  // Render component
  return (
    <Fragment>
      {/* <div>
        { (usersData) ? usersData.data.map((userData) => (
          <TwitchProfileImage key={ userData.id } $size="100px" src={ userData.profile_image_url } />
        )) : null }
      </div> */}

      <h1>{ usersData.data[0].display_name }</h1>

      { (creatorGoalsData) ? creatorGoalsData.data.map((goalData) => (
        <p key={ goalData.id }>{ goalData.type }: { goalData.current_amount }/{ goalData.target_amount }</p>
      )) : null }

      <ChatBox />
    </Fragment>
  );
};
