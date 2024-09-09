import useWebSocket from 'react-use-websocket';
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import * as uuid from 'uuid';

import type { FirebotEventSubMessage } from '@store/apis/firebot';
import type { TwitchEventSubMessage } from '@components/types';

import { FlexContainer } from '@components/shared/FlexContainer';
import { PersonInfo } from '@components/PersonInfo';
import { addFirebotEventSubMessageId } from '@store/slices/firebotEventSub';
import { addTwitchEventSubMessageId } from '@store/slices/twitchEventSub';
import { firebotGuestRoleId, namespace } from '@config';
import { rotatePersonisActive, setInfo } from '@store/slices/info';
import { useAddViewerToCustomRoleMutation } from '@store/apis/firebot/addViewerToCustomRole';
import { useCreateEventSubSubscriptionChannelGuestStarGuestUpdateQuery } from '@store/apis/twitch/createEventSubSubscription/channelGuestStarGuestUpdate';
import { useCreateEventSubSubscriptionChannelGuestStarSessionBeginQuery } from '@store/apis/twitch/createEventSubSubscription/channelGuestStarSessionBegin';
import { useCreateEventSubSubscriptionChannelGuestStarSessionEndQuery } from '@store/apis/twitch/createEventSubSubscription/channelGuestStarSessionEnd';
import { useDispatch, useSelector } from '@store';
import { useGetCustomRoleQuery } from '@store/apis/firebot/getCustomRole';
import { useGetGuestStarSessionQuery } from '@store/apis/twitch/getGuestStarSession';
import { useLazyGetStreamsQuery } from '@store/apis/twitch/getStreams';
import { useLazyGetUserChatColorsQuery } from '@store/apis/twitch/getUserChatColors';
import { useLazyGetUsersQuery } from '@store/apis/twitch/getUsers';
import { useLazyGetViewersQuery } from '@store/apis/firebot/getViewers';

export const PersonBox = () => {
  const dispatch = useDispatch();
  const { broadcasterId, persons } = useSelector(({ info }) => info);
  const { messageIds: firebotMessageIds } = useSelector(({ firebotEventSub }) => firebotEventSub);
  const { messageIds: twitchMessageIds, sessionId } = useSelector(({ twitchEventSub }) => twitchEventSub);
  const { lastJsonMessage: firebotMessage } = useWebSocket<FirebotEventSubMessage>('ws://localhost:7472', {
    reconnectAttempts: 100,
    reconnectInterval: (attempt = 0) => ~~((Math.random() + 0.4) * (300 << attempt)),
    retryOnError: true,
    share: true,
    shouldReconnect: () => true,
  });
  const { lastJsonMessage: twitchMessage } = useWebSocket<TwitchEventSubMessage>('wss://eventsub.wss.twitch.tv/ws', {
    share: true,
  });
  const {
    data: customRoleData,
    // error: customRoleError,
    refetch: refetchCustomRole,
  } = useGetCustomRoleQuery({ customRoleId: firebotGuestRoleId });
  const {
    data: eventSubSubscriptionChannelGuestStarGuestUpdateData,
    // error: eventSubSubscriptionChannelGuestStarGuestUpdateError,
    isLoading: isEventSubSubscriptionChannelGuestStarGuestUpdateLoading,
  } = useCreateEventSubSubscriptionChannelGuestStarGuestUpdateQuery({
    broadcasterId,
    sessionId,
  });
  const {
    data: eventSubSubscriptionChannelGuestStarSessionBeginData,
    // error: eventSubSubscriptionChannelGuestStarSessionBeginError,
    isLoading: isEventSubSubscriptionChannelGuestStarSessionBeginLoading,
  } = useCreateEventSubSubscriptionChannelGuestStarSessionBeginQuery({
    broadcasterId,
    sessionId,
  });
  const {
    data: eventSubSubscriptionChannelGuestStarSessionEndData,
    // error: eventSubSubscriptionChannelGuestStarSessionEndError,
    isLoading: isEventSubSubscriptionChannelGuestStarSessionEndLoading,
  } = useCreateEventSubSubscriptionChannelGuestStarSessionEndQuery({
    broadcasterId,
    sessionId,
  });
  const {
    data: guestStarSessionData,
    // error: guestStarSessionError,
    isLoading: isGuestStarSessionLoading,
    refetch: refetchGuestStarSession,
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
  const [personIds, setPersonIds] = useState<string[]>([]);
  const [activePersonIntervalId, setActivePersonIntervalId] = useState<NodeJS.Timeout | null>(null);
  const isLoading =
    isEventSubSubscriptionChannelGuestStarGuestUpdateLoading ||
    isEventSubSubscriptionChannelGuestStarSessionBeginLoading ||
    isEventSubSubscriptionChannelGuestStarSessionEndLoading ||
    isGuestStarSessionLoading ||
    isStreamsLoading ||
    isUserChatColorsLoading ||
    isUsersLoading;
  const isRenderable = !!(
    eventSubSubscriptionChannelGuestStarGuestUpdateData &&
    eventSubSubscriptionChannelGuestStarSessionBeginData &&
    eventSubSubscriptionChannelGuestStarSessionEndData &&
    guestStarSessionData &&
    streamsData &&
    userChatColorsData &&
    usersData
  );
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
    if (
      broadcasterId &&
      eventSubSubscriptionChannelGuestStarGuestUpdateData &&
      eventSubSubscriptionChannelGuestStarSessionBeginData &&
      eventSubSubscriptionChannelGuestStarSessionEndData &&
      guestStarSessionData
    ) {
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
      setPersonIds(allIds);
    }
  }, [
    broadcasterId,
    customRoleData,
    eventSubSubscriptionChannelGuestStarGuestUpdateData,
    eventSubSubscriptionChannelGuestStarSessionBeginData,
    eventSubSubscriptionChannelGuestStarSessionEndData,
    getStreams,
    getUserChatColors,
    getUsers,
    getViewers,
    guestStarSessionData,
    setPersonIds,
  ]);

  // Set persons if data exists
  useEffect(() => {
    if (personIds && streamsData && userChatColorsData && usersData) {
      dispatch(
        setInfo({
          persons: personIds.map((personId, i) => {
            const user = usersData.data.find(({ id }) => id === personId);
            let metadata = null;

            if (viewersData) ({ metadata } = viewersData.find(({ _id: id }) => id === personId)) || {};

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

      clearInterval(activePersonIntervalId);
      setActivePersonIntervalId(setInterval(() => dispatch(rotatePersonisActive()), 5 * 1000));

      return () => clearInterval(activePersonIntervalId);
    }
  }, [
    // activePersonIntervalId,
    dispatch,
    personIds,
    setActivePersonIntervalId,
    streamsData,
    userChatColorsData,
    usersData,
    viewersData,
  ]);

  // Handle firebot event sub messages
  useEffect(() => {
    if (firebotMessage) {
      const messageId = uuid.v5(JSON.stringify(firebotMessage), namespace);
      const { type, name } = firebotMessage;

      if (!firebotMessageIds.includes(messageId) && type === 'event') {
        if (name === 'custom-role:updated') {
          refetchCustomRole();
          dispatch(addFirebotEventSubMessageId(messageId));
        } else if (
          name === 'viewer-metadata:created' ||
          name === 'viewer-metadata:updated' ||
          name === 'viewer-metadata:deleted'
        ) {
          getViewers();
          dispatch(addFirebotEventSubMessageId(messageId));
        }
      }
    }
  }, [dispatch, firebotMessage, firebotMessageIds]);

  // Handle twitch event sub messages
  useEffect(() => {
    if (twitchMessage) {
      const { metadata, payload } = twitchMessage;
      const { message_id: messageId, message_type: messageType } = metadata;

      if (!twitchMessageIds.includes(messageId) && messageType === 'notification' && 'event' in payload) {
        const { subscription_type: subscriptionType } = metadata;

        if (
          subscriptionType === 'channel.guest_star_guest.update' ||
          subscriptionType === 'channel.guest_star_session.begin' ||
          subscriptionType === 'channel.guest_star_session.end'
        ) {
          refetchGuestStarSession();
          dispatch(addTwitchEventSubMessageId(messageId));
        } else if (subscriptionType === 'stream.online' || subscriptionType === 'stream.offline') {
          getStreams({ userIds: personIds });
          dispatch(addTwitchEventSubMessageId(messageId));
        }
      }
    }
  }, [broadcasterId, dispatch, personIds, twitchMessage, twitchMessageIds]);

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return null;

  // Render component
  return (
    <FlexContainer cssContainer={cssContainer}>
      <div css={cssDivMarker}></div>
      {persons.length ? persons.map((person) => <PersonInfo key={person.id} person={person} />) : null}
    </FlexContainer>
  );
};
