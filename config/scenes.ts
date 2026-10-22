// The OBS layout installation: the scenes and sources obs-layout-firebot drives, and what the overlays read about
// them. Pure data: `firebot:deploy` stores it in Firebot as JSON, so nothing here may import secrets or code.
import type { LayoutConfig } from '@eliasthompson/obs-layout-generator';
import type { ParticipantPoolEntry, SceneBinding, ScenesConfig } from '@eliasthompson/obs-layout-firebot';

import { layoutCanvases } from './layoutCanvases';

/** How many `[Layout] Person N` scenes exist in OBS. Raise it as they are built; `obs:verify` reports missing ones. */
const PEOPLE = 1;

/** The content shapes, each a scene preset. What is not a shape is a modifier, switched on and off over any of them. */
const shapes = {
  'Camera': { contentMain: null },
  '16:9': {},
  '4:3': { contentMain: { aspectRatio: '4:3' } },
  'DS Split': { contentMain: { aspectRatio: '4:3' }, contentAux: { aspectRatio: '4:3', isMainAttached: true } },
  '3DS Split': { contentMain: { aspectRatio: '5:3' }, contentAux: { aspectRatio: '4:3', isMainAttached: true } },
  'GBA': { contentMain: { aspectRatio: '3:2' } },
  'SNES': { contentMain: { aspectRatio: '8:7' } },
  'GB(C)': { contentMain: { aspectRatio: '10:9' } },
  'NES': { contentMain: { aspectRatio: '16:15' } },
} satisfies Record<string, LayoutConfig>;

type Shape = keyof typeof shapes;

const people = Array.from({ length: PEOPLE }, (_, index) => index + 1);
const shapeKeys = Object.keys(shapes) as Shape[];

/** One person's layout scene and the OBS item (and border) that fills each of their regions, named by their number. */
const person = (n: number): ParticipantPoolEntry => ({
  sources: {
    camera: { source: `[Group] Camera ${n}`, border: `[Border] Camera ${n}` },
    contentAux: { source: `[Group] Aux Content ${n}`, border: `[Border] Aux Content ${n}` },
    contentMain: { source: `[Group] Main Content ${n}`, border: `[Border] Main Content ${n}` },
    info: { source: `[Widget] Info ${n}`, border: `[Border] Info ${n}` },
    name: { source: `[Text] Name ${n}` },
  },
});

/**
 * A scene showing one person per shape, in layout order: `[2P] 16:9` when everyone shares the shape, `[2P] 16:9 +
 * Camera` when not. Scene keys name the Firebot presets, so renaming one orphans its preset.
 */
const scene = (...keys: Shape[]): [string, SceneBinding] => [
  `[${keys.length}P] ${new Set(keys).size === 1 ? keys[0] : keys.join(' + ')}`,
  { participants: keys.map((key, index) => ({ layout: `[Layout] Person ${index + 1}`, config: shapes[key] })) },
];

export default {
  // The OBS scene collection, for when OBS cannot say which one is loaded
  obs: { sceneCollection: 'Eliance 2026' },
  // The Firebot profile the tools install into
  firebot: { profile: 'Eliance 2026' },
  // OBS scene that holds one nested layout scene per participant
  container: '[Scene] Canvas',
  // The scene in the container that holds the standby texts, the height of the standby line, and how far past the
  // line a standby text shows, centered on it at its rendered size
  standby: { textScene: '[Widget] Standby Text', lineHeight: 540, textGap: 48 },
  // The landscape canvas the overlays size themselves from, so the OBS layouts match the #/layout preview
  options: layoutCanvases.landscape,
  // Pixels the border sources' shadow filters add outside the border on every side
  borderPadding: 9,
  // The Stroke filter on each border carries its color; the info bar fades it to each participant's color
  borderColor: { filter: 'Stroke', duration: 500 },
  // Move duration in milliseconds
  duration: 300,
  // How every participant's sources sit in their regions; a person or a scene can override any field per region
  regions: {
    info: { inset: 12, boundsAlignment: 'top center' },
    name: { inset: 12, fontSizeMin: 24, fontSizeMax: 48 },
  },
  // Every layout scene, in participant order: the broadcaster first, then Guest Star guests, then the Firebot guest
  // role, as the info bar lists them
  participants: Object.fromEntries(people.map((n) => [`[Layout] Person ${n}`, person(n)])),
  // One preset per scene key: the standby screens, then the shapes for one person, then the mixes for more
  scenes: {
    '[Standby] Starting Soon': { standby: { text: '[Text] Starting Soon' } },
    '[Standby] Be Right Back': { standby: { text: '[Text] Be Right Back' } },
    '[Standby] Thanks for Watching': { standby: { text: '[Text] Thanks for Watching' } },
    ...Object.fromEntries([
      ...shapeKeys.map((shape) => scene(shape)),
      // Two people: the broadcaster in any shape with a camera guest, and both on 16:9
      ...(people.length >= 2 ? [...shapeKeys.map((shape) => scene(shape, 'Camera')), scene('16:9', '16:9')] : []),
    ]),
  },
  // Switched on and off over any scene with their own presets: "Keyed On", "Keyed Off", and so on, plus "Reset
  // Modifiers". A region config switches the region on, so the timer strip's shape lives in its modifier
  modifiers: {
    'Keyed Cameras': { config: { camera: { isGreenScreen: true } } },
    'Names': { config: { hasName: true } },
    'Timer': { config: { info: { aspectRatio: '250:49', isAboveAttached: true, isMainAttached: true } } },
  },
} satisfies ScenesConfig;
