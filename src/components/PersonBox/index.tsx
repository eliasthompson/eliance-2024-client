import { useEffect, useRef } from 'react';
import { css } from '@emotion/react';

import { FlexContainer } from '@components/shared/FlexContainer';
import { PersonInfo } from '@components/PersonInfo';
import { firebotGuestRoleId } from '@config';
import { rotatePersonisActive, setInfo } from '@store/slices/info';
import { useAddViewerToCustomRoleMutation } from '@store/apis/firebot/addViewerToCustomRole';
import { useDispatch, useSelector } from '@store';
import { useGetCustomRoleQuery } from '@store/apis/firebot/getCustomRole';
import { useGetGuestStarSessionQuery } from '@store/apis/twitch/getGuestStarSession';
import { useLazyGetStreamsQuery } from '@store/apis/twitch/getStreams';
import { useLazyGetUserChatColorsQuery } from '@store/apis/twitch/getUserChatColors';
import { useLazyGetUsersQuery } from '@store/apis/twitch/getUsers';
import { useLazyGetViewersQuery } from '@store/apis/firebot/getViewers';

export const PersonBox = () => {
  const dispatch = useDispatch();
  const { broadcasterId, personIds, persons } = useSelector(({ info }) => info);
  const {
    data: customRoleData,
    // error: customRoleError,
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
  const [getViewers, { data: viewersData /* error: viewersError */ }] = useLazyGetViewersQuery();
  const [addViewerToCustomRole] = useAddViewerToCustomRoleMutation();
  const activePersonIntervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const isLoading = isGuestStarSessionLoading || isStreamsLoading || isUserChatColorsLoading || isUsersLoading;
  const isRenderable = !!(guestStarSessionData && streamsData && userChatColorsData && usersData);

  const cssContainer = css`
    position: relative;
    flex: 3;
    filter: drop-shadow(#000000 0 0 calc(var(--padding) * 0.75));
  `;
  const cssDivMarker = css`
    position: absolute;
    width: calc(var(--padding) * 0.75);
    height: calc(var(--bar-height) - (var(--padding) * 2));
    margin: var(--padding) 0 var(--padding)
      calc((var(--padding) * ${persons.length}) + var(--bar-height) - var(--padding));
    background-color: ${persons.find(({ isActive }) => isActive)?.color || 'transparent'};
    transition:
      margin-left 0.5s,
      background-color 0.5s 0.5s;
  `;

  // Get supporting person data
  useEffect(() => {
    if (broadcasterId && guestStarSessionData) {
      const guestStarGuests = guestStarSessionData.data.map(({ guests }) => guests);
      const guestStarIds = guestStarGuests.length ? guestStarGuests[0].map(({ user_id: userId }) => userId) : [];
      const viewerIds = customRoleData ? customRoleData.viewers.map(({ id }) => id) : [];
      const allIds = [...new Set([broadcasterId, ...guestStarIds, ...viewerIds])];

      if (guestStarIds.length && customRoleData) {
        const missingViewerIds = guestStarIds.filter(
          (guestStarId) => !viewerIds.includes(guestStarId) && guestStarId !== broadcasterId,
        );

        missingViewerIds.forEach((missingViewerId) =>
          addViewerToCustomRole({ customRoleId: firebotGuestRoleId, userId: missingViewerId }),
        );
      }

      getStreams({ userIds: allIds });
      getUserChatColors({ userIds: allIds });
      getUsers({ ids: allIds });
      getViewers();
      dispatch(setInfo({ personIds: allIds }));
    }
  }, [
    broadcasterId,
    customRoleData,
    dispatch,
    getStreams,
    getUserChatColors,
    getUsers,
    getViewers,
    guestStarSessionData,
  ]);

  // Set persons if data exists
  useEffect(() => {
    if (personIds && streamsData && userChatColorsData && usersData) {
      dispatch(
        setInfo({
          persons: personIds.map((personId, i) => {
            const user = usersData.data.find(({ id }) => id === personId);
            let metadata = null;

            if (viewersData) ({ metadata } = viewersData.find(({ _id: id }) => id === personId) || {});

            return {
              id: user?.id,
              login: user?.login,
              profileImageUrl: user?.profile_image_url,
              name: metadata?.name || user?.display_name,
              color:
                userChatColorsData.data.find(({ user_id: userId }) => userId === personId)?.color ||
                metadata?.color ||
                '#808080',
              isActive: i === 0,
              isLive: !!streamsData.data.find(({ user_id: userId }) => userId === personId),
              pronouns: metadata?.pronouns,
              socialHandle: metadata?.socialHandle,
              socialPlatform: metadata?.socialPlatform,
              timeZone: metadata?.timeZone,
            };
          }),
        }),
      );

      clearInterval(activePersonIntervalIdRef.current);
      activePersonIntervalIdRef.current = setInterval(() => dispatch(rotatePersonisActive()), 30 * 1000);

      return () => clearInterval(activePersonIntervalIdRef.current);
    }
  }, [activePersonIntervalIdRef, dispatch, personIds, streamsData, userChatColorsData, usersData, viewersData]);

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return false;

  // Render component
  return (
    <FlexContainer cssContainer={cssContainer}>
      <div css={cssDivMarker}></div>
      {persons.length ? persons.map((person) => <PersonInfo key={person.id} person={person} />) : null}
    </FlexContainer>
  );
};
