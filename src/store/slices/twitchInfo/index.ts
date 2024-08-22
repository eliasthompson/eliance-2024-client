import type { PayloadAction } from '@reduxjs/toolkit';

import type { TwitchApiGetUsersSuccessResponse } from '@store/apis/twitch/getUsers';

import { createSlice } from '@reduxjs/toolkit';
import { TwitchApiGetCreatorGoalsSuccessResponse } from '@src/store/apis/twitch/getCreatorGoals';

export interface TwitchInfoState {
  broadcasterId: string | null,
  profileImageUrl: string | null,
  goal: Pick<TwitchApiGetCreatorGoalsSuccessResponse['data'][number], 'type' | 'current_amount' | 'target_amount'> | null,
  guests: TwitchApiGetUsersSuccessResponse['data'],
};

export const initialTwitchInfoState: TwitchInfoState = {
  broadcasterId: null,
  profileImageUrl: null,
  goal: null,
  guests: [],
};

export const twitchInfoSlice = createSlice({
  initialState: initialTwitchInfoState,
  name: 'twitchInfo',
  reducers: {
    setTwitchInfo: (state, { payload }: PayloadAction<Partial<TwitchInfoState>>) => {
      Object.assign(state, payload);
    },
  },
})

export const {
  actions: {
    setTwitchInfo,
  },
} = twitchInfoSlice;