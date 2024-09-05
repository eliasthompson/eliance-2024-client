import { twitchApi } from '.';

export interface TwitchApiGetStreamsRequest {
  userIds: string[];
}

export interface TwitchApiGetStreamsResponse {
  data: {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: 'live' | 'all';
    title: string;
    tags: string[];
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    is_mature: boolean;
  }[];
  pagination: {
    cursor: string;
  };
}

export const { useLazyGetStreamsQuery } = twitchApi
  .enhanceEndpoints({
    addTagTypes: ['STREAM_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getStreams: build.query<TwitchApiGetStreamsResponse, TwitchApiGetStreamsRequest>({
        query: ({ userIds }) => ({
          method: 'GET',
          url: `/streams?${userIds.map((userId) => `user_id=${userId}`).join('&')}&first=100`,
        }),
        providesTags: (result, error, { userIds }) => {
          if (result)
            return userIds.map((userId) => ({
              type: 'STREAM_DATA',
              id: userId,
            }));
          if (error?.status === 401) return ['UNAUTHORIZED'];
          return [];
        },
      }),
    }),
  });
