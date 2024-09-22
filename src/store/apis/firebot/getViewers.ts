import { firebotApi } from '.';

export interface FirebotApiGetViewersResponse {
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

export const { useGetViewersQuery, useLazyGetViewersQuery } = firebotApi
  .enhanceEndpoints({
    addTagTypes: ['VIEWERS_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getViewers: build.query<FirebotApiGetViewersResponse[], void>({
        query: () => ({
          method: 'GET',
          url: '/viewers/export',
        }),
        providesTags: (result) => {
          if (result) return result.map(({ _id: id }) => ({ type: 'VIEWERS_DATA', id }));
          return [];
        },
      }),
    }),
  });
