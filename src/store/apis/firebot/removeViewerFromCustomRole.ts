import { firebotApi } from '.';

export interface FirebotApiRemoveViewerFromCustomRolePayload {
  customRoleId: string;
  userId: string;
}

export const { useRemoveViewerFromCustomRoleMutation } = firebotApi
  .enhanceEndpoints({
    addTagTypes: ['CUSTOM_ROLE_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      removeViewerFromCustomRole: build.mutation<void, FirebotApiRemoveViewerFromCustomRolePayload>({
        query: ({ customRoleId, userId }) => ({
          method: 'DELETE',
          url: `/customRoles/${customRoleId}/viewer/${userId}`,
        }),
        invalidatesTags: (result, error, { customRoleId }) => {
          return [{ type: 'CUSTOM_ROLE_DATA', id: customRoleId }];
        },
      }),
    }),
  });
