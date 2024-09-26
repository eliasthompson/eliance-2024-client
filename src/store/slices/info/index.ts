import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { FirebotApiErrorResponse } from '@store/apis/firebot';
import type { TwitchApiErrorResponse } from '@store/apis/twitch';
import type { TwitchEventSubChannelChatMessageNotificationMessageEvent } from '@store/apis/twitch/createEventSubSubscription/channelChatMessage';
import type { TwitchEventSubChannelChatNotificationNotificationMessageEvent } from '@store/apis/twitch/createEventSubSubscription/channelChatNotification';

import { createSlice } from '@reduxjs/toolkit';

export interface Alert {
  id: string;
  color?: string;
  imageUrl?: string;
  isMinor: boolean;
  isQueued: boolean;
  message: Omit<TwitchEventSubChannelChatNotificationNotificationMessageEvent['message'], 'fragments'> & {
    fragments?: TwitchEventSubChannelChatNotificationNotificationMessageEvent['message']['fragments'];
  };
  timestamp: string;
  type: 'announcement' | 'channelPointRedemption' | 'cheer' | 'sub';
  userName: string;
}
export interface ApiError {
  status: number;
  data: FirebotApiErrorResponse | TwitchApiErrorResponse;
}
export interface Person {
  id: string;
  login: string;
  profileImageUrl: string;
  name: string;
  color: string;
  isActive: boolean;
  isLive: boolean;
  pronouns?: string;
  socialHandle?: string;
  socialPlatform?: string;
  timeZone?: string;
}
export interface InfoState {
  activeAlert: Alert | null;
  alerts: Alert[];
  broadcasterId: string | null;
  broadcasterLogin: string | null;
  broadcasterColor: string | null;
  chats: ((
    | TwitchEventSubChannelChatMessageNotificationMessageEvent
    | TwitchEventSubChannelChatNotificationNotificationMessageEvent
  ) & {
    deletedTimestamp?: string;
    messageTimestamp: string;
    pinId?: string;
  })[];
  errors: (Error | FetchBaseQueryError)[];
  isAlertsPaused: boolean;
  personIds: Person['id'][];
  persons: Person[];
}

export const getStoredRecentChats = (ex: number = 60 * 60 * 1000) => {
  let localStoredChats: InfoState['chats'] = [];

  try {
    const localStoredChatsItem = localStorage.getItem('recentChats');

    if (localStoredChatsItem !== null) localStoredChats = JSON.parse(localStoredChatsItem);
    else localStorage.setItem('recentChats', JSON.stringify([]));
  } catch (error) {
    //
  }

  return localStoredChats.filter((localStoredChat) => {
    const chatTime = new Date(localStoredChat.messageTimestamp).getTime();
    const referenceDate = new Date().getTime() - ex;

    return chatTime > referenceDate;
  });
};

export const initialInfoState: InfoState = {
  activeAlert: null,
  alerts: [],
  broadcasterId: null,
  broadcasterLogin: null,
  broadcasterColor: null,
  chats: getStoredRecentChats(),
  errors: [],
  isAlertsPaused: false,
  personIds: [],
  persons: [],
};

export const infoSlice = createSlice({
  initialState: initialInfoState,
  name: 'info',
  reducers: {
    addAlert: (state, { payload }: PayloadAction<InfoState['alerts'][number]>) => {
      state.alerts.push(payload);
    },
    addChat: (state, { payload }: PayloadAction<InfoState['chats'][number]>) => {
      state.chats.push(payload);
      if (state.chats.length > 150) state.chats.shift();

      const storedRecentChats = getStoredRecentChats();

      storedRecentChats.push(payload);
      if (storedRecentChats.length > 3) storedRecentChats.shift();

      localStorage.setItem('recentChats', JSON.stringify(storedRecentChats));
    },
    addError: (state, { payload }: PayloadAction<InfoState['errors'][number]>) => {
      state.errors.push(payload);
    },
    addPerson: (state, { payload }: PayloadAction<InfoState['persons'][number]>) => {
      state.persons.push(payload);
    },
    changeAlert: (
      state,
      { payload }: PayloadAction<Partial<InfoState['alerts'][number]> & { id: InfoState['alerts'][number]['id'] }>,
    ) => {
      const { id: alertId, ...alert } = payload;
      const alertIndex = state.alerts.findIndex(({ id }) => id === alertId);

      if (alertIndex !== -1) Object.assign(state.alerts[alertIndex], alert);
    },
    clearChats: (state) => {
      state.chats.length = 0;
      localStorage.setItem('recentChats', JSON.stringify([]));
    },
    removeChatPinId: (
      state,
      {
        payload,
      }: PayloadAction<{
        pinId: InfoState['chats'][number]['pinId'];
      }>,
    ) => {
      const findChatIndex = ({ pinId }: InfoState['chats'][number]) => pinId === payload.pinId;
      const chatIndex = state.chats.findIndex(findChatIndex);

      if (chatIndex !== -1) state.chats[chatIndex].pinId = undefined;

      const storedRecentChats = getStoredRecentChats();
      const storedChatIndex = storedRecentChats.findIndex(findChatIndex);

      if (storedChatIndex !== -1) storedRecentChats[storedChatIndex].pinId = undefined;

      localStorage.setItem('recentChats', JSON.stringify(storedRecentChats));
    },
    removeError: (state, { payload }: PayloadAction<number>) => {
      state.errors.splice(payload, 1);
    },
    rotatePersonisActive: (state) => {
      const newPersons = [...state.persons];
      const currentActiveIndex = newPersons.findIndex(({ isActive }) => isActive);
      const nextActiveIndex = currentActiveIndex === newPersons.length - 1 ? 0 : currentActiveIndex + 1;

      for (const i in newPersons) {
        if (Number(i) === nextActiveIndex) newPersons[i].isActive = true;
        else newPersons[i].isActive = false;
      }

      state.persons = newPersons;
    },
    setChatDeletedTimestamp: (
      state,
      {
        payload,
      }: PayloadAction<{
        messageId: InfoState['chats'][number]['message_id'];
        deletedTimestamp: InfoState['chats'][number]['deletedTimestamp'];
      }>,
    ) => {
      const findChatIndex = ({ message_id: messageId }) => messageId === payload.messageId;
      const chatIndex = state.chats.findIndex(findChatIndex);

      state.chats[chatIndex].deletedTimestamp = payload.deletedTimestamp;

      const storedRecentChats = getStoredRecentChats();
      const storedChatIndex = storedRecentChats.findIndex(findChatIndex);

      storedRecentChats[storedChatIndex].deletedTimestamp = payload.deletedTimestamp;

      localStorage.setItem('recentChats', JSON.stringify(storedRecentChats));
    },
    setChatPinId: (
      state,
      {
        payload,
      }: PayloadAction<{
        messageId: InfoState['chats'][number]['message_id'];
        pinId: InfoState['chats'][number]['pinId'];
      }>,
    ) => {
      for (const [i, chat] of Object.entries(state.chats)) {
        if (chat.pinId) state.chats[i].pinId = undefined;
      }

      const findChatIndex = ({ message_id: messageId }) => messageId === payload.messageId;
      const chatIndex = state.chats.findIndex(findChatIndex);

      if (chatIndex !== -1) state.chats[chatIndex].pinId = payload.pinId;

      const storedRecentChats = getStoredRecentChats();
      const storedChatIndex = storedRecentChats.findIndex(findChatIndex);

      if (storedChatIndex !== -1) storedRecentChats[storedChatIndex].pinId = payload.pinId;

      localStorage.setItem('recentChats', JSON.stringify(storedRecentChats));
    },
    setUserChatsDeletedTimestamp: (
      state,
      {
        payload,
      }: PayloadAction<{
        chatterUserId: InfoState['chats'][number]['chatter_user_id'];
        deletedTimestamp: InfoState['chats'][number]['deletedTimestamp'];
      }>,
    ) => {
      for (const [i, chat] of Object.entries(state.chats)) {
        if (chat.chatter_user_id === payload.chatterUserId) state.chats[i].deletedTimestamp = payload.deletedTimestamp;
      }

      const storedRecentChats = getStoredRecentChats();

      for (const [i, chat] of Object.entries(storedRecentChats)) {
        if (chat.chatter_user_id === payload.chatterUserId)
          storedRecentChats[i].deletedTimestamp = payload.deletedTimestamp;
      }

      localStorage.setItem('recentChats', JSON.stringify(storedRecentChats));
    },
    setInfo: (state, { payload }: PayloadAction<Partial<InfoState>>) => {
      Object.assign(state, payload);
    },
  },
});

export const {
  actions: {
    addChat,
    addError,
    addAlert,
    addPerson,
    changeAlert,
    clearChats,
    removeChatPinId,
    removeError,
    rotatePersonisActive,
    setChatDeletedTimestamp,
    setChatPinId,
    setUserChatsDeletedTimestamp,
    setInfo,
  },
} = infoSlice;
