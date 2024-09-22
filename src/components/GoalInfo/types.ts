import type { FunctionComponent } from 'react';

import type { IconProps } from '@components/shared/svgs/types';

export interface GoalInfoProps {
  goal: {
    icon: FunctionComponent<IconProps>;
    label: string;
    logo?: string;
    currentAmount: number;
    currentAmountCurrency?: string;
    targetAmount: number;
    targetAmountCurrency?: string;
  };
  isSmall: boolean;
}
