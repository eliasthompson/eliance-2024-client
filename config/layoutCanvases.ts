import type { LayoutOptions } from '@eliasthompson/obs-layout-generator';

/** Spacing every canvas shares */
const spacing = {
  canvasPadding: 24,
  canvasGap: 24,
  layoutGap: 18,
  regionBorder: 6,
} as const satisfies LayoutOptions;

/** Inside height of one info block, three lines of text: the landscape bar, and each block of the portrait stack */
export const infoBlockHeight = 99;

/** Twitch's vertical player: the streamer row it draws over the top, and its chat at full height (33% of the canvas) */
const twitchTopBarHeight = 144;
const twitchChatHeightMax = 1920 * 0.33;

/**
 * The canvases every layout is computed on, by orientation; the global `orientation` search param picks one. The raw
 * values the app sizes itself from; `scenes.ts` takes them as its options.
 */
export const layoutCanvases = {
  // The info bar along the bottom, and as much room at the top
  landscape: {
    canvasWidth: 1920,
    canvasHeight: 1080,
    canvasMarginTop: infoBlockHeight + spacing.regionBorder,
    canvasMarginBottom: infoBlockHeight + spacing.regionBorder,
    orientation: 'landscape',
    ...spacing,
  },
  // Clear of Twitch's top bar, and of its chat up to two thirds of its full height, where the info blocks stack. Its
  // chat at full height still covers the bottom of the layout, so names run along the top of their cameras
  portrait: {
    canvasWidth: 1080,
    canvasHeight: 1920,
    canvasMarginTop: twitchTopBarHeight,
    canvasMarginBottom: Math.round((twitchChatHeightMax * 2) / 3),
    orientation: 'portrait',
    ...spacing,
  },
} as const satisfies Record<string, LayoutOptions>;
