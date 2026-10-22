import { useSyncExternalStore } from 'react';

import { layoutCanvases } from '@config';
import { hasKey } from '@lib/hasKey';

/** A canvas orientation: one of the configured canvases */
export type Orientation = keyof typeof layoutCanvases;

export const parseOrientationParam = (value: string | null): Orientation => {
  const orientation = value?.trim().toLowerCase() ?? '';

  return hasKey(layoutCanvases, orientation) ? orientation : 'landscape';
};

// The hash router keeps the search params in the hash, and GlobalStyle renders outside the router, so they are read
// from the location rather than with useSearchParams
const getOrientation = () => {
  const { hash } = window.location;
  const searchIndex = hash.indexOf('?');

  return parseOrientationParam(
    new URLSearchParams(searchIndex === -1 ? '' : hash.slice(searchIndex)).get('orientation'),
  );
};

const subscribeToHash = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);

  return () => window.removeEventListener('hashchange', onChange);
};

/**
 * The global `orientation` search param every route shares, picking the canvas from `layoutCanvases`: `landscape` (the
 * default) or `portrait`, e.g. `#/layout?orientation=portrait&participants=2`.
 */
export const useOrientation = () => useSyncExternalStore(subscribeToHash, getOrientation);
