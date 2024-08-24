import { configureStore } from '@reduxjs/toolkit';

import { chatPronounsApi } from '@store/apis/chatPronouns';
import { firebotApi } from '@store/apis/firebot';
import { infoSlice } from '@store/slices/info';
import { twitchApi } from '@store/apis/twitch';
import { twitchAuthSlice } from '@store/slices/twitchAuth';
import { twitchEventSubSlice } from '@store/slices/twitchEventSub';

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(chatPronounsApi.middleware)
    .concat(firebotApi.middleware)
    .concat(twitchApi.middleware),
  reducer: {
    [chatPronounsApi.reducerPath]: chatPronounsApi.reducer,
    [firebotApi.reducerPath]: firebotApi.reducer,
    [twitchApi.reducerPath]: twitchApi.reducer,
    [infoSlice.reducerPath]: infoSlice.reducer,
    [twitchAuthSlice.reducerPath]: twitchAuthSlice.reducer,
    [twitchEventSubSlice.reducerPath]: twitchEventSubSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;