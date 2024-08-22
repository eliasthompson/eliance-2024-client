import { styled } from 'styled-components';

export interface FlexContainerProps {
  $column?: boolean,
  $reverse?: boolean,
};

export const FlexContainer = styled.div<FlexContainerProps>`
  display: flex;
  flex-direction: ${({ $column, $reverse }) => {
    if ($column) {
      if ($reverse) return 'column-reverse';
      return 'column';
    }

    if ($reverse) return 'row-reverse';
    return 'row';
  }};
`;
