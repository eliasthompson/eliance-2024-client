import useWebSocket from 'react-use-websocket';
import { Fragment, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import * as uuid from 'uuid';

import type { FirebotEventSubMessage, FirebotEventSubMessagePayload } from '@store/apis/firebot';
import type { TwitchEventSubMessage, TwitchPubSubMessage } from '@components/types';

import { AuthenticationBar } from '@components/AuthenticationBar';
import { ErrorMessage } from '@components/shared/ErrorMessage';
import { InfoBar } from '@components/InfoBar';
import { addError, setInfo } from '@store/slices/info';
import { addFirebotEventSubMessageId } from '@store/slices/firebotEventSub';
import { addTwitchEventSubMessageId, setTwitchEventSub } from '@src/store/slices/twitchEventSub';
import { namespace } from '@config';
import { useDispatch, useSelector } from '@store';
import { useValidateTokenQuery } from '@src/store/apis/twitch/validateToken';

export const Container = () => {
  const dispatch = useDispatch();
  const {
    lastJsonMessage: firebotMessage,
    readyState: firebotReadyState,
    sendJsonMessage: sendFirebotMessage,
  } = useWebSocket<FirebotEventSubMessage>('ws://localhost:7472', {
    share: true,
  });
  const { lastJsonMessage: twitchMessage } = useWebSocket<TwitchEventSubMessage>('wss://eventsub.wss.twitch.tv/ws', {
    share: true,
  });
  const { readyState: twitchPSReadyState, sendJsonMessage: sendTwitchPSMessage } = useWebSocket<TwitchPubSubMessage>(
    'wss://pubsub-edge.twitch.tv',
    {
      share: true,
    },
  );
  const { broadcasterId, broadcasterLogin, errors } = useSelector(({ info }) => info);
  const { messageIds: firebotMessageIds } = useSelector(({ firebotEventSub }) => firebotEventSub);
  const { messageIds: twitchMessageIds, sessionId } = useSelector(({ twitchEventSub }) => twitchEventSub);
  const { data: tokenData, error: tokenError, isLoading: isTokenLoading } = useValidateTokenQuery();
  const [pingIntervalId, setPingIntervalId] = useState<NodeJS.Timeout | null>(null);
  const isAuthorized = !(tokenError && 'status' in tokenError && tokenError.status === 401);
  const isRenderable = !!(broadcasterId && broadcasterLogin && sessionId);
  const backgroundColorBar = window.obsstudio ? 'transparent' : 'rgba(0, 0, 0, 33%)';
  const borderStyleBar = window.obsstudio ? 'none' : 'solid';
  const bottomBar = window.obsstudio ? '0' : '-6px';
  const filterBar = window.obsstudio ? 'none' : 'drop-shadow(#000000 0 0 calc(var(--padding) * 0.75))';
  const cssBar = css`
    position: absolute;
    bottom: ${bottomBar};
    width: var(--bar-width);
    height: var(--bar-height);
    border-color: #9147ff;
    border-style: ${borderStyleBar};
    border-width: calc(var(--padding) / 2);
    background-color: ${backgroundColorBar};
    filter: ${filterBar};
  `;

  // Set broadcaster id if token data exists
  useEffect(() => {
    if (tokenData) dispatch(setInfo({ broadcasterId: tokenData.user_id, broadcasterLogin: tokenData.login }));
  }, [dispatch, tokenData]);

  // Subscribe to firebot event sub events on first connection
  useEffect(() => {
    if (firebotMessage === null && firebotReadyState === 1)
      sendFirebotMessage<FirebotEventSubMessagePayload>({
        type: 'invoke',
        name: 'subscribe-events',
      });
  }, [dispatch, firebotMessage, firebotReadyState]);

  // Log firebot event sub message id on success response
  useEffect(() => {
    if (firebotMessage) {
      const messageId = uuid.v5(JSON.stringify(firebotMessage), namespace);
      const { type, name } = firebotMessage;

      if (!firebotMessageIds.includes(messageId) && type === 'response' && name === 'success') {
        dispatch(addFirebotEventSubMessageId(messageId));
      }
    }
  }, [dispatch, firebotMessage, firebotMessageIds]);

  // Set twitch event sub session id & log message id on session welcome
  useEffect(() => {
    if (twitchMessage) {
      const { metadata, payload } = twitchMessage;
      const { message_id: messageId, message_type: messageType } = metadata;

      if (!twitchMessageIds.includes(messageId) && messageType === 'session_welcome' && 'session' in payload) {
        dispatch(setTwitchEventSub({ sessionId: payload.session.id }));
        dispatch(addTwitchEventSubMessageId(messageId));
      }
    }
  }, [dispatch, twitchMessage, twitchMessageIds]);

  // Handle twitch pub sub pings
  useEffect(() => {
    if (twitchPSReadyState === 1 && pingIntervalId === null) {
      setPingIntervalId(
        setInterval(
          () => {
            sendTwitchPSMessage({ type: 'PING' });
          },
          5 * 60 * 1000,
        ),
      );
    }

    return () => clearInterval(pingIntervalId);
  }, [pingIntervalId, twitchPSReadyState, sendTwitchPSMessage, setPingIntervalId]);

  // Set errors
  useEffect(() => {
    if (tokenError && 'status' in tokenError) dispatch(addError(tokenError));
  }, [dispatch, tokenError]);

  // Render nothing if data is loading or required data is incomplete
  if (isTokenLoading || !isRenderable) return null;

  // Render component
  return (
    <Fragment>
      {isAuthorized ? <InfoBar cssBar={cssBar} /> : <AuthenticationBar cssBar={cssBar} />}

      {errors.length ? errors.map((error, i) => <ErrorMessage key={i} error={error} />) : null}
    </Fragment>
  );
};
