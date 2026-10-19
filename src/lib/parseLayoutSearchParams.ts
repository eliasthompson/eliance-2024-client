import type { AspectRatio, ContentAspectRatio, LayoutConfig, LayoutOptions } from '@eliasthompson/obs-layout-generator';

import { CONTENT_ASPECT_RATIOS } from '@eliasthompson/obs-layout-generator';

import { hasKey } from '@lib/hasKey';

/**
 * Search params understood by the layout route, e.g. `#/layout?participants=3&name&aux=4:3&marginBottom=105`:
 *
 * - Every `LayoutConfig` key (or its alias below): the base config applied to every participant.
 * - `participant`: one `LayoutConfig` per occurrence, merged over the base config, as comma separated `key` or
 *   `key=value` pairs.
 * - `participants`: total participant count; missing participants are filled with the base config.
 * - Every `LayoutOptions` key (or its alias below) as a number.
 *
 * Booleans take `true`/`false`, `1`/`0`, `yes`/`no`, `on`/`off`, or no value for `true`. Ratios take `16:9` or
 * `16x9`, and `null`/`none`/`off` turn a region off. `camera` sets `hasCamera` for a boolean and
 * `cameraMainAspectRatio` for a ratio.
 */
export interface ParsedLayoutSearchParams {
  layoutConfigs: LayoutConfig[];
  layoutOptions: LayoutOptions;
}

export const layoutConfigKeyAliases = {
  aux: 'contentAuxAspectRatio',
  camera: 'hasCamera',
  cameraMain: 'cameraMainAspectRatio',
  cameraMainAspectRatio: 'cameraMainAspectRatio',
  contentAuxAspectRatio: 'contentAuxAspectRatio',
  contentMainAspectRatio: 'contentMainAspectRatio',
  hasCamera: 'hasCamera',
  hasName: 'hasName',
  info: 'infoAspectRatio',
  infoAspectRatio: 'infoAspectRatio',
  main: 'contentMainAspectRatio',
  name: 'hasName',
} as const satisfies Record<string, keyof LayoutConfig>;

export const layoutOptionKeyAliases = {
  border: 'regionBorder',
  canvasGap: 'canvasGap',
  canvasHeight: 'canvasHeight',
  canvasMarginBottom: 'canvasMarginBottom',
  canvasMarginLeft: 'canvasMarginLeft',
  canvasMarginRight: 'canvasMarginRight',
  canvasMarginTop: 'canvasMarginTop',
  canvasPadding: 'canvasPadding',
  canvasWidth: 'canvasWidth',
  gap: 'canvasGap',
  height: 'canvasHeight',
  layoutGap: 'layoutGap',
  marginBottom: 'canvasMarginBottom',
  marginLeft: 'canvasMarginLeft',
  marginRight: 'canvasMarginRight',
  marginTop: 'canvasMarginTop',
  padding: 'canvasPadding',
  regionBorder: 'regionBorder',
  width: 'canvasWidth',
} as const satisfies Record<string, keyof LayoutOptions>;

export const parseBooleanParam = (value: string): boolean | undefined => {
  const normalizedValue = value.trim().toLowerCase();

  if (['', '1', 'on', 'true', 'yes'].includes(normalizedValue)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalizedValue)) return false;
  return undefined;
};

export const parseAspectRatioParam = (value: string): AspectRatio | null | undefined => {
  const normalizedValue = value.trim().toLowerCase().replace('x', ':');

  if (['', '0', 'false', 'none', 'null', 'off'].includes(normalizedValue)) return null;

  const match = normalizedValue.match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);

  if (!match) return undefined;
  return `${Number(match[1])}:${Number(match[2])}`;
};

export const isContentAspectRatio = (value: string): value is ContentAspectRatio =>
  (CONTENT_ASPECT_RATIOS as readonly string[]).includes(value);

export const parseLayoutConfigPairs = (pairs: Iterable<[string, string]>): LayoutConfig => {
  const layoutConfig: LayoutConfig = {};

  for (const [rawKey, pairValue] of pairs) {
    const key = rawKey.trim();

    if (!hasKey(layoutConfigKeyAliases, key)) continue;

    switch (layoutConfigKeyAliases[key]) {
      case 'hasCamera': {
        const hasCamera = parseBooleanParam(pairValue);
        const cameraMainAspectRatio = hasCamera === undefined ? parseAspectRatioParam(pairValue) : undefined;

        if (hasCamera !== undefined) layoutConfig.hasCamera = hasCamera;
        else if (cameraMainAspectRatio) layoutConfig.cameraMainAspectRatio = cameraMainAspectRatio;
        break;
      }
      case 'hasName': {
        const hasName = parseBooleanParam(pairValue);

        if (hasName !== undefined) layoutConfig.hasName = hasName;
        break;
      }
      case 'cameraMainAspectRatio': {
        const cameraMainAspectRatio = parseAspectRatioParam(pairValue);

        if (cameraMainAspectRatio) layoutConfig.cameraMainAspectRatio = cameraMainAspectRatio;
        break;
      }
      case 'contentAuxAspectRatio': {
        const contentAuxAspectRatio = parseAspectRatioParam(pairValue);

        if (contentAuxAspectRatio === null) layoutConfig.contentAuxAspectRatio = null;
        else if (contentAuxAspectRatio && isContentAspectRatio(contentAuxAspectRatio))
          layoutConfig.contentAuxAspectRatio = contentAuxAspectRatio;
        break;
      }
      case 'contentMainAspectRatio': {
        const contentMainAspectRatio = parseAspectRatioParam(pairValue);

        if (contentMainAspectRatio === null) layoutConfig.contentMainAspectRatio = null;
        else if (contentMainAspectRatio && isContentAspectRatio(contentMainAspectRatio))
          layoutConfig.contentMainAspectRatio = contentMainAspectRatio;
        break;
      }
      case 'infoAspectRatio': {
        const infoAspectRatio =
          pairValue.trim().toLowerCase() === 'auto' ? ('auto' as const) : parseAspectRatioParam(pairValue);

        if (infoAspectRatio !== undefined) layoutConfig.infoAspectRatio = infoAspectRatio;
        break;
      }
    }
  }

  return layoutConfig;
};

export const parseLayoutConfigParam = (value: string): LayoutConfig =>
  parseLayoutConfigPairs(
    value.split(',').map((pair): [string, string] => {
      const [rawKey, ...rawValue] = pair.split('=');

      return [rawKey, rawValue.join('=')];
    }),
  );

export const parseLayoutOptionsParams = (searchParams: URLSearchParams): LayoutOptions => {
  const layoutOptions: LayoutOptions = {};

  for (const [key, value] of searchParams) {
    if (!hasKey(layoutOptionKeyAliases, key)) continue;

    const number = Number(value);

    if (value.trim() !== '' && Number.isFinite(number)) layoutOptions[layoutOptionKeyAliases[key]] = number;
  }

  return layoutOptions;
};

export const parseLayoutSearchParams = (searchParams: URLSearchParams): ParsedLayoutSearchParams => {
  const baseLayoutConfig = parseLayoutConfigPairs(searchParams);
  const layoutConfigs = searchParams
    .getAll('participant')
    .map((value) => ({ ...baseLayoutConfig, ...parseLayoutConfigParam(value) }));
  const participantsTotal = Math.max(1, Math.trunc(Number(searchParams.get('participants')) || 0));

  while (layoutConfigs.length < participantsTotal) layoutConfigs.push({ ...baseLayoutConfig });

  return { layoutConfigs, layoutOptions: parseLayoutOptionsParams(searchParams) };
};
