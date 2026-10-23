import type { LayoutOptions } from '@eliasthompson/obs-layout-generator';

/** Spacing every canvas shares */
const spacing = {
  canvasPadding: 24,
  canvasGap: 24,
  layoutGap: 18,
  regionBorder: 6,
} as const satisfies LayoutOptions;

/**
 * Twitch's vertical player: the streamer row it draws over the top on small phones; its chat covers 11% to 33% of the
 * bottom
 */
const twitchTopBarHeight = 148;

/**
 * The inside height of one info block on each canvas, three lines of text; every size inside a block derives from it.
 * The info bar fills its canvas's bottom margin, less the border between it and the layout: on the landscape canvas
 * that is one block of three sections side by side; on the portrait one, the person block over chat with the goals at
 * its foot, chat taking whatever room the margin leaves. Portrait blocks are about 1.26 times as large, so phones show
 * their text large enough to read.
 */
export const infoBlockHeights = { landscape: 99, portrait: 125 } as const;

/**
 * The canvases every layout is computed on, by orientation; the global `orientation` search param picks one. The raw
 * values the app sizes itself from; `scenes.ts` takes them as its options.
 */
export const layoutCanvases = {
  // The info bar along the bottom, and as much room at the top
  landscape: {
    canvasWidth: 1920,
    canvasHeight: 1080,
    canvasMarginTop: infoBlockHeights.landscape + spacing.regionBorder,
    canvasMarginBottom: infoBlockHeights.landscape + spacing.regionBorder,
    orientation: 'landscape',
    ...spacing,
  },
  // Clear of Twitch's top bar, and of most of its chat, where the info bar stacks. Its chat at full height still
  // covers the bottom of the layout, so names run along the top of their cameras. The top margin stays within about
  // 120 to 160, Twitch's top bar on large and small phones; the bottom one within about 290 (two lines of chat) to 430
  // (clear of Twitch's chat on a small phone with chat open), each line of chat about 39 more. At 343 a single person's
  // 16:9 content leaves their camera exactly 4:3 beneath it
  portrait: {
    canvasWidth: 1080,
    canvasHeight: 1920,
    canvasMarginTop: twitchTopBarHeight,
    canvasMarginBottom: 343,
    orientation: 'portrait',
    ...spacing,
  },
} as const satisfies Record<string, LayoutOptions>;
