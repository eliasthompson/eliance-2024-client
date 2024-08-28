import type { ChatPronounsApiGetPronounsResponse } from './getPronouns';

import { chatPronounsApi } from '.';

export interface ChatPronounsApiGetUserPayload {
  login: string;
}

export interface ChatPronounsApiGetUserResponse {
  id: string;
  login: string;
  pronoun_id: ChatPronounsApiGetPronounsResponse['name'];
}

export const { useGetUserQuery } = chatPronounsApi
  .enhanceEndpoints({
    addTagTypes: ['USER_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getUser: build.query<ChatPronounsApiGetUserResponse[], ChatPronounsApiGetUserPayload>({
        query: ({ login }) => ({
          method: 'GET',
          url: `/users/${login}`,
        }),
        providesTags: (result) => {
          if (result) return result.map(({ id }) => ({ type: 'USER_DATA', id }));
          return [];
        },
      }),
    }),
  });
