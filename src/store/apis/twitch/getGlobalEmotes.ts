import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiGetGlobalEmotesResponse {
  data: {
    id: string;
    name: string;
    images: {
      url_1x: string;
      url_2x: string;
      url_3x: string;
    };
    format: ('static' | 'animated')[];
    scale: ('1.0' | '2.0' | '3.0')[];
    theme_mode: ('light' | 'dark')[];
  }[];
  template: string;
}

export const {
  useGetGlobalEmotesQuery,
  useLazyGetGlobalEmotesQuery,
  util: { invalidateTags: invalidateGlobalEmotesTags, updateQueryData: updateGlobalEmotesData },
} = twitchApi
  .enhanceEndpoints({
    addTagTypes: ['GLOBAL_EMOTE_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getGlobalEmotes: build.query<TwitchApiGetGlobalEmotesResponse, void>({
        query: () => ({
          method: 'GET',
          url: '/chat/emotes/global',
        }),
        providesTags: (result, error) => {
          if (result) return [{ type: 'GLOBAL_EMOTE_DATA' }];
          if (error?.status === 401) return ['UNAUTHORIZED'];
          return [];
        },
      }),
    }),
  });
