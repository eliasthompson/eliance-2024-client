import { twitchApi } from '.';

export interface TwitchApiGetChannelEmotesRequest {
  broadcasterId: string,
}

export interface TwitchApiGetChannelEmotesSuccessResponse {
  data: {
    id: string,
    name: string,
    images: {
      url_1x: string,
      url_2x: string,
      url_3x: string,
    },
    tier: string,
    emote_type: ('none' | 'bitstier' | 'follower' | 'subscriptions' | 'channelpoints' | 'rewards' | 'hypetrain' | 'prime' | 'turbo' | 'smilies' | 'globals' | 'owl2019' | 'twofactor' | 'limitedtime')[],
    emote_set_id: string,
    format: ('static' | 'animated')[],
    scale: ('1.0' | '2.0' | '3.0')[],
    theme_mode: ('light' | 'dark')[],
  }[],
  template: string,
}

const twitchApiWithTags = twitchApi.enhanceEndpoints({
  addTagTypes: ['CHANNEL_EMOTE_DATA'],
});

export const { useLazyGetChannelEmotesQuery } = twitchApiWithTags.injectEndpoints({
  endpoints: (build) => ({
    getChannelEmotes: build.query<TwitchApiGetChannelEmotesSuccessResponse, TwitchApiGetChannelEmotesRequest>({
      query: ({ broadcasterId }) => ({
        method: 'GET',
        url: `/chat/emotes?broadcaster_id=${broadcasterId}`,
      }),
      providesTags: (result, error, { broadcasterId }) => {
        if (result) return [{ type: 'CHANNEL_EMOTE_DATA', id: broadcasterId }];
        if (error?.status === 401) return ['UNAUTHORIZED'];
        return [];
      }
    }),
  })
});
