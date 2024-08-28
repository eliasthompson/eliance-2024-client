import { css } from '@emotion/react';

import type { IconProps } from '@components/shared/svgs/types';

export const ChannelPointIcon = ({ colored, cssIcon: cssIconProvided, filled }: IconProps) => {
  const color = '#ffd37a';
  const rule = filled ? 'nonzero' : 'evenodd';
  const cssSvg = css`
    height: var(--line-height);
    ${cssIconProvided?.styles}
  `;
  let shineMask = {};
  let shineNode = <path fill={colored ? color : 'white'} d="M10 6a4 4 0 0 1 4 4h-2a2 2 0 0 0-2-2V6z" />;

  if (filled) {
    shineMask = { mask: 'url(#shine)' };
    shineNode = (
      <mask id="shine">
        <rect fill="white" width="20" height="20" />
        <path d="M10 6a4 4 0 0 1 4 4h-2a2 2 0 0 0-2-2V6z" />
      </mask>
    );
  }

  // Render component
  return (
    <svg viewBox="0 0 20 20" css={cssSvg}>
      {shineNode}
      <path
        fill={colored ? color : 'white'}
        fillRule={rule}
        d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-2 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0z"
        clipRule={rule}
        {...shineMask}
      />
    </svg>
  );
};
