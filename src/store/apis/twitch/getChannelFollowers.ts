import { twitchApi } from '.';

export interface TwitchApiGetChannelFollowersRequest {
  broadcasterId: string,
}

export interface TwitchApiGetChannelFollowersSuccessResponse {
  total: number,
}

const twitchApiWithTags = twitchApi.enhanceEndpoints({
  addTagTypes: ['CHANNEL_FOLLOWER_DATA'],
});

export const twitchApiGetChannelFollowers = twitchApiWithTags.injectEndpoints({
  endpoints: (build) => ({
    getChannelFollowers: build.query<TwitchApiGetChannelFollowersSuccessResponse, TwitchApiGetChannelFollowersRequest>({
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
