import type { PayloadAction } from '@reduxjs/toolkit';

import type { ErrorMessageProps } from '@components/shared/ErrorMessage/types';
import type { TwitchApiGetCreatorGoalsResponse } from '@src/store/apis/twitch/getCreatorGoals';
import type { TwitchApiGetUsersResponse } from '@store/apis/twitch/getUsers';
import type { TwitchEventSubChannelChatMessageNotificationMessage } from '@store/apis/twitch/createEventSubSubscriptionChannelChatMessage';
import type { TwitchEventSubChannelChatNotificationNotificationMessage } from '@store/apis/twitch/createEventSubSubscriptionChannelChatNotification';

import { createSlice } from '@reduxjs/toolkit';

export type InfoUser = TwitchApiGetUsersResponse['data'][number] & {
  active: boolean;
  color?: string;
  isLive?: boolean;
  isSharing?: boolean;
  name?: string;
  pronouns?: string;
};

export interface InfoState {
  broadcasterId: string | null;
  broadcasterLogin: string | null;
  chats: ((
    | TwitchEventSubChannelChatMessageNotificationMessage['payload']['event']
    | TwitchEventSubChannelChatNotificationNotificationMessage['payload']['event']
  ) & {
    isDeleted?: boolean;
  })[];
  errors: ErrorMessageProps['error'][];
  goal: TwitchApiGetCreatorGoalsResponse['data'][number] | null;
  persons: InfoUser[];
}

export const getStoredRecentChats = () => {
  let localStoredChats: InfoState['chats'] = [];

  try {
    const localStoredChatsItem = localStorage.getItem('recentChats');

    if (localStoredChatsItem !== null) localStoredChats = JSON.parse(localStoredChatsItem);
    else localStorage.setItem('recentChats', JSON.stringify([]));
  } catch (error) {
    //
  }

  return localStoredChats;
};

export const initialInfoState: InfoState = {
  broadcasterId: null,
  broadcasterLogin: null,
  chats: getStoredRecentChats(),
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

      const storedRecentChats = getStoredRecentChats();

      storedRecentChats.push(payload);
      if (storedRecentChats.length > 3) storedRecentChats.shift();

      localStorage.setItem('recentChats', JSON.stringify(storedRecentChats));
    },
    addError: (state, { payload }: PayloadAction<InfoState['errors'][number]>) => {
      state.errors.push(payload);
    },
    clearChats: (state) => {
      state.chats.length = 0;
      localStorage.setItem('recentChats', JSON.stringify([]));
    },
    removeError: (state, { payload }: PayloadAction<number>) => {
      state.errors.splice(payload, 1);
    },
    setInfo: (state, { payload }: PayloadAction<Partial<InfoState>>) => {
      Object.assign(state, payload);
    },
  },
});

export const {
  actions: { addChat, addError, clearChats, removeError, setInfo },
} = infoSlice;
