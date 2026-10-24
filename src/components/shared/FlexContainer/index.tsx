import { css } from '@emotion/react';

import type { FlexContainerProps } from '@/components/shared/FlexContainer/types';

export const FlexContainer = ({
  children,
  column,
  cssContainer: cssContainerProvided,
  reverse,
  ...propsDiv
}: FlexContainerProps) => {
  let flexDirection = 'row';

  if (reverse) {
    if (column) flexDirection = 'column-reverse';
    else flexDirection = 'row-reverse';
  } else if (column) {
    flexDirection = 'column';
  }

  const cssDiv = css`
    display: flex;
    flex-direction: ${flexDirection};
    ${cssContainerProvided?.styles}
  `;

  // Render component
  return (
    <div css={cssDiv} {...propsDiv}>
      {children}
    </div>
  );
};
