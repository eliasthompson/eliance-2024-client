import useWebSocket from 'react-use-websocket';
import { useEffect } from 'react';
import { css } from '@emotion/react';
// import * as uuid from 'uuid';

// import type { FirebotEventSubMessage } from '@store/apis/firebot';
import type { TwitchEventSubMessage } from '@components/types';

import { FlexContainer } from '@components/shared/FlexContainer';
// import { addFirebotEventSubMessageId } from '@store/slices/firebotEventSub';
import { addTwitchEventSubMessageId } from '@store/slices/twitchEventSub';
import { firebotGuestRoleId } from '@config';
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

export const EventBox = () => {
  const dispatch = useDispatch();
  const { broadcasterId } = useSelector(({ info }) => info);
  // const { messageIds: firebotMessageIds } = useSelector(({ firebotEventSub }) => firebotEventSub);
  const { messageIds: twitchMessageIds, sessionId } = useSelector(({ twitchEventSub }) => twitchEventSub);
  // const { lastJsonMessage: firebotMessage } = useWebSocket<FirebotEventSubMessage>('ws://localhost:7472', {
  //   share: true,
  // });
  const { lastJsonMessage: twitchMessage } = useWebSocket<TwitchEventSubMessage>('wss://eventsub.wss.twitch.tv/ws', {
    share: true,
  });
  const {
    data: customRoleData,
    error: customRoleError,
    isLoading: isCustomRoleLoading,
    // refetch: refetchCustomRole,
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
  const [getViewers, { data: viewersData, error: viewersError, isLoading: isViewersLoading }] =
    useLazyGetViewersQuery();
  const [addViewerToCustomRole] = useAddViewerToCustomRoleMutation();
  const isLoading =
    isCustomRoleLoading ||
    isEventSubSubscriptionChannelGuestStarGuestUpdateLoading ||
    isEventSubSubscriptionChannelGuestStarSessionBeginLoading ||
    isEventSubSubscriptionChannelGuestStarSessionEndLoading ||
    isGuestStarSessionLoading ||
    isStreamsLoading ||
    isUserChatColorsLoading ||
    isUsersLoading ||
    isViewersLoading;
  const isRenderable = !!(
    eventSubSubscriptionChannelGuestStarGuestUpdateData &&
    eventSubSubscriptionChannelGuestStarSessionBeginData &&
    eventSubSubscriptionChannelGuestStarSessionEndData &&
    guestStarSessionData &&
    streamsData &&
    userChatColorsData &&
    usersData &&
    (viewersData || viewersError)
  );
  const cssContainer = css`
    flex: 2;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(#000000 0 0 calc(var(--padding) * 0.75));
  `;

  // Get supporting person data
  useEffect(() => {
    if (broadcasterId && (customRoleData || customRoleError) && guestStarSessionData) {
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
    }
  }, [
    broadcasterId,
    customRoleData,
    customRoleError,
    getStreams,
    getUserChatColors,
    getUsers,
    getViewers,
    guestStarSessionData,
  ]);

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
        }
      }
    }
  }, [broadcasterId, dispatch, twitchMessage, twitchMessageIds]);

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return null;

  // Render component
  return <FlexContainer cssContainer={cssContainer}>sup</FlexContainer>;
};
