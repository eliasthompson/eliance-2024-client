import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiGetUserChatColorsRequest {
  userIds: string[];
}

export interface TwitchApiGetUserChatColorsResponse {
  data: {
    user_id: string;
    user_login: string;
    user_name: string;
    color: string;
  }[];
}

export const {
  useGetUserChatColorsQuery,
  useLazyGetUserChatColorsQuery,
  util: { invalidateTags: invalidateUserChatColorsTags, updateQueryData: updateUserChatColorsData },
} = twitchApi
  .enhanceEndpoints({
    addTagTypes: ['USER_CHAT_COLOR_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getUserChatColors: build.query<TwitchApiGetUserChatColorsResponse, TwitchApiGetUserChatColorsRequest>({
        query: ({ userIds }) => ({
          method: 'GET',
          url: `/chat/color?${userIds.map((userId) => `user_id=${userId}`).join('&')}`,
        }),
        providesTags: (result, error, { userIds }) => {
          if (result)
            return userIds.map((userId) => ({
              type: 'USER_CHAT_COLOR_DATA',
              id: userId,
            }));
          if (error?.status === 401) return ['UNAUTHORIZED'];
          return [];
        },
      }),
    }),
  });
