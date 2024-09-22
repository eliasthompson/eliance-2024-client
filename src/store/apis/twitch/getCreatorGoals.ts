import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiGetCreatorGoalsRequest {
  broadcasterId: string;
}

export interface TwitchApiGetCreatorGoalsResponse {
  data: {
    id: string;
    broadcaster_id: string;
    broadcaster_name: string;
    broadcaster_login: string;
    type: 'follower' | 'subscription' | 'subscription_count' | 'new_subscription' | 'new_subscription_count';
    description: string;
    current_amount: number;
    target_amount: number;
    created_at: string;
  }[];
}

export const {
  useGetCreatorGoalsQuery,
  useLazyGetCreatorGoalsQuery,
  util: { invalidateTags: invalidateCreatorGoalsTags, updateQueryData: updateCreatorGoalsData },
} = twitchApi
  .enhanceEndpoints({
    addTagTypes: ['CREATOR_GOAL_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCreatorGoals: build.query<TwitchApiGetCreatorGoalsResponse, TwitchApiGetCreatorGoalsRequest>({
        query: ({ broadcasterId }) => ({
          method: 'GET',
          url: `/goals?broadcaster_id=${broadcasterId}`,
        }),
        providesTags: (result, error, { broadcasterId }) => {
          if (result) return [{ type: 'CREATOR_GOAL_DATA', id: broadcasterId }];
          if (error?.status === 401) return ['UNAUTHORIZED'];
          return [];
        },
      }),
    }),
  });
