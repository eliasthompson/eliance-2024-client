import { styled } from 'styled-components';

export interface TwitchProfileImageProps {
  size: string,
};

export const TwitchProfileImage = styled.img<TwitchProfileImageProps>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: calc(${({ size }) => size} / 2);
`;
