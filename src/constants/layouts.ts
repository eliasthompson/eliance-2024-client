import type { LayoutConfig } from '@eliasthompson/obs-layout-generator';
import type { LayoutKey } from '@/constants/layoutKeys';

export const LAYOUTS = Object.freeze({
  'Camera': { contentMain: null },
  '16:9': {},
  '4:3': { contentMain: { aspectRatio: '4:3' } },
  'DS Split': { contentMain: { aspectRatio: '4:3' }, contentAux: { aspectRatio: '4:3', isMainAttached: true } },
  '3DS Split': { contentMain: { aspectRatio: '5:3' }, contentAux: { aspectRatio: '4:3', isMainAttached: true } },
  'GBA': { contentMain: { aspectRatio: '3:2' } },
  'SNES': { contentMain: { aspectRatio: '8:7' } },
  'GB(C)': { contentMain: { aspectRatio: '10:9' } },
  'NES': { contentMain: { aspectRatio: '16:15' } },
} satisfies Record<LayoutKey, LayoutConfig>);
