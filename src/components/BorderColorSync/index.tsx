import type { ScenesConfig } from '@eliasthompson/obs-layout-firebot';

import { useEffect, useRef, useState } from 'react';

import type { ObsClient } from '@lib/obsWebSocket';

import { createObsClient } from '@lib/obsWebSocket';
import { obsWebSocketPassword, obsWebSocketUrl, scenes } from '@config';
import { resolveBorderColor, writeBorderColor } from '@lib/writeBorderColor';
import { useSelector } from '@store';

// The config is read through its declared type, not the literal one, so every binding may carry a border
const scenesConfig: ScenesConfig = scenes;

/** Each participant layout's border sources, in the config's participant order. */
export const participantBorders = Object.values(scenesConfig.participants).map((entry) =>
  Object.values(entry.sources).flatMap((binding) => (binding.border ? [binding.border] : [])),
);

/**
 * Colors the layout borders in OBS to match the persons in the info bar: the border sources of the first layout take
 * the first person's color, and so on. Writes only when a person's color changes or OBS reconnects, never on the
 * rotation, and does nothing when OBS is not reachable.
 */
export const BorderColorSync = () => {
  const { persons } = useSelector(({ info }) => info);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<ObsClient>(undefined);
  const writtenColorsRef = useRef(new Map<string, string>());
  const borderColor = resolveBorderColor(scenes);
  const personColors = persons.map(({ id, color }) => `${id}:${color}`).join('|');

  // Connect to OBS once; the client reconnects on its own, and every connection starts the colors over
  useEffect(() => {
    if (!borderColor) return undefined;

    const client = createObsClient({
      url: obsWebSocketUrl,
      password: obsWebSocketPassword,
      onConnect: () => {
        writtenColorsRef.current.clear();
        setIsConnected(true);
      },
      onDisconnect: () => setIsConnected(false),
    });

    clientRef.current = client;

    return () => client.close();
  }, []);

  // Write the border colors that changed
  useEffect(() => {
    const client = clientRef.current;

    if (!client || !isConnected || !borderColor) return;

    persons.forEach(({ color }, i) => {
      (participantBorders[i] ?? []).forEach((border) => {
        if (writtenColorsRef.current.get(border) === color) return;

        writeBorderColor(client, border, color, borderColor).then((isWritten) => {
          if (isWritten) writtenColorsRef.current.set(border, color);
        });
      });
    });
  }, [isConnected, personColors]);

  // Render nothing: this component only talks to OBS
  return false;
};
