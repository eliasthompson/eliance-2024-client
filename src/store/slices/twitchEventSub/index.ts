import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

export interface TwitchEventSubState {
  messageIds: string[];
  sessionId: string | null;
}

export const initialTwitchEventSubState: TwitchEventSubState = {
  messageIds: [],
  sessionId: null,
};

export const twitchEventSubSlice = createSlice({
  initialState: initialTwitchEventSubState,
  name: 'twitchEventSub',
  reducers: {
    addTwitchEventSubMessageId: (state, { payload }: PayloadAction<TwitchEventSubState['messageIds'][number]>) => {
      state.messageIds.push(payload);
    },
    setTwitchEventSub: (state, { payload }: PayloadAction<Partial<TwitchEventSubState>>) => {
      Object.assign(state, payload);
    },
  },
});

export const {
  actions: { addTwitchEventSubMessageId, setTwitchEventSub },
} = twitchEventSubSlice;
