import type { PayloadAction } from '@reduxjs/toolkit';

import type { TwitchApiGetCreatorGoalsResponse } from '@src/store/apis/twitch/getCreatorGoals';
import type { TwitchApiGetUsersResponse } from '@store/apis/twitch/getUsers';

import { createSlice } from '@reduxjs/toolkit';

export type InfoUser = TwitchApiGetUsersResponse['data'][number] & {
  color?: string,
  isLive?: boolean,
  isSharing?: boolean,
  name?: string,
  pronouns?: string,
};

export interface InfoState {
  customRoleId: string,
  goal: TwitchApiGetCreatorGoalsResponse['data'][number] | null,
  guests: InfoUser[],
  user: InfoUser | null,
};

export const initialInfoState: InfoState = {
  customRoleId: '805d6510-9e0a-11ee-a7ad-09ce7f9a4a71',
  goal: null,
  guests: [],
  user: null,
};

export const infoSlice = createSlice({
  initialState: initialInfoState,
  name: 'info',
  reducers: {
    setInfo: (state, { payload }: PayloadAction<Partial<InfoState>>) => {
      Object.assign(state, payload);
    },
  },
})

export const {
  actions: {
    setInfo,
  },
} = infoSlice;