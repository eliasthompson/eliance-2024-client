import { twitchApi } from '@store/apis/twitch';

export interface TwitchApiGetCharityCampaignRequest {
  broadcasterId: string;
}

export interface TwitchApiGetCharityCampaignAmount {
  value: number;
  decimal_places: number;
  currency: string;
}

export interface TwitchApiGetCharityCampaignResponse {
  data: {
    id: string;
    broadcaster_id: string;
    broadcaster_name: string;
    broadcaster_login: string;
    charity_name: string;
    charity_description: string;
    charity_logo: string;
    charity_website: string;
    current_amount: TwitchApiGetCharityCampaignAmount;
    target_amount: TwitchApiGetCharityCampaignAmount;
  }[];
}

export const {
  useGetCharityCampaignQuery,
  useLazyGetCharityCampaignQuery,
  util: { invalidateTags: invalidateCharityCampaignTags, updateQueryData: updateCharityCampaignData },
} = twitchApi
  .enhanceEndpoints({
    addTagTypes: ['CHARITY_CAMPAIGN_DATA'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCharityCampaign: build.query<TwitchApiGetCharityCampaignResponse, TwitchApiGetCharityCampaignRequest>({
        query: ({ broadcasterId }) => ({
          method: 'GET',
          url: `/charity/campaigns?broadcaster_id=${broadcasterId}`,
        }),
        providesTags: (result, error, { broadcasterId }) => {
          if (result) return [{ type: 'CHARITY_CAMPAIGN_DATA', id: broadcasterId }];
          if (error?.status === 401) return ['UNAUTHORIZED'];
          return [];
        },
      }),
    }),
  });
