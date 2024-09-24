import { Provider } from 'react-redux';
import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import { GlobalStyle } from '@components/GlobalStyle';
import { router } from '@src/routes';
import { store } from '@store';

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <Provider store={store}>
      <GlobalStyle />
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
