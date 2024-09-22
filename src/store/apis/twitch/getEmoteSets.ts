import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiGetEmoteSetsRequest {
  emoteSetIds: string[];
}

export interface TwitchApiGetEmoteSetsResponse {
  data: {
    id: string;
    name: string;
    images: {
      url_1x: string;
      url_2x: string;
      url_3x: string;
    };
    emote_type: (
      | 'none'
      | 'bitstier'
      | 'follower'
      | 'subscriptions'
      | 'channelpoints'
      | 'rewards'
      | 'hypetrain'
      | 'prime'
      | 'turbo'
      | 'smilies'
      | 'globals'
      | 'owl2019'
      | 'twofactor'
      | 'limitedtime'
    )[];
    emote_set_id: string;
    format: ('static' | 'animated')[];
    scale: ('1.0' | '2.0' | '3.0')[];
    theme_mode: ('light' | 'dark')[];
  }[];
  template: string;
}

export const {
  useGetEmoteSetsQuery,
  useLazyGetEmoteSetsQuery,
  util: { invalidateTags: invalidateEmoteSetsTags, updateQueryData: updateEmoteSetsData },
} = twitchApi
  .enhanceEndpoints({
    addTagTypes: ['EMOTE_SET_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getEmoteSets: build.query<TwitchApiGetEmoteSetsResponse, TwitchApiGetEmoteSetsRequest>({
        query: ({ emoteSetIds }) => ({
          method: 'GET',
          url: `/chat/emotes/set?${emoteSetIds.map((emoteSetId, i) => (i ? `&emote_set_id=${emoteSetId}` : `emote_set_id=${emoteSetId}`))}`,
        }),
        providesTags: (result, error, { emoteSetIds }) => {
          if (result)
            return emoteSetIds.map((emoteSetId) => ({
              type: 'EMOTE_SET_DATA',
              id: emoteSetId,
            }));
          if (error?.status === 401) return ['UNAUTHORIZED'];
          return [];
        },
      }),
    }),
  });
