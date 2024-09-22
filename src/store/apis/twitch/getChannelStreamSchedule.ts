import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiGetChannelStreamScheduleRequest {
  broadcasterId: string;
}

export interface TwitchApiGetChannelStreamScheduleResponse {
  data: {
    segments: {
      id: string;
      start_time: string;
      end_time: string;
      title: string;
      cancelled_until: string | null;
      category: {
        id: string;
        name: string;
      } | null;
      is_recurring: boolean;
    }[];
    broadcaster_id: string;
    broadcaster_name: string;
    broadcaster_login: string;
    vacation: {
      start_time: string;
      end_time: string;
    } | null;
  };
  pagination: {
    cursor?: string;
  };
}

export const {
  useGetChannelStreamScheduleQuery,
  useLazyGetChannelStreamScheduleQuery,
  util: { invalidateTags: invalidateChannelStreamScheduleTags, updateQueryData: updateChannelStreamScheduleData },
} = twitchApi
  .enhanceEndpoints({
    addTagTypes: ['CHANNEL_STREAM_SCHEDULE_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getChannelStreamSchedule: build.query<
        TwitchApiGetChannelStreamScheduleResponse,
        TwitchApiGetChannelStreamScheduleRequest
      >({
        query: ({ broadcasterId }) => ({
          method: 'GET',
          url: `/schedule?broadcaster_id=${broadcasterId}`,
        }),
        providesTags: (result, error, { broadcasterId }) => {
          if (result) return [{ type: 'CHANNEL_STREAM_SCHEDULE_DATA', id: broadcasterId }];
          if (error?.status === 401) return ['UNAUTHORIZED'];
          return [];
        },
      }),
    }),
  });
