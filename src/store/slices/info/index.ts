import type { PayloadAction } from '@reduxjs/toolkit';

import type { ErrorMessageProps } from '@components/shared/ErrorMessage/types';
import type { TwitchApiGetCreatorGoalsResponse } from '@src/store/apis/twitch/getCreatorGoals';
import type { TwitchApiGetUsersResponse } from '@store/apis/twitch/getUsers';
import type { TwitchEventSubChannelChatMessageNotificationMessage } from '@store/apis/twitch/createEventSubSubscriptionChannelChatMessage';
import type { TwitchEventSubChannelChatNotificationNotificationMessage } from '@store/apis/twitch/createEventSubSubscriptionChannelChatNotification';

import { createSlice } from '@reduxjs/toolkit';

export interface InfoState {
  broadcasterId: string | null;
  broadcasterLogin: string | null;
  broadcasterColor: string | null;
  chats: ((
    | TwitchEventSubChannelChatMessageNotificationMessage['payload']['event']
    | TwitchEventSubChannelChatNotificationNotificationMessage['payload']['event']
  ) & {
    deletedTimestamp?: string;
    messageTimestamp: string;
    pinId?: string;
  })[];
  errors: ErrorMessageProps['error'][];
  goal: TwitchApiGetCreatorGoalsResponse['data'][number] | null;
  persons: (TwitchApiGetUsersResponse['data'][number] & {
    active: boolean;
    color?: string;
    isLive?: boolean;
    isSharing?: boolean;
    name?: string;
    pronouns?: string;
  })[];
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
  broadcasterId: null,
  broadcasterLogin: null,
  broadcasterColor: null,
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
      if (state.chats.length > 150) state.chats.shift();

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
    clearChats,
    removeChatPinId,
    removeError,
    setChatDeletedTimestamp,
    setChatPinId,
    setUserChatsDeletedTimestamp,
    setInfo,
  },
} = infoSlice;
