import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiGetClipsRequest {
  broadcasterId: string;
  isFeatured?: boolean;
}

export interface TwitchApiGetClipsResponse {
  data: {
    id: string;
    url: string;
    embed_url: string;
    broadcaster_id: string;
    broadcaster_name: string;
    creator_id: string;
    creator_name: string;
    video_id: string;
    game_id: string;
    language: string;
    title: string;
    view_count: number;
    created_at: string;
    thumbnail_url: string;
    duration: number;
    vod_offset: number;
    is_featured: boolean;
  }[];
  pagination: {
    cursor: string;
  };
}

export const {
  useGetClipsQuery,
  useLazyGetClipsQuery,
  util: { invalidateTags: invalidateClipsTags, updateQueryData: updateClipsData },
} = twitchApi
  .enhanceEndpoints({
    addTagTypes: ['CLIP_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getClips: build.query<TwitchApiGetClipsResponse, TwitchApiGetClipsRequest>({
        query: ({ broadcasterId, isFeatured }) => ({
          method: 'GET',
          url: `/clips?broadcaster_id=${broadcasterId}${typeof isFeatured !== 'undefined' ? `&is_featured=${isFeatured}` : ''}`,
        }),
        providesTags: (result, error) => {
          if (result)
            return result.data.map(({ id }) => ({
              type: 'CLIP_DATA',
              id,
            }));
          if (error?.status === 401) return ['UNAUTHORIZED'];
          return [];
        },
      }),
    }),
  });
