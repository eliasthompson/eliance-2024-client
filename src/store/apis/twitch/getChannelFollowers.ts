import { twitchApi } from '.';

export interface TwitchApiGetChannelFollowersRequest {
  broadcasterId: string,
}

export interface TwitchApiGetChannelFollowersResponse {
  total: number,
}

export const twitchApiGetChannelFollowers = twitchApi.enhanceEndpoints({
  addTagTypes: ['CHANNEL_FOLLOWER_DATA'],
}).injectEndpoints({
  endpoints: (build) => ({
    getChannelFollowers: build.query<TwitchApiGetChannelFollowersResponse, TwitchApiGetChannelFollowersRequest>({
      query: ({ broadcasterId }) => ({
        method: 'GET',
        url: `/channels/followers?broadcaster_id=${broadcasterId}`,
      }),
      providesTags: (result, error, { broadcasterId }) => {
        if (result) return [{ type: 'CHANNEL_FOLLOWER_DATA', id: broadcasterId }];
        if (error?.status === 401) return ['UNAUTHORIZED'];
        return [];
      }
    }),
  })
});
