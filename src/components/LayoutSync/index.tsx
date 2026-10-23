import type { ParticipantPoolEntry, ScenesConfig } from '@eliasthompson/obs-layout-firebot';

import { resolveBorderColor } from '@eliasthompson/obs-layout-firebot/settings';
import { useEffect, useRef, useState } from 'react';

import type { ObsClient } from '@lib/obsWebSocket';

import { createObsClient } from '@lib/obsWebSocket';
import { obsWebSocketPassword, obsWebSocketUrl, scenes } from '@config';
import { writeBorderColor } from '@lib/writeBorderColor';
import { writeNameText } from '@lib/writeNameText';
import { useSelector } from '@store';

// The config is read through its declared type, not the literal one, so every binding may carry a border
const scenesConfig: ScenesConfig = scenes;

/** Each canvas's participant layouts, in the canvas's participant order. */
const canvasEntries = Object.values(scenesConfig.canvases).map((canvas) => Object.values(canvas.participants));

/** Each participant's sources of one kind on every canvas, in the config's participant order. */
const byParticipant = (sourcesOf: (entry: ParticipantPoolEntry) => string[]) =>
  Array.from({ length: Math.max(0, ...canvasEntries.map((entries) => entries.length)) }, (_, i) =>
    canvasEntries.flatMap((entries) => (entries.at(i) ? sourcesOf(entries[i]) : [])),
  );

/** Each participant's border sources on every canvas, in the config's participant order. */
export const participantBorders = byParticipant((entry) =>
  Object.values(entry.sources).flatMap((binding) => (binding.border ? [binding.border] : [])),
);

/** Each participant's name text source on every canvas, in the config's participant order. */
export const participantNames = byParticipant((entry) => (entry.sources.name ? [entry.sources.name.source] : []));

/**
 * Keeps the OBS layouts in step with the persons in the info bar: the first layout's borders take the first person's
 * color and its name text their name, and so on, on every canvas. Writes only what changed, or everything when OBS
 * reconnects, never on the rotation, and does nothing when OBS is not reachable.
 */
export const LayoutSync = () => {
  const { persons } = useSelector(({ info }) => info);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<ObsClient>(undefined);
  const writtenColorsRef = useRef(new Map<string, string>());
  const writtenNamesRef = useRef(new Map<string, string>());
  const borderColor = resolveBorderColor(scenes);
  const hasNames = participantNames.some((names) => names.length);
  const personKeys = persons.map(({ id, color, name }) => `${id}:${color}:${name}`).join('|');

  // Connect to OBS once; the client reconnects on its own, and every connection starts the writes over
  useEffect(() => {
    if (!borderColor && !hasNames) return undefined;

    const client = createObsClient({
      url: obsWebSocketUrl,
      password: obsWebSocketPassword,
      onConnect: () => {
        writtenColorsRef.current.clear();
        writtenNamesRef.current.clear();
        setIsConnected(true);
      },
      onDisconnect: () => setIsConnected(false),
    });

    clientRef.current = client;

    return () => client.close();
  }, []);

  // Write the border colors and names that changed
  useEffect(() => {
    const client = clientRef.current;

    if (!client || !isConnected) return;

    persons.forEach(({ color, name }, i) => {
      if (borderColor) {
        (participantBorders[i] ?? []).forEach((border) => {
          if (writtenColorsRef.current.get(border) === color) return;

          writeBorderColor(client, border, color, borderColor).then((isWritten) => {
            if (isWritten) writtenColorsRef.current.set(border, color);
          });
        });
      }

      (participantNames[i] ?? []).forEach((source) => {
        if (writtenNamesRef.current.get(source) === name) return;

        writeNameText(client, source, name).then((isWritten) => {
          if (isWritten) writtenNamesRef.current.set(source, name);
        });
      });
    });
  }, [isConnected, personKeys]);

  // Render nothing: this component only talks to OBS
  return false;
};
