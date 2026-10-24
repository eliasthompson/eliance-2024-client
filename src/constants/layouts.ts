import type { LayoutConfig } from '@eliasthompson/obs-layout-generator';
import type { LayoutKey } from '@/constants/layoutKeys';

export const LAYOUTS = Object.freeze({
  'Camera': { contentMain: null },
  '16:9': {},
  '4:3': { contentMain: { aspectRatio: '4:3' } },
  '3DS Split': { contentMain: { aspectRatio: '5:3' }, contentAux: { aspectRatio: '4:3', isMainAttached: true } },
  'DS Split': { contentMain: { aspectRatio: '4:3' }, contentAux: { aspectRatio: '4:3', isMainAttached: true } },
  '3DS Stacked': { contentMain: { aspectRatio: '5:6' } },
  'DS Stacked': { contentMain: { aspectRatio: '4:6' } },
  'GBA': { contentMain: { aspectRatio: '3:2' } },
  'GB(C)': { contentMain: { aspectRatio: '10:9' } },
  'SNES': { contentMain: { aspectRatio: '8:7' } },
  'NES': { contentMain: { aspectRatio: '16:15' } },
  'iPhone': { contentMain: { aspectRatio: '9:16' } },
} satisfies Record<LayoutKey, LayoutConfig>);
