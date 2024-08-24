import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { ReactNode } from 'react';

import useWebSocket from 'react-use-websocket';
import { Fragment, useEffect, useState } from 'react';

import type { TwitchChatBoxBadge, TwitchChatBoxEmote, TwitchEventSubChatBoxMessage } from '@components/ChatBox/types';
import type { TwitchApiErrorResponse } from '@store/apis/twitch';

import { addTwitchEventSubMessageId } from '@store/slices/twitchEventSub';
import { useDispatch, useSelector } from '@store/hooks';
import { useCreateEventSubSubscriptionQuery } from '@store/apis/twitch/createEventSubSubscription';
import { useGetChannelChatBadgesQuery } from '@store/apis/twitch/getChannelChatBadges';
import { useGetChannelEmotesQuery } from '@store/apis/twitch/getChannelEmotes';
import { useGetGlobalChatBadgesQuery } from '@store/apis/twitch/getGlobalChatBadges';
import { useGetGlobalEmotesQuery } from '@store/apis/twitch/getGlobalEmotes';
import { useLazyGetEmoteSetsQuery } from '@store/apis/twitch/getEmoteSets';

export const ChatBox = () => {
  const dispatch = useDispatch();
  const { lastJsonMessage: newMessage } = useWebSocket<TwitchEventSubChatBoxMessage>('wss://eventsub.wss.twitch.tv/ws', { share: true });
  const { user } = useSelector(({ info }) => info);
  const { messageIds, sessionId } = useSelector(({ twitchEventSub }) => twitchEventSub);
  const { error: eventSubSubscriptionError, isLoading: isEventSubSubscriptionLoading } = useCreateEventSubSubscriptionQuery({ broadcasterId: user.id, sessionId, type: 'channel.chat.message', version: 1 });
  const { data: channelChatBadgesData, error: channelChatBadgesError, isLoading: isChannelChatBadgesLoading } = useGetChannelChatBadgesQuery({ broadcasterId: user.id });
  const { data: channelEmotesData, error: channelEmotesError, isLoading: isChannelEmotesLoading } = useGetChannelEmotesQuery({ broadcasterId: user.id });
  const { data: globalChatBadgesData, error: globalChatBadgesError, isLoading: isGlobalChatBadgesLoading } = useGetGlobalChatBadgesQuery();
  const { data: globalEmotesData, error: globalEmotesError, isLoading: isGlobalEmotesLoading } = useGetGlobalEmotesQuery();
  const [getEmoteSetsQuery] = useLazyGetEmoteSetsQuery();
  const [chatMessages, setChatMessages] = useState<ReactNode[]>([]);
  const isError = (
    eventSubSubscriptionError
    || channelChatBadgesError
    || channelEmotesError
    || globalChatBadgesError
    || globalEmotesError
  );
  const isLoading = (
    isEventSubSubscriptionLoading
    || isChannelChatBadgesLoading
    || isChannelEmotesLoading
    || isGlobalChatBadgesLoading
    || isGlobalEmotesLoading
  );
  const isRenderable = (
    !isLoading
    && !isError
    && channelChatBadgesData
    && channelEmotesData
    && globalChatBadgesData
    && globalEmotesData
  );

  // Update chats on new channel chat message notification 
  useEffect(() => {
    if (isRenderable && newMessage) {
      const { metadata, payload } = newMessage;
      const { message_id: messageId, message_type: messageType } = metadata;

      if (!messageIds.includes(messageId) && messageType === 'notification' && 'subscription_type' in metadata) {
        const { subscription_type: subscriptionType } = metadata;

        if (subscriptionType === 'channel.chat.message' && 'event' in payload) {
          (async () => {
            const { event } = payload;
            const { badges: messageBadges, message } = event;
            const { fragments } = message;
            const messageEmotes = fragments.filter(({ type }) => type === 'emote').map(({ emote }) => emote);
            let badges: TwitchChatBoxBadge[] = [...globalChatBadgesData.data, ...channelChatBadgesData.data].reduce((acc: TwitchChatBoxBadge[], { set_id: setId, versions }) => [
              ...acc,
              ...versions.map((version) => ({ ...version, set_id: setId })),
            ], []);
            let emotes: TwitchChatBoxEmote[] = [];

            if (messageEmotes.length) {
              const emoteIds = messageEmotes.map(({ id }) => id);
              const emoteSetIds = messageEmotes.map(({ emote_set_id: emoteSetId }) => emoteSetId);
              const { data: emoteSetsData } = await getEmoteSetsQuery({ emoteSetIds });
              const emotesData = [...globalEmotesData.data, ...channelEmotesData.data, ...emoteSetsData.data];
              const { template } = globalEmotesData;

              emotes = emotesData.filter(({ id }) => emoteIds.includes(id)).map((emote) => {
                const format = (emote.format.includes('animated')) ? 'animated' : 'static';
                const url = template.replace('{{id}}', emote.id).replace('{{format}}', format).replace('{{theme_mode}}', 'dark').replace('{{scale}}', '3.0');

                return { ...emote, url };
              });
            }

            const chatMessage = (
              <p>
                { 
                  messageBadges.map((messageBadge, i) => {
                    const { image_url_4x: imageUrl4x } = badges.find(({ id, set_id: setId }) => id === messageBadge.id && setId === messageBadge.set_id) || {};

                    if (imageUrl4x) return <img key={ i } src={ imageUrl4x } />;
                    return null;
                  })
                }

                <strong style={ { color: event.color || '#808080' } }>
                  { event.chatter_user_name }
                </strong>:&nbsp;

                { 
                  fragments.map((fragment, i) => {
                    const { url } = emotes.find(({ id }) => id === fragment.emote?.id) || {};

                    if (url) return <img key={ i } src={ url } />;
                    if (fragment.type === 'mention') return <strong key={ i }>{ fragment.text }</strong>;
                    return <span key={ i }>{ fragment.text }</span>;
                  })
                }
              </p>
            )

            setChatMessages((prev) => [...prev, chatMessage]);
            dispatch(addTwitchEventSubMessageId(messageId));
          })();
        }
      }
    }
  }, [channelChatBadgesData, channelEmotesData, dispatch, globalChatBadgesData, globalEmotesData, isRenderable, messageIds, newMessage, setChatMessages]);

  // Render nothing if data is incomplete
  if (!isRenderable && !eventSubSubscriptionError) return null;

  // Render warning if data errors unexpectedly
  if (eventSubSubscriptionError && 'status' in eventSubSubscriptionError) {
    const { data, status } = eventSubSubscriptionError as FetchBaseQueryError & { data: TwitchApiErrorResponse };
    let errorMessage = `[Channel Chat Message Error ${status}]`;

    if ('error' in data) errorMessage += ` ${data.error}`;
    errorMessage += `: ${data.message}`;

    return (
      <p style={ { fontWeight: 'bold', color:'#ff0000' } }>{ errorMessage }</p>
    );
  };

  // Render component
  return (
    <div>
      { chatMessages.map((chatMessage, i) => (
        <Fragment key={ i }>
          { chatMessage }
        </Fragment>
      )) }
    </div>
  );
};
