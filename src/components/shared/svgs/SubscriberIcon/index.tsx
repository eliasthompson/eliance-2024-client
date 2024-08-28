import { css } from '@emotion/react';

import type { IconProps } from '@components/shared/svgs/types';

export const SubscriberIcon = ({ colored, cssIcon: cssIconProvided, filled }: IconProps) => {
  const color = '#1f69ff';
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
        fill-rule={rule}
        d="M11.456 8.255 10 5.125l-1.456 3.13-3.49.485 2.552 2.516-.616 3.485L10 13.064l3.01 1.677-.616-3.485 2.553-2.516-3.491-.485zM7.19 6.424l-4.2.583c-.932.13-1.318 1.209-.664 1.853l3.128 3.083-.755 4.272c-.163.92.876 1.603 1.722 1.132L10 15.354l3.579 1.993c.846.47 1.885-.212 1.722-1.132l-.755-4.272 3.128-3.083c.654-.644.268-1.723-.664-1.853l-4.2-.583-1.754-3.77c-.406-.872-1.706-.872-2.112 0L7.19 6.424z"
        clip-rule={rule}
      />
    </svg>
  );
};
