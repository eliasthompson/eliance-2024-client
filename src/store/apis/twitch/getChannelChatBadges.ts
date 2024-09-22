import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiGetChannelChatBadgesRequest {
  broadcasterId: string;
}

export interface TwitchApiGetChannelChatBadgesResponse {
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
  useGetChannelChatBadgesQuery,
  useLazyGetChannelChatBadgesQuery,
  util: { invalidateTags: invalidateChannelChatBadgesTags, updateQueryData: updateChannelChatBadgesData },
} = twitchApi
  .enhanceEndpoints({
    addTagTypes: ['CHANNEL_CHAT_BADGE_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getChannelChatBadges: build.query<TwitchApiGetChannelChatBadgesResponse, TwitchApiGetChannelChatBadgesRequest>({
        query: ({ broadcasterId }) => ({
          method: 'GET',
          url: `/chat/badges?broadcaster_id=${broadcasterId}`,
        }),
        providesTags: (result, error, { broadcasterId }) => {
          if (result) return [{ type: 'CHANNEL_CHAT_BADGE_DATA', id: broadcasterId }];
          if (error?.status === 401) return ['UNAUTHORIZED'];
          return [];
        },
      }),
    }),
  });
