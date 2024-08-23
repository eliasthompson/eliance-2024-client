import type { HTMLAttributes } from 'react';

import { css } from '@emotion/react';

export interface FlexContainerProps extends HTMLAttributes<HTMLDivElement> {
  column?: boolean,
  gap?: string,
  reverse?: boolean,
};

export const FlexContainer = ({ children, column, gap: providedGap, reverse, ...propsDiv }: FlexContainerProps) => {
  const gap = (providedGap) ? css`gap: ${providedGap};` : '';
  let flexDirection = 'row';
  
  if (reverse) flexDirection = 'row-reverse';

  if (column) {
    if (reverse) flexDirection = 'column-reverse';
    flexDirection = 'column';
  }

  const cssDiv = css`
    display: flex;
    flex-direction: ${flexDirection};
    ${gap}
  `;

  // Render component
  return (
    <div css={ cssDiv } { ...propsDiv }>
      { children }
    </div>
  );
};
