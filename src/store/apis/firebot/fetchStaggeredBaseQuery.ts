import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query';

// Retry while Firebot is unreachable, since it may start after the overlay, but not on client errors such as a missing
// custom role, which a retry cannot fix. Without maxRetries the default backoff stops growing at the fifth attempt, so
// retries come every 4 to 13 seconds.
export const fetchStaggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: 'http://localhost:7472/api/v1',
  }),
  {
    retryCondition: (error, args, { attempt }) => {
      const { status } = error as FetchBaseQueryError;

      return attempt <= 100 && !(typeof status === 'number' && status >= 400 && status < 500);
    },
  },
);
