import { styled } from 'styled-components';

interface TwitchButtonProps {
  variant?: string,
};

export const TwitchButton = styled.button<TwitchButtonProps>`
  cursor: pointer;
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  overflow: hidden;
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  font-weight: 600;
  font-size: 1.3rem;
  height: 3rem;
  border-radius: 0.4rem;
  color: #ffffff;
  background-color: ${({ variant = 'primary' }) => (variant === 'primary') ? '#9147ff' : 'transparent'};
  
  &:active {
    background-color: ${({ variant = 'primary' }) => (variant === 'primary') ? '##5c16c5' : 'rgb(83 83 95 / 55%)'};
  }
  
  &:hover {
    background-color: ${({ variant = 'primary' }) => (variant === 'primary') ? '#772ce8' : 'rgb(83 83 95 / 48%)'};
  }

  div {
    display: flex;
    align-items: center;
    flex-grow: 0;
    padding: 0px 1rem;

    div {
      flex-grow: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: flex-start !important;
    }
  }
`;