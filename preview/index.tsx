import React, { StrictMode } from 'react';
import { Provider } from 'react-redux';

import { GlobalStyle } from '../src/components/GlobalStyle';
import { store } from '../src/store';

export const Wrapper = ({ children }) => (
  <StrictMode>
    <Provider store={store}>
      <GlobalStyle />
      {children}
    </Provider>
  </StrictMode>
);
