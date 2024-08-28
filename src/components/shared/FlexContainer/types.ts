import type { HTMLAttributes } from 'react';
import type { SerializedStyles } from '@emotion/react';

export interface FlexContainerProps extends HTMLAttributes<HTMLDivElement> {
  column?: boolean;
  cssContainer?: SerializedStyles;
  reverse?: boolean;
}
