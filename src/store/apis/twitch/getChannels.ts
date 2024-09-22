import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiGetChannelsRequest {
  broadcasterIds: string[];
}

export interface TwitchApiGetChannelsResponse {
  data: {
    broadcaster_name: string;
  }[];
}

export const {
  useGetChannelsQuery,
  useLazyGetChannelsQuery,
  util: { invalidateTags: invalidateChannelsTags, updateQueryData: updateChannelsData },
} = twitchApi
  .enhanceEndpoints({
    addTagTypes: ['CHANNEL_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getChannels: build.query<TwitchApiGetChannelsResponse, TwitchApiGetChannelsRequest>({
        query: ({ broadcasterIds }) => ({
          method: 'GET',
          url: `/channels?${broadcasterIds.map((broadcasterId) => `broadcaster_id=${broadcasterId}`).join('&')}`,
        }),
        providesTags: (result, error, { broadcasterIds }) => {
          if (result)
            return broadcasterIds.map((broadcasterId) => ({
              type: 'CHANNEL_DATA',
              id: broadcasterId,
            }));
          if (error?.status === 401) return ['UNAUTHORIZED'];
          return [];
        },
      }),
    }),
  });
