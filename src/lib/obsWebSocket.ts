/** obs-websocket v5 opcodes and status codes the client uses. */
const OP_HELLO = 0;
const OP_IDENTIFY = 1;
const OP_IDENTIFIED = 2;
const OP_REQUEST = 6;
const OP_REQUEST_RESPONSE = 7;
const RPC_VERSION = 1;
/** How long to wait before trying OBS again after a failed or dropped connection. */
const RECONNECT_MS = 15 * 1000;

export interface ObsRequestStatus {
  result: boolean;
  code: number;
  comment?: string;
}

export interface ObsClientOptions {
  url: string;
  password: string;
  /** Called when the connection is identified and ready, and again after every reconnect. */
  onConnect?: () => void;
  /** Called when a ready connection is lost. */
  onDisconnect?: () => void;
}

export interface ObsClient {
  /** Send one request and resolve with its response data, or reject with the request status or when not connected. */
  call: (requestType: string, requestData?: Record<string, unknown>) => Promise<Record<string, unknown>>;
  isConnected: () => boolean;
  /** Close and stop reconnecting. */
  close: () => void;
}

interface Pending {
  resolve: (value: Record<string, unknown>) => void;
  reject: (error: Error) => void;
}

const sha256Base64 = async (text: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));

  return btoa(String.fromCharCode(...new Uint8Array(digest)));
};

/** The authentication string obs-websocket expects: the password and salt hashed, then hashed again with the challenge. */
export const obsAuthentication = async (password: string, salt: string, challenge: string) =>
  sha256Base64((await sha256Base64(password + salt)) + challenge);

/**
 * A small obs-websocket client for the overlays. It connects when created, identifies with the password, and quietly
 * reconnects after a failure or a drop, so an OBS that is not there, as in a browser preview, costs nothing but a
 * debug line. Requests made while disconnected reject at once.
 */
export const createObsClient = ({ url, password, onConnect, onDisconnect }: ObsClientOptions): ObsClient => {
  const pending = new Map<string, Pending>();
  let socket: WebSocket | undefined;
  let reconnectTimeoutId: ReturnType<typeof setTimeout> | undefined;
  let isIdentified = false;
  let isClosed = false;
  let nextRequestId = 0;

  const send = (op: number, d: unknown) => socket?.send(JSON.stringify({ op, d }));

  const failPending = (error: Error) => {
    pending.forEach(({ reject }) => reject(error));
    pending.clear();
  };

  const scheduleReconnect = () => {
    if (isClosed || reconnectTimeoutId) return;

    reconnectTimeoutId = setTimeout(() => {
      reconnectTimeoutId = undefined;
      connect();
    }, RECONNECT_MS);
  };

  const connect = () => {
    if (isClosed) return;

    socket = new WebSocket(url);

    socket.addEventListener('message', (event: MessageEvent<string>) => {
      const { op, d } = JSON.parse(event.data) as { op: number; d: Record<string, unknown> };

      if (op === OP_HELLO) {
        const authentication = d.authentication as { challenge: string; salt: string } | undefined;

        if (!authentication) send(OP_IDENTIFY, { rpcVersion: RPC_VERSION });
        else
          obsAuthentication(password, authentication.salt, authentication.challenge).then((response) =>
            send(OP_IDENTIFY, { rpcVersion: RPC_VERSION, authentication: response }),
          );
      } else if (op === OP_IDENTIFIED) {
        isIdentified = true;
        // eslint-disable-next-line no-console -- the one quiet trace of OBS being unreachable
        console.debug(`connected to OBS at ${url}`);
        onConnect?.();
      } else if (op === OP_REQUEST_RESPONSE) {
        const { requestId, requestStatus, responseData } = d as {
          requestId: string;
          requestStatus: ObsRequestStatus;
          responseData?: Record<string, unknown>;
        };
        const request = pending.get(requestId);

        pending.delete(requestId);

        if (!request) return;
        if (requestStatus.result) request.resolve(responseData ?? {});
        else request.reject(new Error(`${String(requestStatus.code)} ${requestStatus.comment ?? ''}`.trim()));
      }
    });

    socket.addEventListener('close', (event) => {
      const wasIdentified = isIdentified;

      isIdentified = false;
      socket = undefined;
      failPending(new Error('OBS connection closed'));
      // eslint-disable-next-line no-console -- the one quiet trace of OBS being unreachable
      console.debug(
        `OBS at ${url} is not connected (${String(event.code)}); retrying in ${String(RECONNECT_MS / 1000)}s`,
      );

      if (wasIdentified) onDisconnect?.();

      scheduleReconnect();
    });

    // A failed connection also closes, which schedules the retry
    socket.addEventListener('error', () => undefined);
  };

  connect();

  return {
    call: (requestType, requestData = {}) =>
      new Promise((resolve, reject) => {
        if (!socket || !isIdentified) {
          reject(new Error('OBS is not connected'));
          return;
        }

        const requestId = String(nextRequestId++);

        pending.set(requestId, { resolve, reject });
        send(OP_REQUEST, { requestType, requestData, requestId });
      }),
    isConnected: () => isIdentified,
    close: () => {
      isClosed = true;
      clearTimeout(reconnectTimeoutId);
      socket?.close();
    },
  };
};
