import { chatPronounsApi } from '.';

export interface ChatPronounsApiGetPronounsResponse {
  display: string;
  name: string;
}

export const { useGetPronounsQuery } = chatPronounsApi
  .enhanceEndpoints({
    addTagTypes: ['PRONOUN_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getPronouns: build.query<ChatPronounsApiGetPronounsResponse[], void>({
        query: () => ({
          method: 'GET',
          url: '/pronouns',
        }),
        providesTags: (result) => {
          if (result)
            return result.map(({ name }) => ({
              type: 'PRONOUN_DATA',
              id: name,
            }));
          return [];
        },
      }),
    }),
  });
