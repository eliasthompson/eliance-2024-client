export const REGIONS = Object.freeze(['Camera', 'Main Content', 'Aux Content', 'Info'] as const satisfies string[]);

export type Region = (typeof REGIONS)[number];
