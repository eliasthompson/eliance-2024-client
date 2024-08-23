import { useCallback } from 'react';
import { MdContentCopy, MdOpenInNew } from 'react-icons/md';

import { FlexContainer } from '@components/shared/FlexContainer';
import { TwitchButton } from '@components/shared/TwitchButton';
import { TwitchInput } from '@components/shared/TwitchInput';
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
  const handleCopyClick = useCallback(() => {
    const inputElement = document.getElementById('verification-url-input');

    if (inputElement) {
      let range = document.createRange();
      range.selectNode(inputElement);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
    }
  }, []);
  const isRenderable = (
    !isDeviceCodeLoading
    && !deviceCodeError
    && deviceCodeData
  );

  // Render nothing if data is loading or errors unexpectedly
  if (!isRenderable) return null;

  // Prep render of grant button
  let verifyActions = (
    <TwitchButton as="a" href={ deviceCodeData.verification_uri } target="_blank" variant="secondary">Grant&nbsp;<MdOpenInNew /></TwitchButton>
  );

  // Prep render of input and copy button if we're in obs
  if (window.obsstudio) {
    verifyActions= (
      <FlexContainer>
        <TwitchInput id="verification-url-input" attach="right" readOnly value={ deviceCodeData.verification_uri } />
        <TwitchButton onClick={ handleCopyClick } attach="left" variant="secondary"><MdContentCopy /></TwitchButton>
      </FlexContainer>
    );
  }

  // Render component
  return (
    <FlexContainer gap="1rem">
      { verifyActions }
      <TwitchButton onClick={ handleAuthenticateClick }>Authenticate</TwitchButton>
    </FlexContainer>
  );
};
