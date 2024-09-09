import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query';

export const fetchStaggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: 'http://localhost:7472/api/v1',
  }),
  {
    maxRetries: 100,
  },
);
