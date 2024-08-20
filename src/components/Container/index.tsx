import { Fragment, MouseEvent, useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';

import { setTwitchAuth } from '@store/slices/twitchAuth';
import { twitchApiUtil } from '@store/apis/twitch';
import { twitchEventSub } from '@store/websockets/twitchEventSub';
import { useDispatch, useSelector } from '@store/hooks';
import { useCreateEventSubSubscriptionMutation } from '@store/apis/twitch/createGoalEventSubSubscription';
import { useGetGoalsQuery } from '@store/apis/twitch/getGoals';
import { useLazyGetChannelEmotesQuery } from '@store/apis/twitch/getChannelEmotes';
import { useLazyGetDeviceCodeQuery } from '@store/apis/twitch/getDeviceCode';
import { useLazyGetEmoteSetsQuery } from '@store/apis/twitch/getEmoteSets';
import { useLazyGetGlobalEmotesQuery } from '@store/apis/twitch/getGlobalEmotes';
import { useLazyGetTokensQuery } from '@store/apis/twitch/getTokens';

export const TwitchButton = styled.a<{ type?: string }>`
  cursor: pointer;
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  overflow: hidden;
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  font-weight: 600;
  font-size: 1.3rem;
  height: 3rem;
  border-radius: 0.4rem;
  color: #ffffff;
  background-color: ${({ type = 'primary' }) => (type === 'primary') ? '#9147ff' : 'transparent'};
  
  &:active {
    background-color: ${({ type = 'primary' }) => (type === 'primary') ? '##5c16c5' : 'rgb(83 83 95 / 55%)'};
  }
  
  &:hover {
    background-color: ${({ type = 'primary' }) => (type === 'primary') ? '#772ce8' : 'rgb(83 83 95 / 48%)'};
  }

  div {
    display: flex;
    align-items: center;
    flex-grow: 0;
    padding: 0px 1rem;

    div {
      flex-grow: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: flex-start !important;
    }
  }
`;

const Loading = () => (
  <h1>
    Loading...
  </h1>
);

export const Container = () => {
  const dispatch = useDispatch();
  const { broadcasterId, clientId, deviceCode, sessionId, scopes, verificationUri } = useSelector(({ twitchAuth }) => twitchAuth);
  const { data: goalsData, error: goalsError, isLoading: isGoalsLoading } = useGetGoalsQuery({ broadcasterId });
  const [createEventSubSubscription] = useCreateEventSubSubscriptionMutation();
  const [getChannelEmotesQuery] = useLazyGetChannelEmotesQuery();
  const [getDeviceCodeQuery] = useLazyGetDeviceCodeQuery();
  const [getEmoteSetsQuery] = useLazyGetEmoteSetsQuery();
  const [getGloablEmotesQuery] = useLazyGetGlobalEmotesQuery();
  const [getTokensQuery] = useLazyGetTokensQuery();
  const [messageIds, setMessageIds] = useState<string[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const handleAuthenticateClick = useCallback(async (event: MouseEvent) => {
    event.preventDefault();

    const { data: tokensData = {} } = await getTokensQuery({ clientId, deviceCode, scopes });

    if ('access_token' in tokensData && 'refresh_token' in tokensData) {
      const { access_token: accessToken, refresh_token: refreshToken } = tokensData;

      dispatch(setTwitchAuth({ accessToken, deviceCode: null, refreshToken, verificationUri: null }));
      dispatch(twitchApiUtil.invalidateTags(['UNAUTHORIZED']));
    }

  }, [clientId, deviceCode, getTokensQuery, scopes]);
  const handleTwitchEventSubMessage = useCallback(async ({ data }) => {
    let {
      event = {},
      messageId = null,
      messageType = null,
      newSessionId = null,
      subscriptionType = null,
    } = {} as {
      event: any,
      messageId: string | null,
      messageType: string | null,
      newSessionId: string | null,
      subscriptionType: string | null,
    };

    try {
      ({ metadata:
        {
          message_id: messageId = null,
          message_type: messageType = null,
          subscription_type: subscriptionType = null,
        } = {},
        payload: {
          event = {},
          session: {
            id: newSessionId = null
          } = {},
        } = {},
      } = JSON.parse(data));
    } catch (error) {
      //
    }

    if (!messageIds.includes(messageId)) {
      if (messageType === 'session_welcome') {
        dispatch(setTwitchAuth({ sessionId: newSessionId }));
      } else if (messageType === 'notification') {
        if (subscriptionType === 'channel.chat.message') {
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

            const { template } = globalEmotesData;
            const emotesData = [...globalEmotesData.data, ...channelEmotesData.data, ...emoteSetsData.data];
            emotes = emotesData.filter(({ id }) => emoteIds.includes(id)).map((emote) => {
              const format = (emote.format.includes('animated')) ? 'animated' : 'static';
              const url = template.replace('{{id}}', emote.id).replace('{{format}}', format).replace('{{theme_mode}}', 'dark').replace('{{scale}}', '3.0');

              return { ...emote, url };
            });

            console.log('emoteSetIds', emoteSetIds);
            console.log('globalEmotesData', globalEmotesData);
            console.log('channelEmotesData', channelEmotesData);
            console.log('emoteSetsData', emoteSetsData);
            console.log('emotes', emotes);
          }

          const messageJsx = (
            <Fragment>
              { 
                event.message.fragments.map((fragment, i) => {
                  const style = (fragment.type === 'mention') ? { fontWeight: 'bold' } : {};
                  const { url } = emotes.find((emote) => emote.id === fragment.emote?.id) || {};

                  if (url) {
                    if (url) return <img key={ i } src={ url } />;
                  } else {
                    return <span key={ i } style={ style }>{ fragment.text }</span>;
                  }
                })
              }
            </Fragment>
          )

          setChats([...chats, { ...event, messageJsx }]);
        }
      }
    }

    if (messageId) setMessageIds([...messageIds, messageId]);
  }, [broadcasterId, chats, dispatch, messageIds, setChats, setMessageIds]);
  const isAuthorized = !(
    (goalsError && 'status' in goalsError && goalsError.status === 401)
  );
  const isError = (
    goalsError
  );
  const isLoading = (
    isGoalsLoading
  );

  // Attach event listener for the twitch event sub
  useEffect(() => {
    twitchEventSub.addEventListener('message', handleTwitchEventSubMessage, true);
    return () => twitchEventSub.removeEventListener('message', handleTwitchEventSubMessage, true);
  }, [handleTwitchEventSubMessage]);

  // Subscribe to chat messages
  useEffect(() => {
    if (broadcasterId && sessionId) createEventSubSubscription({ broadcasterId, sessionId, type: 'channel.chat.message', version: 1 });
  }, [broadcasterId, createEventSubSubscription, sessionId]);

  // Get device code data when twitch api authorization fails
  useEffect(() => {
    (async () => {
      if (!isAuthorized) {
        const {
          data: {
            device_code: providedDeviceCode,
            verification_uri: providedVerificationUri,
          },
        } = await getDeviceCodeQuery({ clientId, scopes });

        dispatch(setTwitchAuth({ deviceCode: providedDeviceCode, verificationUri: providedVerificationUri }));
      }
    })();
  }, [isAuthorized, clientId, dispatch, getDeviceCodeQuery, scopes]);

  // Render auth buttons when device code data exists
  if (deviceCode && verificationUri) {
    return (
      <div>
        <TwitchButton href={ verificationUri } target="_blank" type="secondary">
          <div>
            <div>
              Grant
            </div>
          </div>
        </TwitchButton>

        <TwitchButton onClick={ handleAuthenticateClick }>
          <div>
            <div>
              Authenticate
            </div>
          </div>
        </TwitchButton>
      </div>
    );
  }

  // Render loading component if data is loading or errors unexpectedly
  if (isLoading || isError) {
    return null;
    // return <Loading />;
  }

  // Render component
  return (
    <Fragment>
      <h1>{ goalsData?.data[0].broadcaster_name }</h1>

      { goalsData.data.map((goalData) => (
        <p key={ goalData.id }>{ goalData.type }: { goalData.current_amount }/{ goalData.target_amount }</p>
      )) }

      { chats.map((chat) => (
        <p key={ chat.message_id }><span style={ { fontWeight: 'bold', color: chat.color || '#808080' } }>{ chat.chatter_user_name }</span>: { chat.messageJsx }</p>
      )) }
    </Fragment>
  );
};
