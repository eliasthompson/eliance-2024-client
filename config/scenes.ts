// The OBS layout installation: the scenes and sources obs-layout-firebot drives, and what the overlays read about
// them. Pure data: `firebot:deploy` stores it in Firebot as JSON, so nothing here may import secrets or code.
import type { ScenesConfig } from '@eliasthompson/obs-layout-firebot';

import { layoutOptions } from './layoutOptions';

export default {
  // The OBS scene collection, for when OBS cannot say which one is loaded
  obs: { sceneCollection: 'Eliance 2026' },
  // The Firebot profile the tools install into
  firebot: { profile: 'Eliance 2026' },
  // OBS scene that holds one nested layout scene per participant
  container: '[Scene] Canvas',
  // The scene in the container that holds the standby texts, and the height of the standby line
  standby: { textScene: '[Widget] Standby Text', lineHeight: 540 },
  // The canvas the overlays size themselves from, so the OBS layouts match the #/layout preview
  options: layoutOptions,
  // Pixels the border sources' shadow filters add outside the border on every side
  borderPadding: 9,
  // The Stroke filter on each border carries its color; the info bar fades it to each participant's color
  borderColor: { filter: 'Stroke', duration: 500 },
  // Move duration in milliseconds
  duration: 300,
  // Every layout scene, with the OBS item (and border) that fills each region. Their order is the participant
  // order: the broadcaster first, then Guest Star guests, then the Firebot guest role, as the info bar lists them
  participants: {
    '[Layout] Person 1': {
      sources: {
        contentMain: { source: '[Group] Main Content 1', border: '[Border] Main Content 1' },
        contentAux: { source: '[Group] Aux Content 1', border: '[Border] Aux Content 1' },
        info: {
          source: '[Widget] Info 1',
          border: '[Border] Info 1',
          inset: 12,
          boundsAlignment: 'top center',
        },
        camera: { source: '[Group] Camera 1', border: '[Border] Camera 1' },
        name: { source: '[Text] Name 1', inset: 12, fontScale: 0.45, fontSizeMin: 24, fontSizeMax: 48 },
      },
    },
  },
  // One preset per scene key: the participants it shows, in layout order, each with an optional layout config
  scenes: {
    '[Standby] Starting Soon': {
      participants: [{ layout: '[Layout] Person 1' }],
      standby: { text: { source: '[Text] Starting Soon', region: { x: 990, y: 339, width: 580, height: 402 } } },
    },
    '[Standby] Be Right Back': {
      participants: [{ layout: '[Layout] Person 1' }],
      standby: { text: { source: '[Text] Be Right Back', region: { x: 990, y: 339, width: 612, height: 402 } } },
    },
    '[Standby] Thanks for Watching': {
      participants: [{ layout: '[Layout] Person 1' }],
      standby: {
        text: { source: '[Text] Thanks for Watching', region: { x: 990, y: 339, width: 782, height: 402 } },
      },
    },
    '[1P] Camera': {
      participants: [{ layout: '[Layout] Person 1', config: { contentMain: null } }],
    },
    '[1P] 16:9': {
      participants: [{ layout: '[Layout] Person 1' }],
    },
    '[1P] 16:9 w/ Timer': {
      participants: [
        {
          layout: '[Layout] Person 1',
          config: { info: { aspectRatio: '250:49', isAboveAttached: true, isMainAttached: true } },
        },
      ],
    },
    '[1P] 4:3': {
      participants: [{ layout: '[Layout] Person 1', config: { contentMain: { aspectRatio: '4:3' } } }],
    },
    '[1P] 4:3 w/ Timer': {
      participants: [
        {
          layout: '[Layout] Person 1',
          config: {
            contentMain: { aspectRatio: '4:3' },
            info: { aspectRatio: '250:49', isAboveAttached: true, isMainAttached: true },
          },
        },
      ],
    },
    '[1P] 3DS Split': {
      participants: [
        {
          layout: '[Layout] Person 1',
          config: { contentMain: { aspectRatio: '5:3' }, contentAux: { aspectRatio: '4:3' } },
        },
      ],
    },
    '[1P] DS Split': {
      participants: [
        {
          layout: '[Layout] Person 1',
          config: { contentMain: { aspectRatio: '4:3' }, contentAux: { aspectRatio: '4:3' } },
        },
      ],
    },
    '[1P] SNES': {
      participants: [{ layout: '[Layout] Person 1', config: { contentMain: { aspectRatio: '8:7' } } }],
    },
    '[1P] GB(C)': {
      participants: [{ layout: '[Layout] Person 1', config: { contentMain: { aspectRatio: '10:9' } } }],
    },
    '[1P] NES': {
      participants: [{ layout: '[Layout] Person 1', config: { contentMain: { aspectRatio: '16:15' } } }],
    },
    '[1P] Camera (Keyed)': {
      participants: [{ layout: '[Layout] Person 1', config: { contentMain: null, camera: { isGreenScreen: true } } }],
    },
    '[1P] 16:9 (Keyed)': {
      participants: [{ layout: '[Layout] Person 1', config: { camera: { isGreenScreen: true } } }],
    },
    '[1P] 4:3 (Keyed)': {
      participants: [
        {
          layout: '[Layout] Person 1',
          config: { contentMain: { aspectRatio: '4:3' }, camera: { isGreenScreen: true } },
        },
      ],
    },
  },
} satisfies ScenesConfig;
