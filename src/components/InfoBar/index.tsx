import type { InfoBarProps } from '@components/InfoBar/types';

import { ChatBox } from '@components/ChatBox';
import { PersonBox } from '@components/PersonBox';
import { FlexContainer } from '@components/shared/FlexContainer';

export const InfoBar = ({ cssBar: cssBarProvided }: InfoBarProps) => {
  // Render component
  return (
    <FlexContainer css={ cssBarProvided }>
      {/* <PersonBox /> */}
      <div style={ { flex: 1 } } />
      <ChatBox />
      <div style={ { flex: 1 } } />
    </FlexContainer>
  );
};
