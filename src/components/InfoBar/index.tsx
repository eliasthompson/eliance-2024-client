import type { InfoBarProps } from '@components/InfoBar/types';

import { css } from '@emotion/react';

import { ChatBox } from '@components/ChatBox';
import { PersonBox } from '@components/PersonBox';
import { FlexContainer } from '@components/shared/FlexContainer';

export const InfoBar = ({ cssBar: cssBarProvided }: InfoBarProps) => {
  const cssBar = css`
    overflow: hidden;
    ${cssBarProvided?.styles}
  `;

  // Render component
  return (
    <FlexContainer css={ cssBar }>
      {/* <PersonBox /> */}
      <div style={ { flex: 3 } } />
      <div style={ { flex: 2 } } />
      <ChatBox />
    </FlexContainer>
  );
};
