import { InfoState } from '@store/slices/info';

export interface PersonInfoProps {
  person: InfoState['persons'][number];
}
