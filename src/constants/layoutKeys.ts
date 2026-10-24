export const LAYOUT_KEYS = Object.freeze([
  'Camera',
  '16:9',
  '4:3',
  '3DS Split',
  'DS Split',
  '3DS Stacked',
  'DS Stacked',
  'GBA',
  'GB(C)',
  'SNES',
  'NES',
  'iPhone',
] as const satisfies string[]);

export type LayoutKey = (typeof LAYOUT_KEYS)[number];
