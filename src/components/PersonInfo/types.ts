import { InfoState } from '@store/slices/info';

export interface PersonInfoProps {
  index: number;
  person: InfoState['persons'][number];
}
