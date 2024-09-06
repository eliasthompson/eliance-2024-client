import { css } from '@emotion/react';

import type { IconProps } from '@components/shared/svgs/types';

export const TwitchIcon = ({ colored, cssIcon: cssIconProvided }: IconProps) => {
  const color = '#9147ff';
  const cssSvg = css`
    height: var(--line-height);
    ${cssIconProvided?.styles}
  `;

  // Render component
  return (
    <svg viewBox="0 0 20 20" css={cssSvg}>
      <g fill={colored ? color : 'white'} fillRule="evenodd">
        <path d="M10 5.429h1.167v3.428H10V5.43Zm4.083 0h-1.167v3.428h1.167V5.43Z" />

        <path
          d="M3 4.857 5.917 2H17v8l-5.25 5.143H9.417L6.5 18v-2.857H3V4.857Zm10.5 6.857 2.333-2.285V3.143H6.5v8.571h2.333V14l2.334-2.286H13.5Z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
};
