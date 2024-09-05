import { useEffect, useState } from 'react';
import { css } from '@emotion/react';

import { FlexContainer } from '@components/shared/FlexContainer';
import { PersonInfo } from '@components/PersonInfo';
import { firebotGuestRoleId } from '@config';
import { setPersons } from '@store/slices/info';
import { useDispatch, useSelector } from '@store';
import { useGetCustomRoleQuery } from '@store/apis/firebot/getCustomRole';
import { useGetGuestStarSessionQuery } from '@store/apis/twitch/getGuestStarSession';
import { useLazyGetStreamsQuery } from '@store/apis/twitch/getStreams';
import { useLazyGetUserChatColorsQuery } from '@store/apis/twitch/getUserChatColors';
import { useLazyGetUsersQuery } from '@store/apis/twitch/getUsers';

export const PersonBox = () => {
  const dispatch = useDispatch();
  const { broadcasterId, persons } = useSelector(({ info }) => info);
  const {
    data: customRoleData,
    error: customRoleError,
    isLoading: isCustomRoleLoading,
  } = useGetCustomRoleQuery({ customRoleId: firebotGuestRoleId });
  const {
    data: guestStarSessionData,
    // error: guestStarSessionError,
    isLoading: isGuestStarSessionLoading,
  } = useGetGuestStarSessionQuery({ broadcasterId });
  const [getStreams, { data: streamsData, /* error: streamsError, */ isLoading: isStreamsLoading }] =
    useLazyGetStreamsQuery();
  const [
    getUserChatColors,
    { data: userChatColorsData, /* error: userChatColorsError, */ isLoading: isUserChatColorsLoading },
  ] = useLazyGetUserChatColorsQuery();
  const [getUsers, { data: usersData, /* error: usersError, */ isLoading: isUsersLoading }] = useLazyGetUsersQuery();
  const [personIds, setPersonIds] = useState<string[]>([]);
  const isLoading =
    isCustomRoleLoading || isGuestStarSessionLoading || isStreamsLoading || isUserChatColorsLoading || isUsersLoading;
  const isRenderable = !!(guestStarSessionData && streamsData && userChatColorsData && usersData);
  const cssContainer = css`
    flex: 3;
  `;

  useEffect(() => {
    if (broadcasterId && (customRoleData || customRoleError) && guestStarSessionData) {
      const guestStarGuests = guestStarSessionData.data.map(({ guests }) => guests);
      const guestStarIds = guestStarGuests.length ? guestStarGuests[0].map(({ user_id: userId }) => userId) : [];
      const viewerIds = customRoleData ? customRoleData.viewers.map(({ id }) => id) : [];
      const allIds = [...new Set([broadcasterId, ...guestStarIds, ...viewerIds])];

      getStreams({ userIds: allIds });
      getUserChatColors({ userIds: allIds });
      getUsers({ ids: allIds });
      setPersonIds(allIds);
    }
  }, [broadcasterId, customRoleData, customRoleError, guestStarSessionData]);

  // Set persons if data exists
  useEffect(() => {
    if (personIds && streamsData && userChatColorsData && usersData) {
      dispatch(
        setPersons(
          personIds.map((personId, i) => ({
            ...usersData.data.find(({ id }) => id === personId),
            color: userChatColorsData.data.find(({ user_id: userId }) => userId === personId)?.color,
            isActive: i === 0,
            isLive: !!streamsData.data.find(({ user_id: userId }) => userId === personId),
          })),
        ),
      );
    }
  }, [dispatch, personIds, streamsData, userChatColorsData, usersData]);

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return null;

  // Render component
  return (
    <FlexContainer cssContainer={cssContainer}>
      {persons.length
        ? persons
            // .slice()
            // .reverse()
            .map((person, i) => <PersonInfo key={person.id} person={person} index={i} />)
        : null}
    </FlexContainer>
  );
};
