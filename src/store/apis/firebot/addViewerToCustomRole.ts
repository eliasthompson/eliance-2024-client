import type { FirebotApiErrorResponse } from '@store/apis/firebot';

import { firebotApi } from '.';

export interface FirebotApiAddViewerToCustomRolePayload {
  customRoleId: string,
  userId: string,
};

export const { useAddViewerToCustomRoleMutation } = firebotApi.enhanceEndpoints({
  addTagTypes: ['CUSTOM_ROLE_DATA'],
}).injectEndpoints({
  endpoints: (build) => ({
    addViewerToCustomRole: build.mutation<void | FirebotApiErrorResponse, FirebotApiAddViewerToCustomRolePayload>({
      query: ({ customRoleId, userId }) => ({
        method: 'GET',
        url: `/customRoles/${customRoleId}/viewer/${userId}`,
      }),
      invalidatesTags: (result, error, { customRoleId }) => {
        return [{ type: 'CUSTOM_ROLE_DATA', id: customRoleId }];
      },
    }),
  })
});
