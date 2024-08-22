// import { twitchApi } from '.';

// export const { useGetEventSubMessageQuery } = twitchApi.injectEndpoints({
//   endpoints: (build) => ({
//     getEventSubMessage: build.query<{ messageIds: string[] }, void>({
//       queryFn: () => ({ data: { messageIds: [] } }),
//       onCacheEntryAdded: async (arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) => {
//         const twitchEventSub = new WebSocket('wss://eventsub.wss.twitch.tv/ws');

//         try {
//           // wait for the initial query to resolve before proceeding
//           await cacheDataLoaded;

//           // when data is received from the socket connection to the server,
//           // if it is a message and for the appropriate channel,
//           // update our query result with the received message
//           twitchEventSub.addEventListener('message', ({ data: messageData }: MessageEvent) => {
//             const data = JSON.parse(messageData);

//             if (data.channel !== arg) return;

//             updateCachedData((updateRecipe) => updateRecipe.messageIds.push(data));
//           });
//         } catch {
//           // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
//           // in which case `cacheDataLoaded` will throw
//         }
//         // cacheEntryRemoved will resolve when the cache subscription is no longer active
//         await cacheEntryRemoved;
//         // perform cleanup steps once the `cacheEntryRemoved` promise resolves
//         twitchEventSub.close();
//       },
//     }),
//   }),
// });
