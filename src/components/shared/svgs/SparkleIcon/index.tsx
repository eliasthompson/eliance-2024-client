import { css } from '@emotion/react';

import type { IconProps } from '@components/shared/svgs/types';

export const SparkleIcon = ({ colored, cssIcon: cssIconProvided, filled }: IconProps) => {
  const color = '#ff75e6';
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
        d="M13.39 4.305 12 5l1.404.702a2 2 0 0 1 .894.894L15 8l.702-1.404a2 2 0 0 1 .894-.894L18 5l-1.418-.709a2 2 0 0 1-.881-.869L14.964 2l-.668 1.385a2 2 0 0 1-.907.92z"
      />
      <path
        fill={colored ? color : 'white'}
        fillRule={rule}
        d="M5.404 9.298a2 2 0 0 0 .894-.894L8 5h1l1.702 3.404a2 2 0 0 0 .894.894L15 11v1l-3.404 1.702a2 2 0 0 0-.894.894L9 18H8l-1.702-3.404a2 2 0 0 0-.894-.894L2 12v-1l3.404-1.702zm2.683 0 .413-.826.413.826a4 4 0 0 0 1.789 1.789l.826.413-.826.413a4 4 0 0 0-1.789 1.789l-.413.826-.413-.826a4 4 0 0 0-1.789-1.789l-.826-.413.826-.413a4 4 0 0 0 1.789-1.789z"
        clipRule={rule}
      />
    </svg>
  );
};
