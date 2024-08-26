import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import type { FirebotApiErrorResponse } from '@store/apis/firebot';
import type { TwitchApiErrorResponse } from '@store/apis/twitch';

export interface ApiError {
  status: number,
  data: FirebotApiErrorResponse | TwitchApiErrorResponse,
};

export interface ErrorMessageProps {
  error: (Error | FetchBaseQueryError) & {

  },
};
