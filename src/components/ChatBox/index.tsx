import useWebSocket from 'react-use-websocket';
import { css } from '@emotion/react';
import { useEffect } from 'react';

import type { TwitchEventSubChatBoxMessage } from '@components/ChatBox/types';

import { addTwitchEventSubMessageId } from '@store/slices/twitchEventSub';
import { useDispatch, useSelector } from '@store';
import { useCreateEventSubSubscriptionQuery } from '@store/apis/twitch/createEventSubSubscription';
import { ChatMessage } from '@components/ChatMessage';
import { FlexContainer } from '@components/shared/FlexContainer';
import { addChat } from '@store/slices/info';

export const ChatBox = () => {
  const dispatch = useDispatch();
  const { lastJsonMessage: twitchMessage } = useWebSocket<TwitchEventSubChatBoxMessage>('wss://eventsub.wss.twitch.tv/ws', { share: true });
  const { broadcasterId, chats } = useSelector(({ info }) => info);
  const { messageIds: twitchMessageIds, sessionId } = useSelector(({ twitchEventSub }) => twitchEventSub);
  const { data: eventSubSubscriptionData, error: eventSubSubscriptionError, isLoading: isEventSubSubscriptionLoading } = useCreateEventSubSubscriptionQuery({ broadcasterId, sessionId, type: 'channel.chat.message', version: 1 });
  const isRenderable = !!(eventSubSubscriptionData);
  const cssContainer = css`
    flex: 2;
  `;

  // Set chats on new channel chat message notification 
  useEffect(() => {
    if (twitchMessage) {
      const { metadata, payload } = twitchMessage;
      const { message_id: messageId, message_type: messageType } = metadata;

      if (!twitchMessageIds.includes(messageId) && messageType === 'notification' && 'subscription_type' in metadata) {
        const { subscription_type: subscriptionType } = metadata;

        if (subscriptionType === 'channel.chat.message' && 'event' in payload) {
          dispatch(addChat(payload.event));
          dispatch(addTwitchEventSubMessageId(messageId));
        }
      }
    }
  }, [dispatch, twitchMessage, twitchMessageIds]);


  // Render nothing if data is loading or required data is incomplete
  if (isEventSubSubscriptionLoading || !isRenderable) return null;

  // Render component
  return (
    <FlexContainer column cssContainer={ cssContainer }>
      { chats.map((chat, i) => (
        <ChatMessage key={ i } event={ chat } />
      )) }
    </FlexContainer>
  );
};
