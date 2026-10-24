import type { SceneBinding, ScenesConfig } from '@eliasthompson/obs-layout-firebot';

import { CANVASES } from '@/constants/canvases';
import { LAYOUTS } from '@/constants/layouts';
import { LAYOUT_KEYS, type LayoutKey } from '@/constants/layoutKeys';
import { STANDBY_KEYS, type StandbyKey } from '@/constants/standbyKeys';
import { CANVAS_SPACING } from '@/constants/canvasSpacing';
import { REGIONS } from '@/constants/regions';
import { AUDIO_SOURCES } from '@/constants/audioSources';

const isVerticalEnabled = true as const satisfies boolean;
const nameFontSizeMax = 48 as const satisfies number;
const nameFontSizeMin = 24 as const satisfies number;
const participantTotal = 2 as const satisfies number;
const standbyTextGap = 48 as const satisfies number;
const transitionDuration = 500 as const satisfies number;
const transparentSourceInset = 12 as const satisfies number;
const verticalSuffix = ' (V)' as const satisfies string;

const borderPadding = CANVAS_SPACING.layoutGap / 2;
const participantNums = Array.from({ length: participantTotal }, (_, index) => index + 1);
const sourceLists = participantNums.flatMap((participantNum) =>
  REGIONS.map((region) => `[List] ${region} ${participantNum} Sources`),
);
const portraitLineLength = CANVASES.portrait.canvasWidth * 0.75;
const portraitLineInset = (CANVASES.portrait.canvasWidth - portraitLineLength) / 2;
const landscapeLineLength =
  CANVASES.landscape.canvasHeight -
  CANVASES.landscape.canvasMarginTop -
  CANVASES.landscape.canvasMarginBottom -
  portraitLineInset * 2;

const getParticipants = (suffix = '') =>
  Object.fromEntries(
    participantNums.map((participantNum) => [
      `[Layout] Person ${participantNum}`,
      {
        ...(suffix ? { scene: `[Layout] Person ${participantNum}${suffix}` } : {}),
        sources: {
          camera: { source: `[Group] Camera ${participantNum}`, border: `[Border] Camera ${participantNum}${suffix}` },
          contentAux: {
            source: `[Group] Aux Content ${participantNum}`,
            border: `[Border] Aux Content ${participantNum}${suffix}`,
          },
          contentMain: {
            source: `[Group] Main Content ${participantNum}`,
            border: `[Border] Main Content ${participantNum}${suffix}`,
          },
          info: { source: `[List] Info ${participantNum} Sources`, border: `[Border] Info ${participantNum}${suffix}` },
          name: { source: `[Text] Name ${participantNum}${suffix}` },
        },
      },
    ]),
  );

const getLayout = (...layoutKeys: LayoutKey[]): [string, SceneBinding] => [
  `[${layoutKeys.length}P] ${new Set(layoutKeys).size === 1 ? layoutKeys[0] : layoutKeys.join(' + ')}`,
  {
    participants: layoutKeys.map((layoutKey, index) => ({
      layout: `[Layout] Person ${index + 1}`,
      config: LAYOUTS[layoutKey],
    })),
  },
];

const getStandbyScene = (standbyKey: StandbyKey): [string, SceneBinding] => [
  `[Standby] ${standbyKey}`,
  {
    standby: { text: `[Text] ${standbyKey}` },
    items: { '[Audio] Voice': false },
    ...(isVerticalEnabled
      ? { canvases: { portrait: { standby: { text: `[Text] ${standbyKey}${verticalSuffix}` } } } }
      : {}),
  },
];

export const SCENES = Object.freeze({
  obs: { sceneCollection: 'Eliance 2026' },
  firebot: { profile: 'Eliance 2026' },
  canvases: {
    landscape: {
      container: '[Scene] Canvas',
      options: CANVASES.landscape,
      participants: getParticipants(),
      standby: { textScene: '[List] Standby Text Sources', lineLength: landscapeLineLength, textGap: standbyTextGap },
      items: { '[Audio] Alerts': { visible: true }, '[Audio] Voice': { visible: true } },
      fadeScenes: [...AUDIO_SOURCES, ...sourceLists],
    },
    ...(isVerticalEnabled
      ? {
          portrait: {
            canvas: 'Aitum Vertical',
            container: `[Scene] Canvas${verticalSuffix}`,
            options: CANVASES.portrait,
            participants: getParticipants(verticalSuffix),
            standby: {
              textScene: `[List] Standby Text Sources${verticalSuffix}`,
              lineLength: portraitLineLength,
              textGap: standbyTextGap,
            },
          },
        }
      : {}),
  },
  borderPadding,
  borderColor: { filter: 'Stroke', duration: transitionDuration },
  duration: transitionDuration,
  regions: {
    camera: { boundsType: 'scale to outer bounds', cropToBounds: true },
    info: { inset: transparentSourceInset, boundsAlignment: 'top center', boundsType: 'scale to width of bounds' },
    name: {
      inset: transparentSourceInset,
      boundsType: 'maximum size only',
      cropToBounds: true,
      fontSizeMin: nameFontSizeMin,
      fontSizeMax: nameFontSizeMax,
    },
  },
  scenes: {
    ...Object.fromEntries([
      ...STANDBY_KEYS.map((standbyKey) => getStandbyScene(standbyKey)),
      ...LAYOUT_KEYS.map((layoutKey) => getLayout(layoutKey)),
      ...LAYOUT_KEYS.map((layoutKey) => getLayout(layoutKey, layoutKey)),
    ]),
    // Add custom layouts here,
    '[1P] 4:3 w/o Camera': {
      participants: [
        {
          layout: '[Layout] Person 1',
          config: { contentMain: { aspectRatio: '4:3' }, camera: null },
        },
      ],
      items: { '[Audio] Alerts': false, '[Audio] Voice': false },
    },
  },
  modifiers: {
    'Keyed Cameras': { config: { camera: { isGreenScreen: true } } },
    'Names': { config: { hasName: true } },
    'Timer': { config: { info: { aspectRatio: '250:49', isAboveAttached: true, isMainAttached: true } } },
  },
} as const satisfies ScenesConfig);

export default SCENES;
