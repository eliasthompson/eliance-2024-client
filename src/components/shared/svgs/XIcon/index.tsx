import { css } from '@emotion/react';

import type { IconProps } from '@components/shared/svgs/types';

export const XIcon = ({ colored, cssIcon: cssIconProvided }: IconProps) => {
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
        d="M11.332 8.928 16.544 3h-1.235l-4.526 5.147L7.17 3H3l5.466 7.784L3 17h1.235l4.78-5.436L12.83 17H17l-5.668-8.072ZM9.64 10.852l-.554-.775L4.68 3.91h1.897l3.556 4.977.554.775 4.622 6.47h-1.897l-3.772-5.28Z"
      />
    </svg>
  );
};
