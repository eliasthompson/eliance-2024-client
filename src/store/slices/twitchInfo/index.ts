import type { PayloadAction } from '@reduxjs/toolkit';

import type { TwitchApiGetUsersResponse } from '@store/apis/twitch/getUsers';

import { createSlice } from '@reduxjs/toolkit';
import { TwitchApiGetCreatorGoalsResponse } from '@src/store/apis/twitch/getCreatorGoals';

export interface TwitchInfoState {
  goal: TwitchApiGetCreatorGoalsResponse['data'][number] | null,
  guests: TwitchApiGetUsersResponse['data'],
  user: TwitchApiGetUsersResponse['data'][number] | null,
};

export const initialTwitchInfoState: TwitchInfoState = {
  goal: null,
  guests: [],
  user: null,
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