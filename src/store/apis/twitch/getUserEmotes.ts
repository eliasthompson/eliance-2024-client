import { twitchApi } from '.';

export interface TwitchApiGetUserEmotesRequest {
  after?: string,
  broadcasterId?: string,
  userId: string,
}

export interface TwitchApiGetUserEmotesSuccessResponse {
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

const twitchApiWithTags = twitchApi.enhanceEndpoints({
  addTagTypes: ['USER_EMOTE_DATA'],
});

export const { useLazyGetUserEmotesQuery } = twitchApiWithTags.injectEndpoints({
  endpoints: (build) => ({
    getUserEmotes: build.query<TwitchApiGetUserEmotesSuccessResponse, TwitchApiGetUserEmotesRequest>({
      query: ({ after, broadcasterId, userId }) => ({
        method: 'GET',
        url: `/chat/emotes/user?user_id=${userId}${(broadcasterId) ? `&broadcaster_id=${broadcasterId}` : ''}${(after) ? `&after=${after}` : ''}`,
      }),
      providesTags: (result, error, { userId }) => {
        if (result) return [{ type: 'USER_EMOTE_DATA', id: userId }];
        if (error?.status === 401) return ['UNAUTHORIZED'];
        return [];
      },
      // Refetch when the page arg changes
      forceRefetch: ({ currentArg, previousArg }) => {
        console.log('currentArg', currentArg);
        console.log('previousArg', previousArg);
        // return currentArg !== previousArg;
        return false;
      },
    }),
  })
});
