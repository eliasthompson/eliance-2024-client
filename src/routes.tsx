import { createHashRouter } from 'react-router-dom';
import { css } from '@emotion/react';

import { Container } from '@components/Container';
import { FeaturedClips } from '@components/FeaturedClips';
import { InfoBar } from '@components/InfoBar';
import { Schedule } from '@components/Schedule';

const backgroundColorBarInfo = window.obsstudio ? 'transparent' : 'rgba(0, 0, 0, 33%)';
const borderStyleBarInfo = window.obsstudio ? 'none' : 'solid';
const bottomBarInfo = window.obsstudio ? '0' : '-6px';
const filterBarInfo = window.obsstudio ? 'none' : 'drop-shadow(#000000 0 0 calc(var(--padding) * 0.75))';

const cssBarInfo = css`
  position: absolute;
  bottom: ${bottomBarInfo};
  width: var(--bar-width);
  height: var(--bar-height);
  border-color: #9147ff;
  border-style: ${borderStyleBarInfo};
  border-width: calc(var(--padding) / 2);
  background-color: ${backgroundColorBarInfo};
  filter: ${filterBarInfo};
`;

export const router = createHashRouter([
  {
    path: '/',
    element: <Container />,
    errorElement: false,
    children: [
      {
        path: 'global-info',
        element: <InfoBar cssBar={cssBarInfo} />,
      },
      {
        path: 'featured-clips',
        element: <FeaturedClips />,
      },
      {
        path: 'schedule',
        element: <Schedule />,
      },
    ],
  },
]);
