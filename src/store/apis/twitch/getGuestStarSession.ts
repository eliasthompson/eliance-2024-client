import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiGetGuestStarSessionRequest {
  broadcasterId: string;
}

export interface TwitchApiGetGuestStarSessionMediaSettings {
  is_host_enabled: boolean;
  is_guest_enabled: boolean;
  is_available: boolean;
}

export interface TwitchApiGetGuestStarSessionResponse {
  data: {
    id: string;
    guests: {
      slot_id: string;
      user_id: string;
      is_live: boolean;
      volume: number;
      assigned_at: string;
      audio_settings: TwitchApiGetGuestStarSessionMediaSettings;
      video_settings: TwitchApiGetGuestStarSessionMediaSettings;
    }[];
  }[];
}

export const {
  useGetGuestStarSessionQuery,
  useLazyGetGuestStarSessionQuery,
  util: { invalidateTags: invalidateGuestStarSessionTags, updateQueryData: updateGuestStarSessionData },
} = twitchApi
  .enhanceEndpoints({
    addTagTypes: ['GUEST_STAR_SESSION_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getGuestStarSession: build.query<TwitchApiGetGuestStarSessionResponse, TwitchApiGetGuestStarSessionRequest>({
        query: ({ broadcasterId }) => ({
          method: 'GET',
          url: `/guest_star/session?broadcaster_id=${broadcasterId}&moderator_id=${broadcasterId}`,
        }),
        providesTags: (result, error, { broadcasterId }) => {
          if (result) return [{ type: 'GUEST_STAR_SESSION_DATA', id: broadcasterId }];
          if (error?.status === 401) return ['UNAUTHORIZED'];
          return [];
        },
      }),
    }),
  });
