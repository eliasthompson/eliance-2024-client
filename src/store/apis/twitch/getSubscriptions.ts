import { twitchApi } from '.';

export interface TwitchApiGetSubscriptionsRequest {
  broadcasterId: string;
}

export interface TwitchApiGetSubscriptionsResponse {
  points: number;
  total: number;
}

export const { useGetSubscriptionsQuery } = twitchApi
  .enhanceEndpoints({
    addTagTypes: ['SUBSCRIPTION_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getSubscriptions: build.query<TwitchApiGetSubscriptionsResponse, TwitchApiGetSubscriptionsRequest>({
        query: ({ broadcasterId }) => ({
          method: 'GET',
          url: `/subscriptions?broadcaster_id=${broadcasterId}`,
        }),
        providesTags: (result, error, { broadcasterId }) => {
          if (result) return [{ type: 'SUBSCRIPTION_DATA', id: broadcasterId }];
          if (error?.status === 401) return ['UNAUTHORIZED'];
          return [];
        },
      }),
    }),
  });
