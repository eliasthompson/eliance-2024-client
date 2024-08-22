import { styled } from 'styled-components';

export interface TwitchProfileImageProps {
  $size: string,
};

export const TwitchProfileImage = styled.img<TwitchProfileImageProps>`
  position: relative;
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border-radius: calc(${({ $size }) => $size} / 2);
  filter: drop-shadow(0 0 calc(${({ $size }) => $size} / 10) #000000);

  &:not(:last-child) {
    margin-left: calc(${({ $size }) => $size} * -0.8);
  }
`;
