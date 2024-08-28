import type { PayloadAction } from '@reduxjs/toolkit';

import type { ErrorMessageProps } from '@components/shared/ErrorMessage/types';
import type { TwitchApiGetCreatorGoalsResponse } from '@src/store/apis/twitch/getCreatorGoals';
import type { TwitchApiGetUsersResponse } from '@store/apis/twitch/getUsers';
import type { TwitchEventSubChannelChatMessageNotificationMessage } from '@store/apis/twitch/createEventSubSubscriptionChannelChatMessage';
import type { TwitchEventSubChannelChatNotificationNotificationMessage } from '@store/apis/twitch/createEventSubSubscriptionChannelChatNotification';

import { createSlice } from '@reduxjs/toolkit';

export type InfoUser = TwitchApiGetUsersResponse['data'][number] & {
  active: boolean,
  color?: string,
  isLive?: boolean,
  isSharing?: boolean,
  name?: string,
  pronouns?: string,
};

export interface InfoState {
  broadcasterId: string | null,
  broadcasterLogin: string | null,
  chats: (TwitchEventSubChannelChatMessageNotificationMessage['payload']['event'] | TwitchEventSubChannelChatNotificationNotificationMessage['payload']['event'])[],
  errors: ErrorMessageProps['error'][],
  goal: TwitchApiGetCreatorGoalsResponse['data'][number] | null,
  persons: InfoUser[],
};

export const initialInfoState: InfoState = {
  broadcasterId: null,
  broadcasterLogin: null,
  chats: [],
  errors: [],
  goal: null,
  persons: [],
};

export const infoSlice = createSlice({
  initialState: initialInfoState,
  name: 'info',
  reducers: {
    addChat: (state, { payload }: PayloadAction<InfoState['chats'][number]>) => {
      state.chats.push(payload);
      if (state.chats.length > 100) state.chats.shift();
    },
    addError: (state, { payload }: PayloadAction<InfoState['errors'][number]>) => {
      state.errors.push(payload);
    },
    removeError: (state, { payload }: PayloadAction<number>) => {
      state.errors.splice(payload, 1);
    },
    setInfo: (state, { payload }: PayloadAction<Partial<InfoState>>) => {
      Object.assign(state, payload);
    },
  },
})

export const {
  actions: {
    addChat,
    addError,
    removeError,
    setInfo,
  },
} = infoSlice;