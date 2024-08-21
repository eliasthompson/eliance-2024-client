import { Fragment, useEffect } from 'react';

import { Authentication } from '@components/Authentication';
import { ChatBox } from '@components/ChatBox';
import { TwitchProfileImage } from '@components/shared/TwitchProfileImage';
import { setTwitchAuth } from '@store/slices/twitchAuth';
import { useDispatch, useSelector } from '@store/hooks';
import { useGetUsersQuery } from '@store/apis/twitch/getUsers';
import { useLazyGetCreatorGoalsQuery } from '@store/apis/twitch/getCreatorGoals';

export const Container = () => {
  const dispatch = useDispatch();
  const logins = (new URLSearchParams(window.location.search).get('logins') || '').split(',');
  const { broadcasterId } = useSelector(({ twitchAuth }) => twitchAuth);
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

  // Set broadcaster id if user data exists
  useEffect(() => {
    if (usersData) dispatch(setTwitchAuth({ broadcasterId: usersData.data[0].id }));
  }, [dispatch, usersData]);

  // Get creator goals if broadcaster id exists
  useEffect(() => {
    if (broadcasterId) getCreatorGoals({ broadcasterId });
  }, [broadcasterId, getCreatorGoals]);

  // Render auth buttons when twitch api isn't authorized
  if (!isAuthorized) return <Authentication />;

  // Render nothing if data is loading or errors unexpectedly
  if (isLoading || isError) return null;

  // Render component
  return (
    <Fragment>
      <div>
        { (usersData) ? usersData.data.map((userData) => (
          <TwitchProfileImage key={ userData.id } size="100px" src={ userData.profile_image_url } />
        )) : null }
      </div>

      <h1>{ usersData.data[0].display_name }</h1>

      { (creatorGoalsData) ? creatorGoalsData.data.map((goalData) => (
        <p key={ goalData.id }>{ goalData.type }: { goalData.current_amount }/{ goalData.target_amount }</p>
      )) : null }

      <ChatBox />
    </Fragment>
  );
};
