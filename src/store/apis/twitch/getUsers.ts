import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiGetUsersRequest {
  ids: string[];
}

export interface TwitchApiGetUsersResponse {
  data: {
    id: string;
    login: string;
    display_name: string;
    type: 'admin' | 'global_mod' | 'staff' | '';
    broadcaster_type: 'affiliate' | 'partner' | '';
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    email: string | null;
    created_at: string;
  }[];
}

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  util: { invalidateTags: invalidateUsersTags, updateQueryData: updateUsersData },
} = twitchApi
  .enhanceEndpoints({
    addTagTypes: ['USER_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getUsers: build.query<TwitchApiGetUsersResponse, TwitchApiGetUsersRequest>({
        query: ({ ids }) => ({
          method: 'GET',
          url: `/users?${ids.map((id) => `id=${id}`).join('&')}`,
        }),
        providesTags: (result, error, { ids }) => {
          if (result) return ids.map((id) => ({ type: 'USER_DATA', id }));
          if (error?.status === 401) return ['UNAUTHORIZED'];
          return [];
        },
      }),
    }),
  });
