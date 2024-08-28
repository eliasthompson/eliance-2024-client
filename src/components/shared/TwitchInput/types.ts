import type { InputHTMLAttributes } from 'react';

export interface TwitchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  attach?: 'top' | 'right' | 'bottom' | 'left';
}
