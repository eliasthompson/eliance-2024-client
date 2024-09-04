import { Global, css } from '@emotion/react';

import robotoLightFont from '@assets/fonts/Roboto-Light.ttf';
import robotoRegularFont from '@assets/fonts/Roboto-Regular.ttf';
import robotoMediumFont from '@assets/fonts/Roboto-Medium.ttf';

export const GlobalStyle = () => {
  const backgroundColorBody = window.obsstudio ? 'transparent' : '#121212';
  const backgroundColorRoot = window.obsstudio ? 'transparent' : '#226600';
  const backgroundImageRoot = window.obsstudio
    ? 'none'
    : 'url("https://static-cdn.jtvnw.net/jtv_user_pictures/d31cb115-0b49-4966-a6eb-3749a5e83908-profile_banner-480.png")';

  const cssGlobal = css`
    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 300;
      src: url(${robotoLightFont}) format('truetype');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC,
        U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      src: url(${robotoRegularFont}) format('truetype');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC,
        U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 500;
      src: url(${robotoMediumFont}) format('truetype');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC,
        U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    @keyframes rotate {
      to {
        transform: translate(-50%, -50%) rotate(1turn);
      }
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
      --font-size: calc(var(--line-height) / 6 * 5);
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
      overflow: hidden;
      height: 100%;
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
      background-color: ${backgroundColorBody};
      color: #ffffff;
      font-size: var(--font-size);
      font-weight: 400;
    }

    #root {
      align-items: center;
      justify-content: center;
      background-color: ${backgroundColorRoot};
      background-image: ${backgroundImageRoot};
      background-size: cover;
    }
  `;

  return <Global styles={cssGlobal} />;
};
