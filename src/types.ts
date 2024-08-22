export interface TwitchEventSubWelcomeMessage {
  metadata: {
    message_id: string,
    message_type: 'session_welcome',
    message_timestamp: string,
  },
  payload: {
    session: {
      id: string,
      status: 'connected',
      connected_at: string,
      keepalive_timeout_seconds: number,
      reconnect_url: null,
    },
  },
};

export interface TwitchEventSubKeepaliveMessage {
  metadata: {
    message_id: string,
    message_type: 'session_keepalive',
    message_timestamp: string,
  },
  payload: object,
};

export interface TwitchEventSubNotificationMessage {
  metadata: {
    message_id: string,
    message_type: 'notification',
    message_timestamp: string,
  },
  payload: {
    subscription: {
      id: string,
      status: 'enabled',
      version: string,
      cost: number,
      transport: {
        method: 'websocket',
        session_id: string,
      },
      created_at: string,
    },
  },
};

export interface TwitchEventSubReconnectMessage {
  metadata: {
    message_id: string,
    message_type: 'session_reconnect',
    message_timestamp: string,
  },
  payload: {
    session: {
      id: string,
      status: 'reconnecting',
      keepalive_timeout_seconds: null,
      reconnect_url: string,
      connected_at: string,
    },
  },
};

export type TwitchEventSubMessage = TwitchEventSubWelcomeMessage | TwitchEventSubKeepaliveMessage | TwitchEventSubNotificationMessage | TwitchEventSubReconnectMessage;
