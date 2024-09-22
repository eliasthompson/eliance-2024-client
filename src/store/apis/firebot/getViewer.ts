import { firebotApi } from '.';

export interface FirebotApiGetViewerPayload {
  userId: string;
}

export interface FirebotApiGetViewerResponse {
  username: string;
  _id: string;
  displayName: string;
  profilePicUrl: string;
  twitch: boolean;
  twitchRoles: string[];
  online: boolean;
  onlineAt: number;
  lastSeen: number;
  joinDate: number;
  minutesInChannel: number;
  chatMessages: number;
  disableAutoStatAccrual: boolean;
  disableActiveUserList: boolean;
  disableViewerList: boolean;
  metadata: {
    color?: string;
    isSharing?: boolean;
    name?: string;
    pronouns?: string;
    socialPlatform?: string;
    socialHandle?: string;
    timeZone?: string;
    [key: string]: unknown;
  };
  currency: object;
  customRoles: {
    id: string;
    name: string;
  }[];
}

export const { useGetViewerQuery, useLazyGetViewerQuery } = firebotApi
  .enhanceEndpoints({
    addTagTypes: ['VIEWER_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getViewer: build.query<FirebotApiGetViewerResponse, FirebotApiGetViewerPayload>({
        query: ({ userId }) => ({
          method: 'GET',
          url: `/viewers/${userId}`,
        }),
        providesTags: (result, error, { userId }) => {
          if (result) return [{ type: 'VIEWER_DATA', id: userId }];
          return [];
        },
      }),
    }),
  });
