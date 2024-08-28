import { css } from '@emotion/react';

import type { TwitchButtonProps, TwitchButtonValidTags } from '@components/shared/TwitchButton/types';

export const defaultTwitchButtonAsValue = 'button' as const;

export const TwitchButton = <Tag extends TwitchButtonValidTags = typeof defaultTwitchButtonAsValue>({
  as = defaultTwitchButtonAsValue,
  attach,
  children,
  variant,
  ...propsButton
}: TwitchButtonProps<Tag>) => {
  let backgroundColor = '#9147ff';
  let backgroundColorActive = '#5c16c5';
  let backgroundColorHover = '#772ce8';
  let borderRadius = css`
    border-radius: 0.4rem;
  `;

  if (attach === 'top')
    borderRadius = css`
      border-radius: 0 0 0.4rem 0.4rem;
    `;
  else if (attach === 'right')
    borderRadius = css`
      border-radius: 0.4rem 0 0 0.4rem;
    `;
  else if (attach === 'bottom')
    borderRadius = css`
      border-radius: 0.4rem 0.4rem 0 0;
    `;
  else if (attach === 'left')
    borderRadius = css`
      border-radius: 0 0.4rem 0.4rem 0;
    `;

  if (variant === 'secondary') {
    backgroundColor = 'rgba(83, 83, 95, 0.38)';
    backgroundColorActive = 'rgba(83, 83, 95, 0.48);';
    backgroundColorHover = 'rgba(83, 83, 95, 0.55)';
  }

  const cssButton = css`
    cursor: pointer;
    display: inline-flex;
    position: relative;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    overflow: hidden;
    text-decoration: none;
    white-space: nowrap;
    user-select: none;
    font-weight: 600;
    font-size: 1.3rem;
    height: 3rem;
    color: #ffffff;
    background-color: ${backgroundColor};
    flex: none;
    ${borderRadius}

    &:active {
      background-color: ${backgroundColorActive};
    }

    &:hover {
      background-color: ${backgroundColorHover};
    }
  `;
  const cssDiv1 = css`
    display: flex;
    align-items: center;
    flex-grow: 0;
    padding: 0px 1rem;
  `;
  const cssDiv2 = css`
    flex-grow: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
  `;
  const Element: TwitchButtonValidTags = as;

  // Render component
  return (
    <Element css={cssButton} {...propsButton}>
      <div css={cssDiv1}>
        <div css={cssDiv2}>{children}</div>
      </div>
    </Element>
  );
};
