import { css } from '@emotion/react';

import type { IconProps } from '@components/shared/svgs/types';

export const BitsIcon = ({ colored, cssIcon: cssIconProvided, filled }: IconProps) => {
  const color = '#5cffbe';
  const rule = filled ? 'nonzero' : 'evenodd';
  const cssSvg = css`
    height: var(--line-height);
    ${cssIconProvided?.styles}
  `;

  // Render component
  return (
    <svg viewBox="0 0 20 20" css={cssSvg}>
      <path
        fill={colored ? color : 'white'}
        fillRule={rule}
        d="m3 12 7-10 7 10-7 6-7-6zm2.678-.338L10 5.487l4.322 6.173-.85.728L10 11l-3.473 1.39-.849-.729z"
        clipRule={rule}
      ></path>
    </svg>
  );
};
