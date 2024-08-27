import { Global, css } from '@emotion/react';

import robotoLight from '@fonts/Roboto-Light.ttf';
import robotoRegular from '@fonts/Roboto-Regular.ttf';
import robotoMedium from '@fonts/Roboto-Medium.ttf';

export const GlobalStyle = () => {
  const backgroundColor = (window.obsstudio) ? 'transparent' : '#0e0e10';

  const cssGlobal = css`
    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 300;
      src: url(${robotoLight}) format('truetype');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      src: url(${robotoRegular}) format('truetype');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 500;
      src: url(${robotoMedium}) format('truetype');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    :root {
      --safe-area-inset-top: env(safe-area-inset-top);
      --safe-area-inset-left: env(safe-area-inset-left);
      --safe-area-inset-right: env(safe-area-inset-right);
      --safe-area-inset-bottom: env(safe-area-inset-bottom);

      --container-width: 1920px;
      --container-height: 1080px;
      --bar-width: 1872px;
      --bar-height: 105px;
      --padding: 12px;
      --line-height: calc((var(--bar-height) - (var(--padding) * 2)) / 3);
      --font-size: calc(var(--line-height) * (13 / 20));
    }

    * {
      margin: 0px;
      outline: 0px;
      border: 0px;
      padding: 0px;
    }

    html,
    body,
    #root {
      overflow-x: hidden;
      height: 100%;
      background-color: ${backgroundColor};
    }

    body,
    #root {
      position: relative;
      display: flex;
      flex-direction: column;
      width: var(--container-width);
      height: var(--container-height);
    }

    body {
      font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
      color: #FFFFFF;
      font-size: var(--font-size);
      font-weight: 400;
      -webkit-overflow-scrolling: touch;
    }

    #root {
      align-items: center;
      justify-content: center;
    }
`;

  return (
    <Global styles={ cssGlobal } />
  );
};
