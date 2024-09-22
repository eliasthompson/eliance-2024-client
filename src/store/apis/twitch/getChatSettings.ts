import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiGetChatSettingsRequest {
  broadcasterId: string;
}

export interface TwitchApiGetChatSettingsResponse {
  data: {
    broadcaster_id: string;
    emote_mode: boolean;
    follower_mode: boolean;
    follower_mode_duration: number | null;
    moderator_id: string;
    non_moderator_chat_delay: boolean;
    non_moderator_chat_delay_duration: number | null;
    slow_mode: boolean;
    slow_mode_wait_time: number | null;
    subscriber_mode: boolean;
    unique_chat_mode: boolean;
  }[];
}

export const {
  useGetChatSettingsQuery,
  useLazyGetChatSettingsQuery,
  util: { invalidateTags: invalidateChatSettingsTags, updateQueryData: updateChatSettingsData },
} = twitchApi
  .enhanceEndpoints({
    addTagTypes: ['CHAT_SETTINGS_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getChatSettings: build.query<TwitchApiGetChatSettingsResponse, TwitchApiGetChatSettingsRequest>({
        query: ({ broadcasterId }) => ({
          method: 'GET',
          url: `/chat/settings?broadcaster_id=${broadcasterId}&moderator_id=${broadcasterId}`,
        }),
        providesTags: (result, error, { broadcasterId }) => {
          if (result) return [{ type: 'CHAT_SETTINGS_DATA', id: broadcasterId }];
          if (error?.status === 401) return ['UNAUTHORIZED'];
          return [];
        },
      }),
    }),
  });
