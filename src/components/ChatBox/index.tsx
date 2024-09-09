import useWebSocket from 'react-use-websocket';
import { css } from '@emotion/react';
import { useCallback, useEffect, useState } from 'react';
import * as uuid from 'uuid';

import type { TwitchEventSubMessage, TwitchPubSubMessage } from '@components/types';
import type { TwitchPubSubPinnedChatUpdatesMessageMessage } from '@components/ChatBox/types';

import { ChatMessage } from '@components/ChatMessage';
import { EmoteIcon } from '@components/shared/svgs/EmoteIcon';
import { FlexContainer } from '@components/shared/FlexContainer';
import { FollowerIcon } from '@components/shared/svgs/FollowerIcon';
import {
  addChat,
  clearChats,
  removeChatPinId,
  setChatDeletedTimestamp,
  setChatPinId,
  setUserChatsDeletedTimestamp,
} from '@store/slices/info';
import { addTwitchEventSubMessageId } from '@store/slices/twitchEventSub';
import { updateChatSettingsData, useGetChatSettingsQuery } from '@store/apis/twitch/getChatSettings';
import { useDispatch, useSelector } from '@store';
import { useCreateEventSubSubscriptionChannelChatClearQuery } from '@store/apis/twitch/createEventSubSubscription/channelChatClear';
import { useCreateEventSubSubscriptionChannelChatClearUserMessagesQuery } from '@store/apis/twitch/createEventSubSubscription/channelChatClearUserMessages';
import { useCreateEventSubSubscriptionChannelChatMessageQuery } from '@store/apis/twitch/createEventSubSubscription/channelChatMessage';
import { useCreateEventSubSubscriptionChannelChatMessageDeleteQuery } from '@store/apis/twitch/createEventSubSubscription/channelChatMessageDelete';
import { useCreateEventSubSubscriptionChannelChatNotificationQuery } from '@store/apis/twitch/createEventSubSubscription/channelChatNotification';
import { useCreateEventSubSubscriptionChannelChatSettingsUpdateQuery } from '@store/apis/twitch/createEventSubSubscription/channelChatSettingsUpdate';

export const ChatBox = () => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector(({ twitchAuth }) => twitchAuth);
  const { broadcasterId, chats } = useSelector(({ info }) => info);
  const { messageIds: twitchMessageIds, sessionId } = useSelector(({ twitchEventSub }) => twitchEventSub);
  const { lastJsonMessage: twitchMessage } = useWebSocket<TwitchEventSubMessage>('wss://eventsub.wss.twitch.tv/ws', {
    share: true,
  });
  const {
    lastJsonMessage: twitchPSMessage,
    readyState: twitchPSReadyState,
    sendJsonMessage: sendTwitchPSMessage,
  } = useWebSocket<TwitchPubSubMessage>('wss://pubsub-edge.twitch.tv', {
    share: true,
  });
  const {
    data: eventSubSubscriptionChannelChatClearData,
    // error: eventSubSubscriptionChannelChatClearError,
    isLoading: isEventSubSubscriptionChannelChatClearLoading,
  } = useCreateEventSubSubscriptionChannelChatClearQuery({
    broadcasterId,
    sessionId,
  });
  const {
    data: eventSubSubscriptionChannelChatClearUserMessagesData,
    // error: eventSubSubscriptionChannelChatClearUserMessagesError,
    isLoading: isEventSubSubscriptionChannelChatClearUserMessagesLoading,
  } = useCreateEventSubSubscriptionChannelChatClearUserMessagesQuery({
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
    data: eventSubSubscriptionChannelChatMessageDeleteData,
    // error: eventSubSubscriptionChannelChatMessageDeleteError,
    isLoading: isEventSubSubscriptionChannelChatMessageDeleteLoading,
  } = useCreateEventSubSubscriptionChannelChatMessageDeleteQuery({
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
  const [, setUnpinTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const handleResetUnpinTimeout = useCallback(
    ({ pinId, updatedAt, endsAt }: { pinId?: string; updatedAt?: number; endsAt?: number } = {}) => {
      setUnpinTimeoutId((state) => {
        clearTimeout(state);

        if (pinId && endsAt && updatedAt) {
          return setTimeout(
            () => {
              dispatch(removeChatPinId({ pinId }));
            },
            (endsAt - updatedAt) * 1000,
          );
        }

        return state;
      });
    },
    [dispatch, setUnpinTimeoutId],
  );
  const isLoading =
    isEventSubSubscriptionChannelChatClearLoading ||
    isEventSubSubscriptionChannelChatClearUserMessagesLoading ||
    isEventSubSubscriptionChannelChatMessageLoading ||
    isEventSubSubscriptionChannelChatMessageDeleteLoading ||
    isEventSubSubscriptionChannelChatNotificationLoading ||
    isEventSubSubscriptionChannelChatSettingsUpdateLoading ||
    isChatSettingsLoading;
  const isRenderable = !!(
    eventSubSubscriptionChannelChatClearData &&
    eventSubSubscriptionChannelChatClearUserMessagesData &&
    eventSubSubscriptionChannelChatMessageData &&
    eventSubSubscriptionChannelChatMessageDeleteData &&
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

  // Subscribe to twitch pub sub pinned chat updates on first connection
  useEffect(() => {
    if (twitchPSReadyState === 1) {
      const nonce = uuid.v4();

      sendTwitchPSMessage({
        type: 'LISTEN',
        nonce,
        data: {
          topics: [`pinned-chat-updates-v1.${broadcasterId}`],
          auth_token: accessToken,
        },
      });
    }
  }, [twitchPSReadyState, sendTwitchPSMessage]);

  // Handle twitch pub sub messages
  useEffect(() => {
    if (twitchPSMessage) {
      if (twitchPSMessage.type === 'MESSAGE') {
        try {
          const message = JSON.parse(twitchPSMessage.data.message);

          if (twitchPSMessage.data.topic === `pinned-chat-updates-v1.${broadcasterId}`) {
            const { type, data }: TwitchPubSubPinnedChatUpdatesMessageMessage = message;

            if (type === 'pin-message') {
              handleResetUnpinTimeout({
                pinId: data.id,
                updatedAt: data.message.updated_at,
                endsAt: data.message.ends_at,
              });
              dispatch(setChatPinId({ messageId: data.message.id, pinId: data.id }));
            } else if (type === 'update-message') {
              handleResetUnpinTimeout({ pinId: data.id, updatedAt: data.updated_at, endsAt: data.ends_at });
            } else if (type === 'unpin-message') {
              handleResetUnpinTimeout();
              dispatch(removeChatPinId({ pinId: data.id }));
            }
          }
        } catch (error) {
          //
        }
      }
    }
  }, [dispatch, handleResetUnpinTimeout, twitchPSMessage]);

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
            updateChatSettingsData('getChatSettings', { broadcasterId }, (state) => {
              const { broadcaster_user_id, broadcaster_user_login, broadcaster_user_name, ...eventData } = event;
              if (state) Object.assign(state.data[0], eventData);
            }),
          );
          dispatch(addTwitchEventSubMessageId(messageId));
        } else if (subscriptionType === 'channel.chat.clear') {
          dispatch(clearChats());
          dispatch(addTwitchEventSubMessageId(messageId));
        } else if (subscriptionType === 'channel.chat.clear_user_messages') {
          if ('target_user_id' in event) {
            dispatch(
              setUserChatsDeletedTimestamp({
                chatterUserId: event.target_user_id,
                deletedTimestamp: metadata.message_timestamp,
              }),
            );
            dispatch(addTwitchEventSubMessageId(messageId));
          }
        } else if (subscriptionType === 'channel.chat.message_delete') {
          if ('message_id' in event) {
            dispatch(
              setChatDeletedTimestamp({ messageId: event.message_id, deletedTimestamp: metadata.message_timestamp }),
            );
            dispatch(addTwitchEventSubMessageId(messageId));
          }
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
