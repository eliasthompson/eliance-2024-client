import { useCallback } from 'react';

import { TwitchButton } from '@components/shared/TwitchButton';
import { setTwitchAuth } from '@store/slices/twitchAuth';
import { twitchApiUtil } from '@store/apis/twitch';
import { useDispatch, useSelector } from '@store/hooks';
import { useGetDeviceCodeQuery } from '@store/apis/twitch/getDeviceCode';
import { useLazyGetTokensQuery } from '@store/apis/twitch/getTokens';

export const Authentication = () => {
  const dispatch = useDispatch();
  const { clientId, scopes } = useSelector(({ twitchAuth }) => twitchAuth);
  const { data: deviceCodeData, error: deviceCodeError, isLoading: isDeviceCodeLoading } = useGetDeviceCodeQuery({ clientId, scopes });
  const [getTokensQuery] = useLazyGetTokensQuery();
  const handleAuthenticateClick = useCallback(async () => {
    const { data: tokensData } = await getTokensQuery({ clientId, deviceCode: deviceCodeData.device_code, scopes });

    if (tokensData) {
      dispatch(setTwitchAuth({ accessToken: tokensData.access_token, refreshToken: tokensData.refresh_token }));
      dispatch(twitchApiUtil.invalidateTags(['UNAUTHORIZED']));
    }
  }, [clientId, deviceCodeData, getTokensQuery, scopes]);
  const handleCopyClick = useCallback(async () => {
    navigator.clipboard.writeText(deviceCodeData.verification_uri);
  }, [deviceCodeData]);

  // Render nothing if data is loading or errors unexpectedly
  if (isDeviceCodeLoading || deviceCodeError) return null;

  // Render auth buttons when device code data exists
  return (
    <div>
      <TwitchButton onClick={ handleCopyClick } $variant="secondary">
        <div>
          <div>
            Copy
          </div>
        </div>
      </TwitchButton>

      <TwitchButton as="a" href={ deviceCodeData.verification_uri } target="_blank" $variant="secondary">
        <div>
          <div>
            Grant
          </div>
        </div>
      </TwitchButton>

      <TwitchButton onClick={ handleAuthenticateClick }>
        <div>
          <div>
            Authenticate
          </div>
        </div>
      </TwitchButton>
    </div>
  );
};
