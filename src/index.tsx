import { Provider } from 'react-redux';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Container } from '@components/Container';
import { GlobalStyle } from '@components/GlobalStyle';
import { store } from '@store';

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <Provider store={ store }>
      <GlobalStyle />
      <Container />
    </Provider>
  </StrictMode>
);