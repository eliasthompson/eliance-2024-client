import { twitchApi } from '.';

export interface TwitchApiGetUserEmotesRequest {
  after?: string,
  broadcasterId?: string,
  userId: string,
}

export interface TwitchApiGetUserEmotesResponse {
  data: {
    emote_set_id: string,
    emote_type: ('none' | 'bitstier' | 'follower' | 'subscriptions' | 'channelpoints' | 'rewards' | 'hypetrain' | 'prime' | 'turbo' | 'smilies' | 'globals' | 'owl2019' | 'twofactor' | 'limitedtime')[],
    format: ('static' | 'animated')[],
    id: string,
    name: string,
    owner_id: string,
    scale: ('1.0' | '2.0' | '3.0')[],
    theme_mode: ('light' | 'dark')[],
  }[],
  template: string,
  pagination: {
    cursor: string,
  },
}

export const { useLazyGetUserEmotesQuery } = twitchApi.enhanceEndpoints({
  addTagTypes: ['USER_EMOTE_DATA'],
}).injectEndpoints({
  endpoints: (build) => ({
    getUserEmotes: build.query<TwitchApiGetUserEmotesResponse, TwitchApiGetUserEmotesRequest>({
      query: ({ after, broadcasterId, userId }) => ({
        method: 'GET',
        url: `/chat/emotes/user?user_id=${userId}${(broadcasterId) ? `&broadcaster_id=${broadcasterId}` : ''}${(after) ? `&after=${after}` : ''}`,
      }),
      providesTags: (result, error, { userId }) => {
        if (result) return [{ type: 'USER_EMOTE_DATA', id: userId }];
        if (error?.status === 401) return ['UNAUTHORIZED'];
        return [];
      },
    }),
  })
});
