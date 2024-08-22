import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import useWebSocket from 'react-use-websocket';
import { Fragment, useEffect, useState } from 'react';

import type { ChatBoxChat, TwitchEventSubChatBoxMessage } from '@components/ChatBox/types';
import type { TwitchApiErrorResponse } from '@store/apis/twitch';

import { addTwitchEventSubMessageId } from '@store/slices/twitchEventSub';
import { useDispatch, useSelector } from '@store/hooks';
import { useCreateEventSubSubscriptionQuery } from '@store/apis/twitch/createEventSubSubscription';
import { useLazyGetChannelEmotesQuery } from '@store/apis/twitch/getChannelEmotes';
import { useLazyGetEmoteSetsQuery } from '@store/apis/twitch/getEmoteSets';
import { useLazyGetGlobalEmotesQuery } from '@store/apis/twitch/getGlobalEmotes';

export const ChatBox = () => {
  const dispatch = useDispatch();
  const { lastJsonMessage: newMessage } = useWebSocket<TwitchEventSubChatBoxMessage>('wss://eventsub.wss.twitch.tv/ws', { share: true });
  const { user } = useSelector(({ twitchInfo }) => twitchInfo);
  const { messageIds, sessionId } = useSelector(({ twitchEventSub }) => twitchEventSub);
  const { error: eventSubSubscriptionError, isLoading: isEventSubSubscriptionLoading } = useCreateEventSubSubscriptionQuery({ broadcasterId: user.id, sessionId, type: 'channel.chat.message', version: 1 });
  const [getChannelEmotesQuery] = useLazyGetChannelEmotesQuery();
  const [getEmoteSetsQuery] = useLazyGetEmoteSetsQuery();
  const [getGloablEmotesQuery] = useLazyGetGlobalEmotesQuery();
  const [chats, setChats] = useState<ChatBoxChat[]>([]);

  // Update chats on new channel chat message notification 
  useEffect(() => {
    if (newMessage) {
      const { metadata, payload } = newMessage;
      const { message_id: messageId, message_type: messageType } = metadata;

      if (!messageIds.includes(messageId) && messageType === 'notification' && 'subscription_type' in metadata && 'event' in payload) {
        const { subscription_type: subscriptionType } = metadata;
        const { event } = payload;

        if (subscriptionType === 'channel.chat.message') {
          (async () => {
            const emoteFragments = event.message.fragments.filter(({ type }) => type === 'emote').map(({ emote }) => emote);
            let emotes = [];

            if (emoteFragments.length) {
              const emoteIds = emoteFragments.map(({ id }) => id);
              const emoteSetIds = emoteFragments.map(({ emote_set_id: emoteSetId }) => emoteSetId);
              const [{ data: globalEmotesData }, { data: channelEmotesData }, { data: emoteSetsData }] = await Promise.all([
                getGloablEmotesQuery(),
                getChannelEmotesQuery({ broadcasterId: user.id }),
                getEmoteSetsQuery({ emoteSetIds }),
              ]);
              const emotesData = [...globalEmotesData.data, ...channelEmotesData.data, ...emoteSetsData.data];
              const { template } = globalEmotesData;

              emotes = emotesData.filter(({ id }) => emoteIds.includes(id)).map((emote) => {
                const format = (emote.format.includes('animated')) ? 'animated' : 'static';
                const url = template.replace('{{id}}', emote.id).replace('{{format}}', format).replace('{{theme_mode}}', 'dark').replace('{{scale}}', '3.0');

                return { ...emote, url };
              });
            }

            const messageJsx = (
              <Fragment>
                { 
                  event.message.fragments.map((fragment, i) => {
                    const style = (fragment.type === 'mention') ? { fontWeight: 'bold' } : {};
                    const { url } = emotes.find((emote) => emote.id === fragment.emote?.id) || {};

                    if (url) return <img key={ i } src={ url } />;
                    return <span key={ i } style={ style }>{ fragment.text }</span>;
                  })
                }
              </Fragment>
            )

            setChats((prev) => [...prev, { ...event, messageJsx }]);
            dispatch(addTwitchEventSubMessageId(messageId));
          })();
        }
      }
    }
  }, [dispatch, setChats, messageIds, newMessage, user.id]);

  // Render nothing if data is loading
  if (isEventSubSubscriptionLoading) return null;

  // Render warning if data errors unexpectedly
  if (eventSubSubscriptionError && 'status' in eventSubSubscriptionError) {
    const { data, status } = eventSubSubscriptionError as FetchBaseQueryError & { data: TwitchApiErrorResponse };
    let errorMessage = `[Channel Chat Message Error ${status}]`;

    if ('error' in data) errorMessage += ` ${data.error}`;
    errorMessage += `: ${data.message}`;

    return <p style={ { fontWeight: 'bold', color:'#ff0000' } }>{ errorMessage }</p>;
  };

  // Render component
  return (
    <Fragment>
      { chats.map((chat) => (
        <p key={ chat.message_id }><span style={ { fontWeight: 'bold', color: chat.color || '#808080' } }>{ chat.chatter_user_name }</span>: { chat.messageJsx }</p>
      )) }
    </Fragment>
  );
};
