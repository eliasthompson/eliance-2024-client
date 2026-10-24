import type { ObsClient } from '@/lib/obsWebSocket';

/**
 * Write a person's name into a layout's name text source, leaving its font and everything else as they are, since
 * obs-layout-firebot sizes the font to the name's region. Resolves with whether the name reached OBS.
 */
export const writeNameText = async (client: ObsClient, source: string, name: string) => {
  try {
    await client.call('SetInputSettings', { inputName: source, inputSettings: { text: name }, overlay: true });

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console -- the one quiet trace of OBS being unreachable
    console.debug(`could not name "${source}": ${error instanceof Error ? error.message : String(error)}`);

    return false;
  }
};
