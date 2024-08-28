import { css } from '@emotion/react';

import type { TwitchProfileImageProps } from '@components/shared/TwitchProfileImage/types';

export const TwitchProfileImage = ({ size, ...propsImg }: TwitchProfileImageProps) => {
  const cssImg = css`
    position: relative;
    width: ${size};
    height: ${size};
    border-radius: calc(${size} / 2);
    filter: drop-shadow(0 0 calc(${size} / 10) #000000);

    &:not(:last-child) {
      margin-left: calc(${size} * -0.8);
    }
  `;

  // Render component
  return <img css={cssImg} {...propsImg} />;
};
