import type { CanvasKey } from '@/constants/canvasKeys';

export const INFO_BLOCK_HEIGHTS = Object.freeze({ landscape: 99, portrait: 125 } as const satisfies Record<
  CanvasKey,
  number
>);
