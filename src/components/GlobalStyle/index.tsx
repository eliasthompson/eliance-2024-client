import { createGlobalStyle } from 'styled-components';

import robotoLight from '@fonts/Roboto-Light.ttf';
import robotoRegular from '@fonts/Roboto-Regular.ttf';
import robotoMedium from '@fonts/Roboto-Medium.ttf';

export const GlobalStyle = createGlobalStyle`
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
      background-color: #121212;
    }

    body,
    #root {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    body {
      font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
      color: #FFFFFF;
      font-size: 16px;
      font-weight: 400;
      letter-spacing: 0.5px;
      -webkit-overflow-scrolling: touch;
    }

    #root {
      align-items: center;
      justify-content: center;
    }
`