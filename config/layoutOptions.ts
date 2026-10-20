import type { LayoutOptions } from '@eliasthompson/obs-layout-generator';

/** The canvas every layout is computed on. The raw values the app sizes itself from; `scenes.ts` takes them as its options. */
export const layoutOptions = {
  canvasWidth: 1920,
  canvasHeight: 1080,
  canvasMarginTop: 105,
  canvasMarginBottom: 105,
  canvasPadding: 24,
  canvasGap: 24,
  layoutGap: 18,
  regionBorder: 6,
} as const satisfies LayoutOptions;
