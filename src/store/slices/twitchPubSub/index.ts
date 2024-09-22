import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

export interface TwitchPubSubState {
  messageIds: string[];
}

export const initialTwitchPubSubState: TwitchPubSubState = {
  messageIds: [],
};

export const twitchPubSubSlice = createSlice({
  initialState: initialTwitchPubSubState,
  name: 'twitchPubSub',
  reducers: {
    addTwitchPubSubMessageId: (state, { payload }: PayloadAction<TwitchPubSubState['messageIds'][number]>) => {
      state.messageIds.push(payload);
    },
  },
});

export const {
  actions: { addTwitchPubSubMessageId },
} = twitchPubSubSlice;
