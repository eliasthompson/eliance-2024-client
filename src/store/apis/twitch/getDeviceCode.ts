import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiGetDeviceCodeRequest {
  clientId: string;
  scopes: string[];
}

export interface TwitchApiGetDeviceCodeResponse {
  device_code: string;
  expires_in: number;
  interval: number;
  user_code: string;
  verification_uri: string;
}

export const { useGetDeviceCodeQuery } = twitchApi.injectEndpoints({
  endpoints: (build) => ({
    getDeviceCode: build.query<TwitchApiGetDeviceCodeResponse, TwitchApiGetDeviceCodeRequest>({
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
  }),
});
