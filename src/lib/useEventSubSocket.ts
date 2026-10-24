import { useEffect, useRef } from 'react';

import type { TwitchEventSubMessage } from '@/components/types';

import { isRecord } from '@/lib/isRecord';

const initialKeepaliveMs = 30 * 1000;
const eventSubUrl = `wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds=${initialKeepaliveMs / 1000}`;
const keepaliveGraceMs = 5 * 1000;
const maxRetryDelayMs = 30 * 1000;

const isTwitchWebSocketUrl = (value: unknown) => {
  if (typeof value !== 'string') return false;

  try {
    const { hostname, protocol } = new URL(value);

    return protocol === 'wss:' && (hostname === 'twitch.tv' || hostname.endsWith('.twitch.tv'));
  } catch {
    return false;
  }
};

const isEventSubSession = (session: unknown) =>
  isRecord(session) &&
  typeof session.id === 'string' &&
  (session.keepalive_timeout_seconds === null || typeof session.keepalive_timeout_seconds === 'number') &&
  (session.reconnect_url === null || isTwitchWebSocketUrl(session.reconnect_url));

const isEventSubMessage = (message: unknown): message is TwitchEventSubMessage =>
  isRecord(message) &&
  isRecord(message.metadata) &&
  typeof message.metadata.message_id === 'string' &&
  typeof message.metadata.message_type === 'string' &&
  isRecord(message.payload) &&
  (!('session' in message.payload) || isEventSubSession(message.payload.session));

const parseEventSubMessage = (data: unknown) => {
  if (typeof data !== 'string') return null;

  try {
    const message: unknown = JSON.parse(data);

    return isEventSubMessage(message) ? message : null;
  } catch {
    return null;
  }
};

export const connectEventSub = (url: string, onMessage: (message: TwitchEventSubMessage) => void) => {
  const openSockets = new Set<WebSocket>();
  let activeSocket: WebSocket | null = null;
  let isClosedByCaller = false;
  let retryAttempt = 0;
  let retryTimeoutId: ReturnType<typeof setTimeout> | undefined;

  const connect = (socketUrl: string, socketBeingReplaced: WebSocket | null) => {
    const socket = new WebSocket(socketUrl);
    let keepaliveMs = initialKeepaliveMs;
    let keepaliveTimeoutId: ReturnType<typeof setTimeout> | undefined;

    const restartKeepaliveTimer = () => {
      clearTimeout(keepaliveTimeoutId);
      keepaliveTimeoutId = setTimeout(() => socket.close(), keepaliveMs + keepaliveGraceMs);
    };

    openSockets.add(socket);
    if (!socketBeingReplaced) activeSocket = socket;
    restartKeepaliveTimer();

    socket.addEventListener('message', ({ data }) => {
      const message = parseEventSubMessage(data);

      restartKeepaliveTimer();

      if (!message) return;

      const { message_type: messageType } = message.metadata;

      if (messageType === 'session_keepalive') return;

      if ('session' in message.payload) {
        const { keepalive_timeout_seconds: keepaliveSeconds, reconnect_url: reconnectUrl } = message.payload.session;

        if (messageType === 'session_reconnect' && reconnectUrl) {
          connect(reconnectUrl, socket);

          return;
        }

        if (messageType === 'session_welcome') {
          if (keepaliveSeconds) keepaliveMs = keepaliveSeconds * 1000;
          restartKeepaliveTimer();
          retryAttempt = 0;

          if (socketBeingReplaced) {
            activeSocket = socket;
            socketBeingReplaced.close();

            return;
          }
        }
      }

      onMessage(message);
    });

    socket.addEventListener('close', () => {
      clearTimeout(keepaliveTimeoutId);
      openSockets.delete(socket);

      if (isClosedByCaller || socket !== activeSocket) return;

      const retryDelayMs = Math.min(1000 * 2 ** retryAttempt, maxRetryDelayMs);

      retryAttempt += 1;
      retryTimeoutId = setTimeout(() => connect(url, null), retryDelayMs);
    });
  };

  connect(url, null);

  return () => {
    isClosedByCaller = true;
    clearTimeout(retryTimeoutId);
    openSockets.forEach((socket) => socket.close());
  };
};

export const useEventSubSocket = (onMessage: (message: TwitchEventSubMessage) => void) => {
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => connectEventSub(eventSubUrl, (message) => onMessageRef.current(message)), []);
};
