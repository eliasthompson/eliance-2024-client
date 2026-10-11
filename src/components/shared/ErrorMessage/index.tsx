import type { ApiError } from '@store/slices/info';
import type { ErrorMessageProps } from '@components/shared/ErrorMessage/types';

import { css } from '@emotion/react';

import { isRecord } from '@lib/isRecord';

export const isApiError = (error: unknown): error is ApiError =>
  isRecord(error) && typeof error.status === 'number' && !(error instanceof Error);

export const ErrorMessage = ({ error: providedError }: ErrorMessageProps) => {
  const cssStrong = css`
    color: #ff0000;
  `;
  let error = providedError;

  if (isApiError(error)) {
    const { data, status } = error;

    error = new Error(data.message);

    if ('error' in data) error.name = `${status} ${data.error}`;
    else error.name = String(status);
  }

  // Render component
  return <strong css={cssStrong}>{error.toString()}</strong>;
};
