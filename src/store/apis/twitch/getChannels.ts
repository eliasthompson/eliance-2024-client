import { twitchApi } from '.';

export interface TwitchApiGetChannelsRequest {
  broadcasterIds: string[],
}

export interface TwitchApiGetChannelsSuccessResponse {
  data: {
    broadcaster_name: string,
  }[],
}

const twitchApiWithTags = twitchApi.enhanceEndpoints({
  addTagTypes: ['CHANNEL_DATA'],
});

export const { useGetChannelsQuery } = twitchApiWithTags.injectEndpoints({
  endpoints: (build) => ({
    getChannels: build.query<TwitchApiGetChannelsSuccessResponse, TwitchApiGetChannelsRequest>({
      query: ({ broadcasterIds }) => ({
        method: 'GET',
        url: `/channels?${broadcasterIds.map((broadcasterId, i) => (i) ? `&broadcaster_id=${broadcasterId}` : `broadcaster_id=${broadcasterId}`)}`,
      }),
      providesTags: (result, error, { broadcasterIds }) => {
        if (result) return broadcasterIds.map((broadcasterId) => ({ type: 'CHANNEL_DATA', id: broadcasterId }));
        if (error?.status === 401) return ['UNAUTHORIZED'];
        return [];
      }
    }),
  })
});
