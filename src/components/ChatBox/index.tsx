import useWebSocket from 'react-use-websocket';
import { css } from '@emotion/react';
import { useEffect } from 'react';

import type { TwitchEventSubMessage } from '@components/types';

import { ChatMessage } from '@components/ChatMessage';
import { EmoteIcon } from '@components/shared/svgs/EmoteIcon';
import { FlexContainer } from '@components/shared/FlexContainer';
import { FollowerIcon } from '@components/shared/svgs/FollowerIcon';
// import { SubscriberIcon } from '@components/shared/svgs/SubscriberIcon';
import { addChat, clearChats } from '@store/slices/info';
import { addTwitchEventSubMessageId } from '@store/slices/twitchEventSub';
import { getChatSettingsUtil, useGetChatSettingsQuery } from '@store/apis/twitch/getChatSettings';
import { useDispatch, useSelector } from '@store';
import { useCreateEventSubSubscriptionChannelChatClearQuery } from '@store/apis/twitch/createEventSubSubscriptionChannelChatClear';
import { useCreateEventSubSubscriptionChannelChatMessageQuery } from '@store/apis/twitch/createEventSubSubscriptionChannelChatMessage';
import { useCreateEventSubSubscriptionChannelChatNotificationQuery } from '@store/apis/twitch/createEventSubSubscriptionChannelChatNotification';
import { useCreateEventSubSubscriptionChannelChatSettingsUpdateQuery } from '@store/apis/twitch/createEventSubSubscriptionChannelChatSettingsUpdate';

export const ChatBox = () => {
  const dispatch = useDispatch();
  const { lastJsonMessage: twitchMessage } = useWebSocket<TwitchEventSubMessage>('wss://eventsub.wss.twitch.tv/ws', {
    share: true,
  });
  const { broadcasterId, chats } = useSelector(({ info }) => info);
  const { messageIds: twitchMessageIds, sessionId } = useSelector(({ twitchEventSub }) => twitchEventSub);
  const {
    data: eventSubSubscriptionChannelChatClearData,
    // error: eventSubSubscriptionChannelChatClearError,
    isLoading: isEventSubSubscriptionChannelChatClearLoading,
  } = useCreateEventSubSubscriptionChannelChatClearQuery({
    broadcasterId,
    sessionId,
  });
  const {
    data: eventSubSubscriptionChannelChatMessageData,
    // error: eventSubSubscriptionChannelChatMessageError,
    isLoading: isEventSubSubscriptionChannelChatMessageLoading,
  } = useCreateEventSubSubscriptionChannelChatMessageQuery({
    broadcasterId,
    sessionId,
  });
  const {
    data: eventSubSubscriptionChannelChatNotificationData,
    // error: eventSubSubscriptionChannelChatNotificationError,
    isLoading: isEventSubSubscriptionChannelChatNotificationLoading,
  } = useCreateEventSubSubscriptionChannelChatNotificationQuery({
    broadcasterId,
    sessionId,
  });
  const {
    data: eventSubSubscriptionChannelChatSettingsUpdateData,
    // error: eventSubSubscriptionChannelChatSettingsUpdateError,
    isLoading: isEventSubSubscriptionChannelChatSettingsUpdateLoading,
  } = useCreateEventSubSubscriptionChannelChatSettingsUpdateQuery({
    broadcasterId,
    sessionId,
  });
  const {
    data: chatSettingsData,
    // error: chatSettingsError,
    isLoading: isChatSettingsLoading,
  } = useGetChatSettingsQuery({ broadcasterId });
  const isLoading =
    isEventSubSubscriptionChannelChatClearLoading ||
    isEventSubSubscriptionChannelChatMessageLoading ||
    isEventSubSubscriptionChannelChatNotificationLoading ||
    isEventSubSubscriptionChannelChatSettingsUpdateLoading ||
    isChatSettingsLoading;
  const isRenderable = !!(
    eventSubSubscriptionChannelChatClearData &&
    eventSubSubscriptionChannelChatMessageData &&
    eventSubSubscriptionChannelChatNotificationData &&
    eventSubSubscriptionChannelChatSettingsUpdateData &&
    chatSettingsData
  );
  const cssContainer = css`
    flex: 3;
  `;
  const cssContainerSettings = css`
    gap: calc(var(--padding) / 2);
    padding: var(--padding);
  `;
  const cssIconSettings = css`
    height: calc((var(--bar-height) - (var(--padding) * 2.5)) / 2);
    filter: drop-shadow(#000000 0 0 calc(var(--padding) * 0.75));
  `;
  const cssContainerMessages = css`
    flex: 1;
    gap: calc(var(--padding) / 4);
    justify-content: flex-end;
    line-height: calc((var(--bar-height) - (var(--padding) * 1.5)) / 3);
    padding: 0 0 var(--padding) var(--padding);
  `;

  // Handle twitch event sub messages
  useEffect(() => {
    if (twitchMessage) {
      const { metadata, payload } = twitchMessage;
      const { message_id: messageId, message_type: messageType } = metadata;

      if (!twitchMessageIds.includes(messageId) && messageType === 'notification' && 'event' in payload) {
        const { subscription_type: subscriptionType } = metadata;
        const { event } = payload;

        if (subscriptionType === 'channel.chat.message' || subscriptionType === 'channel.chat.notification') {
          if ('message' in event && event.message.text) {
            const { message_timestamp: messageTimestamp } = metadata;

            dispatch(addChat({ ...event, messageTimestamp }));
            dispatch(addTwitchEventSubMessageId(messageId));
          }
        } else if (subscriptionType === 'channel.chat_settings.update') {
          dispatch(
            getChatSettingsUtil.updateQueryData('getChatSettings', { broadcasterId }, (state) => {
              const { broadcaster_user_id, broadcaster_user_login, broadcaster_user_name, ...eventData } = event;
              if (state) Object.assign(state.data[0], eventData);
            }),
          );
          dispatch(addTwitchEventSubMessageId(messageId));
        } else if (subscriptionType === 'channel.chat.clear') {
          dispatch(clearChats());
          dispatch(addTwitchEventSubMessageId(messageId));
        }
      }
    }
  }, [broadcasterId, dispatch, twitchMessage, twitchMessageIds]);

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return null;

  // Render component
  return (
    <FlexContainer cssContainer={cssContainer}>
      <FlexContainer column cssContainer={cssContainerMessages}>
        {chats.map((chat, i) => (
          <ChatMessage key={i} event={chat} />
        ))}
      </FlexContainer>
      <FlexContainer column css={cssContainerSettings}>
        <FollowerIcon
          colored={chatSettingsData.data[0].follower_mode}
          filled={chatSettingsData.data[0].follower_mode}
          cssIcon={css`
            opacity: ${chatSettingsData.data[0].follower_mode ? 1 : 0.5};
            ${cssIconSettings.styles}
          `}
        />
        {/* <SubscriberIcon colored={ chatSettingsData.data[0].subscriber_mode } filled={ chatSettingsData.data[0].subscriber_mode } cssIcon={ css`opacity:${(chatSettingsData.data[0].subscriber_mode) ? 1 : 0.5} ; ${cssIconSettings.styles}` } /> */}
        <EmoteIcon
          colored={chatSettingsData.data[0].emote_mode}
          filled={chatSettingsData.data[0].emote_mode}
          cssIcon={css`
            opacity: ${chatSettingsData.data[0].emote_mode ? 1 : 0.5};
            ${cssIconSettings.styles}
          `}
        />
      </FlexContainer>
    </FlexContainer>
  );
};
