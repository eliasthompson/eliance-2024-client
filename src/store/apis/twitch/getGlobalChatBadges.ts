import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiGetGlobalChatBadgesResponse {
  data: {
    set_id: string;
    versions: {
      id: string;
      image_url_1x: string;
      image_url_2x: string;
      image_url_4x: string;
      title: string;
      description: string;
      click_action: string | null;
      click_url: string | null;
    }[];
  }[];
}

export const {
  useGetGlobalChatBadgesQuery,
  useLazyGetGlobalChatBadgesQuery,
  util: { invalidateTags: invalidateGlobalChatBadgesTags, updateQueryData: updateGlobalChatBadgesData },
} = twitchApi
  .enhanceEndpoints({
    addTagTypes: ['GLOBAL_CHAT_BADGE_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getGlobalChatBadges: build.query<TwitchApiGetGlobalChatBadgesResponse, void>({
        query: () => ({
          method: 'GET',
          url: '/chat/badges/global',
        }),
        providesTags: (result, error) => {
          if (result) return [{ type: 'GLOBAL_CHAT_BADGE_DATA' }];
          if (error?.status === 401) return ['UNAUTHORIZED'];
          return [];
        },
      }),
    }),
  });
