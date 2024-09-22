import { firebotApi } from '.';

export interface FirebotApiGetCustomRolePayload {
  customRoleId: string;
}

export interface FirebotApiGetCustomRoleResponse {
  id: string;
  name: string;
  viewers: {
    id: string;
    username: string;
    displayName: string;
  }[];
}

export const { useGetCustomRoleQuery, useLazyGetCustomRoleQuery } = firebotApi
  .enhanceEndpoints({
    addTagTypes: ['CUSTOM_ROLE_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCustomRole: build.query<FirebotApiGetCustomRoleResponse, FirebotApiGetCustomRolePayload>({
        query: ({ customRoleId }) => ({
          method: 'GET',
          url: `/customRoles/${customRoleId}`,
        }),
        providesTags: (result, error, { customRoleId }) => {
          if (result) return [{ type: 'CUSTOM_ROLE_DATA', id: customRoleId }];
          return [];
        },
      }),
    }),
  });
