import { css } from '@emotion/react';

import type { IconProps } from '@components/shared/svgs/types';

export const LinkIcon = ({ colored, cssIcon: cssIconProvided }: IconProps) => {
  const color = '#ffffff';
  const cssSvg = css`
    height: var(--line-height);
    ${cssIconProvided?.styles}
  `;

  // Render component
  return (
    <svg viewBox="0 0 20 20" css={cssSvg}>
      <path
        fill={colored ? color : 'white'}
        d="M15 9h-2V7a3 3 0 1 0-6 0v2H5V7a5 5 0 0 1 10 0v2zm-2 4v-2h2v2a5 5 0 0 1-10 0v-2h2v2a3 3 0 1 0 6 0z"
      />

      <path fill={colored ? color : 'white'} d="M11 7H9v6h2V7z" />
    </svg>
  );
};
