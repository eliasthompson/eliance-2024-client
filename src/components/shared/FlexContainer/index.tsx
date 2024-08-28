import { css } from '@emotion/react';

import type { FlexContainerProps } from '@components/shared/FlexContainer/types';

export const FlexContainer = ({
  children,
  column,
  cssContainer: cssContainerProvided,
  reverse,
  ...propsDiv
}: FlexContainerProps) => {
  let flexDirection = 'row';

  if (reverse) flexDirection = 'row-reverse';

  if (column) {
    if (reverse) flexDirection = 'column-reverse';
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
