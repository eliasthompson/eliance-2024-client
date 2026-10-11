import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

export interface TwitchAuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

export const initialTwitchAuthState: TwitchAuthState = {
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
};

export const twitchAuthSlice = createSlice({
  initialState: initialTwitchAuthState,
  name: 'twitchAuth',
  reducers: {
    clearTwitchAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    setTwitchAuth: (state, { payload }: PayloadAction<Partial<TwitchAuthState>>) => {
      Object.assign(state, payload);

      for (const [key, value] of Object.entries(payload)) {
        if (typeof value === 'string') localStorage.setItem(key, value);
        else localStorage.removeItem(key);
      }
    },
  },
});

export const {
  actions: { clearTwitchAuth, setTwitchAuth },
} = twitchAuthSlice;
