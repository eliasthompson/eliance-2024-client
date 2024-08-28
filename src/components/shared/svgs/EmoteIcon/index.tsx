import { css } from '@emotion/react';

import type { IconProps } from '@components/shared/svgs/types';

export const EmoteIcon = ({ colored, cssIcon: cssIconProvided, filled }: IconProps) => {
  const color = '#44cc00';
  const rule = filled ? 'nonzero' : 'evenodd';
  const cssSvg = css`
    height: var(--line-height);
    ${cssIconProvided?.styles}
  `;
  let faceMask = {};
  let faceNode = (
    <path
      fill={colored ? color : 'white'}
      d="M7 11a1 1 0 100-2 1 1 0 000 2zM14 10a1 1 0 11-2 0 1 1 0 012 0zM10 14a2 2 0 002-2H8a2 2 0 002 2z"
    />
  );

  if (filled) {
    faceMask = { mask: 'url(#face)' };
    faceNode = (
      <mask id="face">
        <rect fill="white" width="20" height="20" />
        <path
          fill="black"
          d="M7 11a1 1 0 100-2 1 1 0 000 2zM14 10a1 1 0 11-2 0 1 1 0 012 0zM10 14a2 2 0 002-2H8a2 2 0 002 2z"
        />
      </mask>
    );
  }

  // Render component
  return (
    <svg viewBox="0 0 20 20" css={cssSvg}>
      <g>
        {faceNode}
        <path
          fill={colored ? color : 'white'}
          fillRule={rule}
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0a6 6 0 11-12 0 6 6 0 0112 0z"
          clipRule={rule}
          {...faceMask}
        />
      </g>
    </svg>
  );
};
