export const CANVAS_KEYS = Object.freeze(['landscape', 'portrait'] as const satisfies string[]);

export type CanvasKey = (typeof CANVAS_KEYS)[number];
