// The OBS layout installation: the scenes and sources obs-layout-firebot drives, and what the overlays read about
// them. Pure data: `firebot:deploy` stores it in Firebot as JSON, so nothing here may import secrets or code.
// The names below are placeholders from the obs-layout-firebot example until the real installation is bound.
import type { ScenesConfig } from '@eliasthompson/obs-layout-firebot';

import { layoutOptions } from './layoutOptions';

export default {
  // OBS scene that holds one nested layout scene per participant
  container: '[Scene] Content',
  options: layoutOptions,
  // Pixels the border sources' stroke and shadow filters add on every side
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
        contentMain: { source: '[Group] Content 1', border: '[Border] Content 1' },
        camera: { source: '[Group] Camera 1', border: '[Border] Camera 1' },
        name: { source: '[Text] Name 1', inset: 12, fontScale: 0.45, fontSizeMin: 24, fontSizeMax: 48 },
      },
    },
    '[Layout] Person 2': {
      sources: {
        contentMain: { source: '[Group] Content 2', border: '[Border] Content 2' },
        camera: { source: '[Group] Camera 2', border: '[Border] Camera 2' },
      },
    },
  },
  // One preset per scene key: the participants it shows, in layout order, each with an optional layout config
  scenes: {
    '[Scene] 16:9 1P': { participants: [{ layout: '[Layout] Person 1' }] },
    '[Scene] Camera 1P': {
      participants: [{ layout: '[Layout] Person 1', config: { contentMain: null } }],
    },
    '[Scene] 4:3 2P': {
      participants: [
        { layout: '[Layout] Person 1', config: { contentMain: { aspectRatio: '4:3' } } },
        { layout: '[Layout] Person 2', config: { contentMain: { aspectRatio: '4:3' } } },
      ],
      duration: 500,
    },
    '[Scene] Green Screen 1P': {
      participants: [{ layout: '[Layout] Person 1', config: { camera: { isGreenScreen: true } } }],
    },
    '[Standby] Starting Soon': {
      participants: [{ layout: '[Layout] Person 1' }],
      standby: { text: { source: '[Text] Starting Soon', region: { x: 1000, y: 480, width: 700, height: 120 } } },
    },
  },
  // The scene in the container that holds the standby texts, and the height of the standby line
  standby: { textScene: '[Widget] Standby Text', lineHeight: 540 },
} satisfies ScenesConfig;
