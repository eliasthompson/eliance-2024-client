import type { AspectRatio, ContentAspectRatio, LayoutConfig, LayoutOptions } from '@eliasthompson/obs-layout-generator';

import { CONTENT_ASPECT_RATIOS } from '@eliasthompson/obs-layout-generator';

import { hasKey } from '@/lib/hasKey';

/**
 * Search params understood by the layout route, e.g.
 * `#/layout?participants=3&name&aux=4:3&aux.mainAttached&camera.greenScreen&marginBottom=105`:
 *
 * - A region key (`main`, `aux`, `info`, `camera`, or the `LayoutConfig` name) with a ratio shows that region at the
 *   ratio, with `null`/`none`/`off` hides it, and with no value shows it with its defaults. `info` also takes `auto`,
 *   and `camera` takes a boolean or its main column ratio, including `auto`.
 * - A region field as `region.field`: `ratio`, `mainAttached`, `aboveAttached`, and `greenScreen`, or the `LayoutConfig`
 *   field names. Fields a region does not have are ignored.
 * - `name`: the name tag, as a boolean.
 * - `participant`: one participant per occurrence, merged region by region over the base config, as comma separated
 *   `key` or `key=value` pairs.
 * - `participants`: total participant count; missing participants are filled with the base config.
 * - Every `LayoutOptions` key (or its alias below) as a number.
 * - `orientation`: the global param from `useOrientation`, not parsed here. It picks the configured canvas the options
 *   above apply over.
 *
 * Booleans take `true`/`false`, `1`/`0`, `yes`/`no`, `on`/`off`, or no value for `true`. Ratios take `16:9` or `16x9`.
 */
export interface ParsedLayoutSearchParams {
  layoutConfigs: LayoutConfig[];
  layoutOptions: LayoutOptions;
}

export type LayoutRegionConfigKey = Exclude<keyof LayoutConfig, 'hasName'>;

export type LayoutRegionConfigField = 'aspectRatio' | 'isMainAttached' | 'isAboveAttached' | 'isGreenScreen';

/** Every field any region config can take; a region only receives the fields listed for it in `layoutRegionFields` */
export interface LayoutRegionConfigFields {
  mainAspectRatio?: 'auto' | AspectRatio;
  aspectRatio?: 'auto' | AspectRatio;
  isMainAttached?: boolean;
  isAboveAttached?: boolean;
  isGreenScreen?: boolean;
}

export const layoutRegionConfigKeys = [
  'camera',
  'contentMain',
  'contentAux',
  'info',
] as const satisfies readonly LayoutRegionConfigKey[];

export const layoutRegionKeyAliases = {
  aux: 'contentAux',
  camera: 'camera',
  contentAux: 'contentAux',
  contentMain: 'contentMain',
  info: 'info',
  main: 'contentMain',
} as const satisfies Record<string, LayoutRegionConfigKey>;

export const layoutRegionFieldAliases = {
  aspectRatio: 'aspectRatio',
  aboveAttached: 'isAboveAttached',
  mainAttached: 'isMainAttached',
  greenScreen: 'isGreenScreen',
  isAboveAttached: 'isAboveAttached',
  isGreenScreen: 'isGreenScreen',
  isMainAttached: 'isMainAttached',
  mainAspectRatio: 'aspectRatio',
  ratio: 'aspectRatio',
} as const satisfies Record<string, LayoutRegionConfigField>;

export const layoutRegionFields = {
  camera: ['aspectRatio', 'isMainAttached', 'isAboveAttached', 'isGreenScreen'],
  contentMain: ['aspectRatio'],
  contentAux: ['aspectRatio', 'isMainAttached'],
  info: ['aspectRatio', 'isMainAttached', 'isAboveAttached'],
} as const satisfies Record<LayoutRegionConfigKey, readonly LayoutRegionConfigField[]>;

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
  nameHeightMin: 'nameHeightMin',
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

/** Parse a ratio for a region: content regions take content ratios only, info and camera any ratio or `auto` */
export const parseRegionAspectRatioParam = (
  regionKey: LayoutRegionConfigKey,
  value: string,
): 'auto' | AspectRatio | undefined => {
  if ((regionKey === 'info' || regionKey === 'camera') && value.trim().toLowerCase() === 'auto') return 'auto';

  const aspectRatio = parseAspectRatioParam(value);

  if (!aspectRatio) return undefined;
  if (regionKey === 'camera' || regionKey === 'info') return aspectRatio;
  return isContentAspectRatio(aspectRatio) ? aspectRatio : undefined;
};

/** Merge fields into a region config, turning the region on if it was off or unset */
export const setLayoutRegionFields = <Key extends LayoutRegionConfigKey>(
  layoutConfig: LayoutConfig,
  regionKey: Key,
  fields: LayoutRegionConfigFields,
) => {
  // Only fields the region has reach this point, so the loose fields type fits the region's config
  layoutConfig[regionKey] = { ...layoutConfig[regionKey], ...fields } as LayoutConfig[Key];
};

export const parseLayoutConfigPairs = (pairs: Iterable<[string, string]>): LayoutConfig => {
  const layoutConfig: LayoutConfig = {};

  for (const [rawKey, pairValue] of pairs) {
    const key = rawKey.trim();

    if (key === 'name' || key === 'hasName') {
      const hasName = parseBooleanParam(pairValue);

      if (hasName !== undefined) layoutConfig.hasName = hasName;
      continue;
    }

    const [rawRegionKey, rawFieldKey, ...rest] = key.split('.');

    if (rest.length || !hasKey(layoutRegionKeyAliases, rawRegionKey)) continue;

    const regionKey = layoutRegionKeyAliases[rawRegionKey];

    // A bare region key takes a boolean, a ratio, or nothing to show the region with its defaults
    if (rawFieldKey === undefined) {
      const isShown = parseBooleanParam(pairValue);
      const aspectRatio = isShown === undefined ? parseRegionAspectRatioParam(regionKey, pairValue) : undefined;

      if (isShown) setLayoutRegionFields(layoutConfig, regionKey, {});
      else if (isShown === false || parseAspectRatioParam(pairValue) === null) layoutConfig[regionKey] = null;
      else if (aspectRatio)
        setLayoutRegionFields(layoutConfig, regionKey, {
          [regionKey === 'camera' ? 'mainAspectRatio' : 'aspectRatio']: aspectRatio,
        });
      continue;
    }

    if (!hasKey(layoutRegionFieldAliases, rawFieldKey)) continue;

    const field = layoutRegionFieldAliases[rawFieldKey];

    if (!(layoutRegionFields[regionKey] as readonly LayoutRegionConfigField[]).includes(field)) continue;

    if (field === 'aspectRatio') {
      const aspectRatio = parseRegionAspectRatioParam(regionKey, pairValue);

      if (aspectRatio)
        setLayoutRegionFields(layoutConfig, regionKey, {
          [regionKey === 'camera' ? 'mainAspectRatio' : 'aspectRatio']: aspectRatio,
        });
    } else {
      const flag = parseBooleanParam(pairValue);

      if (flag !== undefined) setLayoutRegionFields(layoutConfig, regionKey, { [field]: flag });
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

/** Merge an override config over a base config, field by field within each region both of them show */
export const mergeLayoutConfigs = (baseLayoutConfig: LayoutConfig, layoutConfig: LayoutConfig): LayoutConfig => {
  const mergedLayoutConfig: LayoutConfig = { ...baseLayoutConfig, ...layoutConfig };

  for (const regionKey of layoutRegionConfigKeys) {
    const baseRegion = baseLayoutConfig[regionKey];
    const region = layoutConfig[regionKey];

    if (baseRegion && region) setLayoutRegionFields(mergedLayoutConfig, regionKey, { ...baseRegion, ...region });
  }

  return mergedLayoutConfig;
};

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
    .map((value) => mergeLayoutConfigs(baseLayoutConfig, parseLayoutConfigParam(value)));
  const participantsTotal = Math.max(1, Math.trunc(Number(searchParams.get('participants')) || 0));

  while (layoutConfigs.length < participantsTotal) layoutConfigs.push(mergeLayoutConfigs(baseLayoutConfig, {}));

  return { layoutConfigs, layoutOptions: parseLayoutOptionsParams(searchParams) };
};
