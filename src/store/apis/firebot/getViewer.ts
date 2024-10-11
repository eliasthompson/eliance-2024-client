import { firebotApi } from '.';

export type ContentStates =
  | '3DS_CAPTURE_BOTTOM_NATIVE'
  | '3DS_CAPTURE_BOTTOM'
  | '3DS_CAPTURE_TOP_4_3_NATIVE'
  | '3DS_CAPTURE_TOP_4_3'
  | '3DS_CAPTURE_TOP'
  | '3DS_CAPTURE_5_6'
  | '3DS_CAPTURE_4_6'
  | '3DS_CAPTURE_4_6_NATIVE'
  | '3DS_CAPTURE'
  | 'APPLEWOOD'
  | 'BACKLOG_WHEEL'
  | 'CITRA_BOTTOM'
  | 'CITRA_TOP'
  | 'CITRA_5_6'
  | 'CITRA'
  | 'CONSOLE_HD_10_9'
  | 'CONSOLE_HD_16_15'
  | 'CONSOLE_HD_3_2'
  | 'CONSOLE_HD_4_3'
  | 'CONSOLE_HD_8_7'
  | 'CONSOLE_HD'
  | 'CONSOLE_SD_10_9'
  | 'CONSOLE_SD_16_15'
  | 'CONSOLE_SD_3_2'
  | 'CONSOLE_SD_8_7'
  | 'CONSOLE_SD'
  | 'DS_CAPTURE_BOTTOM'
  | 'DS_CAPTURE_TOP'
  | 'DS_CAPTURE'
  | 'GAME_CAPTURE'
  | 'MELONDS_BOTTOM'
  | 'MELONDS_TOP'
  | 'MELONDS'
  | 'MONITOR_CENTER'
  | 'MONITOR_LEFT'
  | 'MONITOR_RIGHT'
  | 'MONITOR_TV'
  | 'SNICKERSTREAM_BOTTOM_NATIVE'
  | 'SNICKERSTREAM_BOTTOM'
  | 'SNICKERSTREAM_TOP_4_3_NATIVE'
  | 'SNICKERSTREAM_TOP_4_3'
  | 'SNICKERSTREAM_TOP'
  | 'SNICKERSTREAM_5_6'
  | 'SNICKERSTREAM_4_6'
  | 'SNICKERSTREAM_4_6_NATIVE'
  | 'SNICKERSTREAM'
  | 'TWITCH_1P_SCREENSHARE'
  | 'XMIRAGE_18_39'
  | 'XMIRAGE_3_4'
  | 'XMIRAGE_39_18'
  | 'XMIRAGE_4_3'
  | 'XMIRAGE';

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
    cameraState?:
      | 'CAMERA_1_BORDERED'
      | 'CAMERA_1_FILTERED'
      | 'CAMERA_1_KEYED'
      | 'CAMERA_1_TALL'
      | 'CAMERA_2_BORDERED'
      | 'CAMERA_2_KEYED'
      | 'CAMERA_2_TALL'
      | 'CAMERA_3_BORDERED'
      | 'DISCORD_1P_1P'
      | 'DISCORD_2P_1P'
      | 'DISCORD_2P_2P'
      | 'DISCORD_3P_1P'
      | 'DISCORD_3P_2P'
      | 'DISCORD_3P_3P'
      | 'DISCORD_4P_1P'
      | 'DISCORD_4P_2P'
      | 'DISCORD_4P_3P'
      | 'DISCORD_4P_4P'
      | 'TWITCH_1P'
      | 'TWITCH_2P'
      | 'TWITCH_3P'
      | 'TWITCH_4P'
      | 'TWITCH_5P'
      | 'TWITCH_6P'
      | 'HIDDEN';
    color?: string;
    contentMainState?: ContentStates | 'HIDDEN';
    contentInfoState?: 'INPUTS_TIMER_VERTICAL' | 'INPUTS' | 'METROID_SAMUS_RETURNS_TRACKER' | 'TIMER' | 'HIDDEN';
    contentSideState?: ContentStates | 'INPUTS_TIMER' | 'INPUTS' | 'TIMER' | 'HIDDEN';
    isSharing?: boolean;
    isNamed?: boolean;
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
