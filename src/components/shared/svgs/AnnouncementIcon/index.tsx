import { css } from '@emotion/react';

import type { IconProps } from '@components/shared/svgs/types';

export const AnnouncementIcon = ({ colored, cssIcon: cssIconProvided, filled }: IconProps) => {
  const color = '#9147ff';
  const rule = (filled) ? 'nonzero' : 'evenodd';
  const cssSvg = css`
    height: var(--line-height);
    ${cssIconProvided?.styles}
  `;

  // Render component
  return (
    <svg viewBox="0 0 20 20" css={ cssSvg }>
      <path fill={ (colored) ? color : 'white' } fillRule={ rule } d="m11 14 7 4V2l-7 4H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v4h2v-4h3zm1-6.268 4-2.286v9.108l-4-2.286V7.732zM10 12H4V8h6v4z" clipRule={ rule } />
    </svg>
  );
};
