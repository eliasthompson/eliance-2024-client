import { css } from '@emotion/react';

import type { TwitchProfileImageProps } from '@components/shared/TwitchProfileImage/types';

export const TwitchProfileImage = ({ size, ...propsImg }: TwitchProfileImageProps) => {
  const cssImg = css`
    position: relative;
    width: calc(${size});
    height: calc(${size});
    border-radius: calc(${size} / 2);
  `;

  // Render component
  return <img css={cssImg} {...propsImg} />;
};
