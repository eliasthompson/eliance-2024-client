import { configureStore } from '@reduxjs/toolkit';

import { chatPronounsApi } from '@store/apis/chatPronouns';
import { twitchApi } from '@store/apis/twitch';
import { twitchAuthSlice } from '@store/slices/twitchAuth';
import { twitchEventSubSlice } from '@store/slices/twitchEventSub';
import { twitchInfoSlice } from '@store/slices/twitchInfo';

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(chatPronounsApi.middleware)
    .concat(twitchApi.middleware),
  reducer: {
    [chatPronounsApi.reducerPath]: chatPronounsApi.reducer,
    [twitchApi.reducerPath]: twitchApi.reducer,
    [twitchAuthSlice.reducerPath]: twitchAuthSlice.reducer,
    [twitchEventSubSlice.reducerPath]: twitchEventSubSlice.reducer,
    [twitchInfoSlice.reducerPath]: twitchInfoSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;