import type { BorderColor } from '@eliasthompson/obs-layout-firebot/settings';

import {
  COLOR_MOVE_FILTER_NAME,
  colorMoveFilterSettings,
  SETTLE_FRAMES,
} from '@eliasthompson/obs-layout-firebot/settings';

import type { ObsClient } from '@/lib/obsWebSocket';

import { REQUEST_BATCH_EXECUTION_SERIAL_FRAME } from '@/lib/obsWebSocket';
import { toObsColor } from '@/lib/toObsColor';

/**
 * Fade a border source to a color through its Move: Color filter, restarting it in case a fade is still running. The
 * filter is enabled a few frames after its new settings are written, since OBS applies a filter's settings on its next
 * tick and a filter enabled before then fades to its previous color. A border without that filter, before obs:deploy
 * was run for it, gets the color written into its color filter directly, which snaps. Resolves with whether the color
 * reached OBS.
 */
export const writeBorderColor = async (
  client: ObsClient,
  border: string,
  hexColor: string,
  borderColor: BorderColor,
) => {
  const color = toObsColor(hexColor);

  try {
    const results = await client.callBatch(
      [
        {
          requestType: 'SetSourceFilterEnabled',
          requestData: { sourceName: border, filterName: COLOR_MOVE_FILTER_NAME, filterEnabled: false },
        },
        {
          requestType: 'SetSourceFilterSettings',
          requestData: {
            sourceName: border,
            filterName: COLOR_MOVE_FILTER_NAME,
            filterSettings: colorMoveFilterSettings(borderColor, color),
            overlay: true,
          },
        },
        { requestType: 'Sleep', requestData: { sleepFrames: SETTLE_FRAMES } },
        {
          requestType: 'SetSourceFilterEnabled',
          requestData: { sourceName: border, filterName: COLOR_MOVE_FILTER_NAME, filterEnabled: true },
        },
      ],
      { executionType: REQUEST_BATCH_EXECUTION_SERIAL_FRAME, haltOnFailure: true },
    );

    if (results.every(({ requestStatus }) => requestStatus.result)) return true;
  } catch {
    // Not connected; the direct write below fails the same way and logs it
  }

  try {
    await client.call('SetSourceFilterSettings', {
      sourceName: border,
      filterName: borderColor.filter,
      filterSettings: { [borderColor.setting]: color },
      overlay: true,
    });

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console -- the one quiet trace of OBS being unreachable
    console.debug(`could not color "${border}": ${error instanceof Error ? error.message : String(error)}`);

    return false;
  }
};
