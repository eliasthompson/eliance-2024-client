import type { InfoState } from '@store/slices/info';

export interface ErrorMessageProps {
  error: InfoState['errors'][number];
}
