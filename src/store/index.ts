import { configureStore } from '@reduxjs/toolkit';

import { twitchApi } from '@store/apis/twitch';
import { twitchAuthSlice } from '@store/slices/twitchAuth';

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(twitchApi.middleware),
  reducer: {
    [twitchApi.reducerPath]: twitchApi.reducer,
    [twitchAuthSlice.reducerPath]: twitchAuthSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;