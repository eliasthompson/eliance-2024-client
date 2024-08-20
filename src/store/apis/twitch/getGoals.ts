import { twitchApi } from '.';

export interface TwitchApiGetGoalsRequest {
  broadcasterId: string,
}

export interface TwitchApiGetGoalsSuccessResponse {
  data: {
    id: string,
    broadcaster_id: number,
    broadcaster_name: string,
    broadcaster_login: string,
    type: string,
    description: string,
    current_amount: number,
    target_amount: number,
    created_at: string,
  }[],
}

const twitchApiWithTags = twitchApi.enhanceEndpoints({
  addTagTypes: ['GOAL_DATA'],
});

export const { useGetGoalsQuery } = twitchApiWithTags.injectEndpoints({
  endpoints: (build) => ({
    getGoals: build.query<TwitchApiGetGoalsSuccessResponse, TwitchApiGetGoalsRequest>({
      query: ({ broadcasterId }) => ({
        method: 'GET',
        url: `/goals?broadcaster_id=${broadcasterId}`,
      }),
      providesTags: (result, error, { broadcasterId }) => {
        if (result) return [{ type: 'GOAL_DATA', id: broadcasterId }];
        if (error?.status === 401) return ['UNAUTHORIZED'];
        return [];
      }
    }),
  })
});
