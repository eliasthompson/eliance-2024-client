import { configureStore } from '@reduxjs/toolkit';

import { twitch } from '@store/apis/twitch';
import { twitchAuthSlice } from '@store/slices/twitchAuth';

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(twitch.middleware),
  reducer: {
    [twitch.reducerPath]: twitch.reducer,
    [twitchAuthSlice.reducerPath]: twitchAuthSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;