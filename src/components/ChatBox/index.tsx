import useWebSocket from 'react-use-websocket';
import { Fragment, useEffect, useState } from 'react';

import type { TwitchEventSubMessage, TwitchEventSubNotificationMessage } from '@types/twitchEventSub'

import { setTwitchAuth } from '@store/slices/twitchAuth';
import { useDispatch, useSelector } from '@store/hooks';
import { useCreateEventSubSubscriptionMutation } from '@store/apis/twitch/createEventSubSubscription';
import { useLazyGetChannelEmotesQuery } from '@store/apis/twitch/getChannelEmotes';
import { useLazyGetEmoteSetsQuery } from '@store/apis/twitch/getEmoteSets';
import { useLazyGetGlobalEmotesQuery } from '@store/apis/twitch/getGlobalEmotes';

export interface TwitchEventSubChannelChatMessageNotificationMessage extends TwitchEventSubNotificationMessage {
  metadata: TwitchEventSubNotificationMessage['metadata'] & {
    subscription_type: 'channel.chat.message',
    subscription_version: '1',
  },
  payload: TwitchEventSubNotificationMessage['payload'] & {
    subscription: TwitchEventSubNotificationMessage['payload']['subscription'] & {
      type: 'channel.chat.message',
      version: '1',
      condition: {
        broadcaster_user_id: string,
        user_id: string,
      },
    },
    event: {
      broadcaster_user_id: string,
      broadcaster_user_login: string,
      broadcaster_user_name: string,
      chatter_user_id: string,
      chatter_user_login: string,
      chatter_user_name: string,
      message_id: string,
      message: {
        text: string,
        fragments: {
          type: 'text' | 'cheermote' | 'emote' | 'mention',
          text: string,
          cheermote: {
            prefix: string,
            bits: number,
            tier: number,
          } | null,
          emote: {
            id: string,
            emote_set_id: string,
            owner_id: string,
            format: ('static' | 'animated')[],
          } | null,
          mention: {
            user_id: string,
            user_name: string,
            user_login: string,
          } | null
        }[],
      },
      message_type: 'text' | 'channel_points_highlighted' | 'channel_points_sub_only' | 'user_intro' | 'power_ups_message_effect' | 'power_ups_gigantified_emote',
      badges: {
        set_id: string,
        id: string,
        info: string
      }[],
      cheer: {
        bits: number,
      } | null,
      color: string,
      reply: {
        parent_message_id: string,
        parent_message_body: string,
        parent_user_id: string,
        parent_user_name: string,
        parent_user_login: string,
        thread_message_id: string,
        thread_user_id: string,
        thread_user_name: string,
        thread_user_login: string,
      } | null,
      channel_points_custom_reward_id: string | null,
      channel_points_animation_id: string | null
    }
  },
};

export interface TwitchEventSubChannelChatMessageRevocationMessage extends TwitchEventSubChannelChatMessageNotificationMessage {
  metadata: TwitchEventSubChannelChatMessageNotificationMessage['metadata'] & {
    message_type: 'revocation',
  },
  payload: TwitchEventSubChannelChatMessageNotificationMessage['payload'] & {
    subscription: TwitchEventSubChannelChatMessageNotificationMessage['payload']['subscription'] & {
      status: 'authorization_revoked' | 'user_removed' | 'version_removed',
    },
    event: undefined,
  },
};

export type TwitchEventSubChatBoxMessage = TwitchEventSubMessage | TwitchEventSubChannelChatMessageNotificationMessage | TwitchEventSubChannelChatMessageRevocationMessage;

export const ChatBox = () => {
  const dispatch = useDispatch();
  const { lastJsonMessage: newMessage } = useWebSocket<TwitchEventSubChatBoxMessage>('wss://eventsub.wss.twitch.tv/ws', { share: true })
  const { broadcasterId, sessionId } = useSelector(({ twitchAuth }) => twitchAuth);
  const [createEventSubSubscription] = useCreateEventSubSubscriptionMutation();
  const [getChannelEmotesQuery] = useLazyGetChannelEmotesQuery();
  const [getEmoteSetsQuery] = useLazyGetEmoteSetsQuery();
  const [getGloablEmotesQuery] = useLazyGetGlobalEmotesQuery();
  const [chats, setChats] = useState<any[]>([]);
  const [messageIds, setMessageIds] = useState<string[]>([]);

  // Subscribe to channel chat messages on new session welcome
  useEffect(() => {
    if (newMessage) {
      const { metadata, payload } = newMessage;
      const { message_id: messageId, message_type: messageType } = metadata;

      if (!messageIds.includes(messageId) && messageType === 'session_welcome' && 'session' in payload) {
        (async () => {
          dispatch(setTwitchAuth({ sessionId: payload.session.id }));
          await createEventSubSubscription({ broadcasterId, sessionId: payload.session.id, type: 'channel.chat.message', version: 1 });
          setMessageIds((prev) => [...prev, messageId]);
        })();
      }
    }          
  }, [broadcasterId, createEventSubSubscription, newMessage, setMessageIds]);

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
                getChannelEmotesQuery({ broadcasterId }),
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
            setMessageIds((prev) => [...prev, messageId]);
          })();
        }
      }
    }
  }, [broadcasterId, dispatch, setChats, setMessageIds, newMessage]);

  // Render component
  return (
    <Fragment>
      { chats.map((chat) => (
        <p key={ chat.message_id }><span style={ { fontWeight: 'bold', color: chat.color || '#808080' } }>{ chat.chatter_user_name }</span>: { chat.messageJsx }</p>
      )) }
    </Fragment>
  );
};
