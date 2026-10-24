export const LAYOUT_KEYS = Object.freeze([
  'Camera',
  '16:9',
  '4:3',
  'DS Split',
  '3DS Split',
  'GBA',
  'SNES',
  'GB(C)',
  'NES',
] as const satisfies string[]);

export type LayoutKey = (typeof LAYOUT_KEYS)[number];
