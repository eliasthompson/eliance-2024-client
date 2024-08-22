import { twitchApi } from '.';

export interface TwitchApiCreateEventSubSubscriptionRequest {
  broadcasterId: string,
  sessionId: string,
  type: string,
  version: number
}

export interface TwitchApiCreateEventSubSubscriptionSuccessResponse {
  data: {
    current_amount: number,
    id: string,
    target_amount: number,
    type: string,
  }[],
}

export const { useCreateEventSubSubscriptionQuery } = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    createEventSubSubscription: build.query<TwitchApiCreateEventSubSubscriptionSuccessResponse, TwitchApiCreateEventSubSubscriptionRequest>({
      query: ({ broadcasterId, sessionId, type, version }) => ({
        body: {
          type,
          version,
          condition: {
            broadcaster_user_id: broadcasterId,
            user_id: broadcasterId,
          },
          transport: {
            method: 'websocket',
            session_id: sessionId,
          },
        },
        method: 'POST',
        url: '/eventsub/subscriptions',
        // url: 'http://localhost:8081/eventsub/subscription',
      }),
    }),
  })
});
