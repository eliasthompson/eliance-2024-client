import type { ScenesConfig } from '@eliasthompson/obs-layout-firebot';

import type { ObsClient } from '@lib/obsWebSocket';

import { toObsColor } from '@lib/toObsColor';

// The filter obs-layout-firebot's obs:deploy creates on every border for recoloring, and the Move Transition
// settings it takes, as in that package's filterSettings. Mirrored here because the package itself is Node-only.
export const COLOR_MOVE_FILTER_NAME = 'Move: Color';
const DEFAULT_BORDER_COLOR_SETTING = 'stroke_fill_color';
const DEFAULT_BORDER_COLOR_DURATION = 500;
const MOVE_VALUE_TYPE_SINGLE_SETTING = 0;
const MOVE_VALUE_COLOR = 3;
const EASE_IN_OUT = 3;
const EASING_CUBIC = 2;

export interface BorderColor {
  filter: string;
  setting: string;
  duration: number;
}

/** The config's border color settings with their defaults filled in, or `undefined` when borders are not recolored. */
export const resolveBorderColor = ({ borderColor }: Pick<ScenesConfig, 'borderColor'>): BorderColor | undefined =>
  borderColor
    ? {
        filter: borderColor.filter,
        setting: borderColor.setting ?? DEFAULT_BORDER_COLOR_SETTING,
        duration: borderColor.duration ?? DEFAULT_BORDER_COLOR_DURATION,
      }
    : undefined;

/**
 * Fade a border source to a color through its Move: Color filter, restarting it in case a fade is still running. A
 * border without that filter, before obs:deploy was run for it, gets the color written into its color filter directly,
 * which snaps. Resolves with whether the color reached OBS.
 */
export const writeBorderColor = async (
  client: ObsClient,
  border: string,
  hexColor: string,
  { filter, setting, duration }: BorderColor,
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
      filterSettings: {
        move_value_type: MOVE_VALUE_TYPE_SINGLE_SETTING,
        filter,
        setting_name: setting,
        value_type: MOVE_VALUE_COLOR,
        setting_color: color,
        custom_duration: true,
        duration,
        start_delay: 0,
        easing_match: EASE_IN_OUT,
        easing_function_match: EASING_CUBIC,
        enabled_match_moving: true,
      },
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
        filterName: filter,
        filterSettings: { [setting]: color },
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
