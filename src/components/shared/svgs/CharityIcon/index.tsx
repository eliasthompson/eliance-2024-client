import { css } from '@emotion/react';

import type { IconProps } from '@components/shared/svgs/types';

export const CharityIcon = ({ colored, cssIcon: cssIconProvided, filled }: IconProps) => {
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
        d="m3 8 3-6h8l3 6-3.355 4.194L18 18h-7l-1-1.25L9 18H2l4.355-5.806L3 8Zm4.236-4-1 2h7.528l-1-2H7.236ZM8 8l.75 1-1.156 1.541L5.561 8H8Zm3.28 7.15.681.85H14l-1.645-2.194-1.074 1.343ZM6 16l6-8h2.439l-6.4 8H6Z"
        clipRule={rule}
      />
    </svg>
  );
};
