export const STANDBY_KEYS = Object.freeze([
  'Starting Soon',
  'Be Right Back',
  'Thanks for Watching',
] as const satisfies string[]);

export type StandbyKey = (typeof STANDBY_KEYS)[number];
