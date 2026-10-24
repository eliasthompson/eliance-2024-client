import type { LayoutOptions } from '@eliasthompson/obs-layout-generator';
import { INFO_BLOCK_HEIGHTS } from '@/constants/infoBlockHeights';
import { CANVAS_SPACING } from '@/constants/canvasSpacing';
import type { CanvasKey } from '@/constants/canvasKeys';

export const CANVASES = Object.freeze({
  landscape: {
    canvasWidth: 1920,
    canvasHeight: 1080,
    canvasMarginTop: INFO_BLOCK_HEIGHTS.landscape + CANVAS_SPACING.regionBorder,
    canvasMarginBottom: INFO_BLOCK_HEIGHTS.landscape + CANVAS_SPACING.regionBorder,
    orientation: 'landscape',
    ...CANVAS_SPACING,
  },
  portrait: {
    canvasWidth: 1080,
    canvasHeight: 1920,
    canvasMarginTop: 148,
    canvasMarginBottom: 343,
    orientation: 'portrait',
    ...CANVAS_SPACING,
  },
} as const satisfies Record<CanvasKey, LayoutOptions>);
