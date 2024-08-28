import { css } from '@emotion/react';

import type { TwitchInputProps } from '@components/shared/TwitchInput/types';

export const TwitchInput = ({ attach, ...propsInput }: TwitchInputProps) => {
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

  const cssInput = css`
    display: flex;
    width: 100%;
    height: 2rem;
    font-size: 1.3rem;
    font-family: inherit;
    appearance: none;
    background-clip: padding-box;
    line-height: 1.5;
    transition:
      border 100ms ease-in,
      background-color 100ms ease-in;
    border-style: solid;
    border-width: 0px;
    border-color: transparent;
    box-shadow: inset 0 0 0 1px rgba(222, 222, 227, 0.4);
    color: #ffffff;
    background-color: #18181b;
    padding: 0.5rem 1rem !important;
    ${borderRadius}
  `;

  // Render component
  return <input id="verification-url-input" css={cssInput} {...propsInput} />;
};
