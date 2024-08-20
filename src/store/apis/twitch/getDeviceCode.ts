import { twitchApi } from '.';

export interface TwitchApiGetDeviceCodeRequest {
  clientId: string,
  scopes: string[],
}

export interface TwitchApiGetDeviceCodeSuccessResponse {
  device_code: string,
  expires_in: number,
  interval: number,
  user_code: string,
  verification_uri: string,
};

export const { useLazyGetDeviceCodeQuery } = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    getDeviceCode: build.query<TwitchApiGetDeviceCodeSuccessResponse, TwitchApiGetDeviceCodeRequest>({
      query: ({ clientId, scopes }) => ({
        body: new URLSearchParams({
          client_id: clientId,
          scopes: scopes.join(' '),
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        url: 'https://id.twitch.tv/oauth2/device',
      }),
    }),
  })
});
