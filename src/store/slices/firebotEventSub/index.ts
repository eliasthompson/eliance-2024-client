import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

export interface FirebotEventSubState {
  messageIds: string[];
}

export const initialFirebotEventSubState: FirebotEventSubState = {
  messageIds: [],
};

export const firebotEventSubSlice = createSlice({
  initialState: initialFirebotEventSubState,
  name: 'firebotEventSub',
  reducers: {
    addFirebotEventSubMessageId: (state, { payload }: PayloadAction<FirebotEventSubState['messageIds'][number]>) => {
      state.messageIds.push(payload);
    },
  },
});

export const {
  actions: { addFirebotEventSubMessageId },
} = firebotEventSubSlice;
