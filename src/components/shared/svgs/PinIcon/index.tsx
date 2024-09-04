import { css } from '@emotion/react';

import type { IconProps } from '@components/shared/svgs/types';

export const PinIcon = ({ colored, cssIcon: cssIconProvided, filled }: IconProps) => {
  const color = '#9147ff';
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
        d="M4.941 2h10v2H13v3a3 3 0 0 1 3 3v3H4v-3a3 3 0 0 1 3-3V4H4.941V2zM9 9H7a1 1 0 0 0-1 1v1h8v-1a1 1 0 0 0-1-1h-2V4H9v5z"
        clipRule={rule}
      ></path>
      <path fill={colored ? color : 'white'} d="M10.999 15h-2v3h2v-3z"></path>
    </svg>
  );
};
