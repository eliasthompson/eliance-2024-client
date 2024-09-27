import { css } from '@emotion/react';

import type { IconProps } from '@components/shared/svgs/types';

export const RaidIcon = ({ colored, cssIcon: cssIconProvided, filled }: IconProps) => {
  const color = '#ebeb00';
  const nonfilledPath = filled
    ? ''
    : 'M10.057 14h-.114l-2.382-3.872a6.674 6.674 0 0 1 4.878 0L10.057 14zm-4.07-5.348a8.671 8.671 0 0 1 8.027 0 4.937 4.937 0 0 1 1.724-.41 6.003 6.003 0 0 0-11.476 0 4.925 4.925 0 0 1 1.724.41z';
  const cssSvg = css`
    height: var(--line-height);
    ${cssIconProvided?.styles}
  `;

  // Render component
  return (
    <svg viewBox="0 0 20 20" css={cssSvg}>
      <path
        fill={colored ? color : 'white'}
        d={`m4 10.235-.105.002a2.936 2.936 0 0 0-1.66.587l-.138.103A.06.06 0 0 1 2 10.88V10a8.074 8.074 0 0 1 .121-1.394 8.002 8.002 0 0 1 15.809.33c.046.348.07.703.07 1.064v.879a.06.06 0 0 1-.097.048l-.138-.103a2.936 2.936 0 0 0-3.315-.147l-2.49 4.045A1 1 0 0 1 12 15v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2a1 1 0 0 1 .04-.278l-2.49-4.045A2.937 2.937 0 0 0 4 10.235z${nonfilledPath}`}
      />
    </svg>
  );
};
