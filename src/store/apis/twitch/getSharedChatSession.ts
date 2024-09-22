import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiGetSharedChatSessionRequest {
  broadcasterId: string;
}

export interface TwitchApiGetSharedChatSessionResponse {
  data: {
    session_id: string;
    host_broadcaster_id: string;
    participants: {
      broadcaster_id: string;
    }[];
    created_at: string;
    updated_at: string;
  }[];
}

export const {
  useGetSharedChatSessionQuery,
  useLazyGetSharedChatSessionQuery,
  util: { invalidateTags: invalidateSharedChatSessionTags, updateQueryData: updateSharedChatSessionData },
} = twitchApi
  .enhanceEndpoints({
    addTagTypes: ['SHARED_CHAT_SESSION_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getSharedChatSession: build.query<TwitchApiGetSharedChatSessionResponse, TwitchApiGetSharedChatSessionRequest>({
        query: ({ broadcasterId }) => ({
          method: 'GET',
          url: `/shared_chat/session?broadcaster_id=${broadcasterId}`,
        }),
        providesTags: (result, error, { broadcasterId }) => {
          if (result) return [{ type: 'SHARED_CHAT_SESSION_DATA', id: broadcasterId }];
          if (error?.status === 401) return ['UNAUTHORIZED'];
          return [];
        },
      }),
    }),
  });
