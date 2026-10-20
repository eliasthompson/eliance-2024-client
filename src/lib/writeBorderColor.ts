import type { BorderColor } from '@eliasthompson/obs-layout-firebot/settings';

import { COLOR_MOVE_FILTER_NAME, colorMoveFilterSettings } from '@eliasthompson/obs-layout-firebot/settings';

import type { ObsClient } from '@lib/obsWebSocket';

import { toObsColor } from '@lib/toObsColor';

/**
 * Fade a border source to a color through its Move: Color filter, restarting it in case a fade is still running. A
 * border without that filter, before obs:deploy was run for it, gets the color written into its color filter directly,
 * which snaps. Resolves with whether the color reached OBS.
 */
export const writeBorderColor = async (
  client: ObsClient,
  border: string,
  hexColor: string,
  borderColor: BorderColor,
) => {
  const color = toObsColor(hexColor);

  try {
    await client.call('SetSourceFilterEnabled', {
      sourceName: border,
      filterName: COLOR_MOVE_FILTER_NAME,
      filterEnabled: false,
    });
    await client.call('SetSourceFilterSettings', {
      sourceName: border,
      filterName: COLOR_MOVE_FILTER_NAME,
      filterSettings: colorMoveFilterSettings(borderColor, color),
      overlay: true,
    });
    await client.call('SetSourceFilterEnabled', {
      sourceName: border,
      filterName: COLOR_MOVE_FILTER_NAME,
      filterEnabled: true,
    });

    return true;
  } catch {
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
  }
};
