import type { LayoutOptions } from '@eliasthompson/obs-layout-generator';

export const CANVAS_SPACING = Object.freeze({
  canvasPadding: 24,
  canvasGap: 24,
  layoutGap: 18,
  regionBorder: 6,
} as const satisfies LayoutOptions);
