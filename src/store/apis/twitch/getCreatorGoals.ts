import { twitchApi } from '.';

export interface TwitchApiGetCreatorGoalsRequest {
  broadcasterId: string,
}

export interface TwitchApiGetCreatorGoalsSuccessResponse {
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

export const { useLazyGetCreatorGoalsQuery } = twitchApi.enhanceEndpoints({
  addTagTypes: ['GOAL_DATA'],
}).injectEndpoints({
  endpoints: (build) => ({
    getCreatorGoals: build.query<TwitchApiGetCreatorGoalsSuccessResponse, TwitchApiGetCreatorGoalsRequest>({
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
