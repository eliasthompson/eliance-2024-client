import { twitchApi } from '.';

export interface TwitchApiGetUsersRequest {
  logins: string[],
}

export interface TwitchApiGetUsersSuccessResponse {
  data: {
    id: string,
    login: string,
    display_name: string,
    type: 'admin' | 'global_mod' | 'staff' | '',
    broadcaster_type: 'affiliate' | 'partner' | '',
    description: string,
    profile_image_url: string,
    offline_image_url: string,
    email: string,
    created_at: string,
  }[],
}

export const { useGetUsersQuery } = twitchApi.enhanceEndpoints({
  addTagTypes: ['USER_DATA'],
}).injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<TwitchApiGetUsersSuccessResponse, TwitchApiGetUsersRequest>({
      query: ({ logins }) => ({
        method: 'GET',
        url: `/users?${logins.map((login) => `login=${login}`).join('&')}`,
      }),
      providesTags: (result, error, { logins }) => {
        if (result) return logins.map((login) => ({ type: 'USER_DATA', id: login }));
        if (error?.status === 401) return ['UNAUTHORIZED'];
        return [];
      }
    }),
  })
});