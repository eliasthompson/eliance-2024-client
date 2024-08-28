import type { ComponentPropsWithoutRef, HTMLAttributes } from 'react';

export type TwitchButtonValidTags = 'a' | 'button';

export type TwitchButtonProps<Tag extends TwitchButtonValidTags> = {
  as?: Tag | TwitchButtonValidTags;
  attach?: 'top' | 'right' | 'bottom' | 'left';
  variant?: string;
} & (Omit<ComponentPropsWithoutRef<Tag>, 'type'> & HTMLAttributes<HTMLOrSVGElement>);
