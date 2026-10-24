export const AUDIO_SOURCES = Object.freeze([
  '[Audio] Alerts',
  '[Audio] Content',
  '[Audio] Music',
  '[Audio] Voice',
] as const satisfies string[]);

export type AudioSource = (typeof AUDIO_SOURCES)[number];
