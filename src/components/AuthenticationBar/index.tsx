import { MdContentCopy, MdOpenInNew } from 'react-icons/md';
import { css } from '@emotion/react';
import { useCallback } from 'react';

import type { AuthenticationBarProps } from '@components/AuthenticationBar/types';

import { FlexContainer } from '@components/shared/FlexContainer';
import { TwitchButton } from '@components/shared/TwitchButton';
import { TwitchInput } from '@components/shared/TwitchInput';
import { clientId, scopes } from '@config';
import { setTwitchAuth } from '@store/slices/twitchAuth';
import { twitchApiUtil } from '@store/apis/twitch';
import { useCreateTokenMutation } from '@store/apis/twitch/createToken';
import { useDispatch } from '@store';
import { useGetDeviceCodeQuery } from '@store/apis/twitch/getDeviceCode';

export const AuthenticationBar = ({ cssBar: cssBarProvided }: AuthenticationBarProps) => {
  const dispatch = useDispatch();
  const {
    data: deviceCodeData,
    error: deviceCodeError,
    isLoading: isDeviceCodeLoading,
  } = useGetDeviceCodeQuery({ clientId, scopes });
  const [createTokenMutation] = useCreateTokenMutation();
  const handleAuthenticateClick = useCallback(async () => {
    const { data: tokenData } = await createTokenMutation({
      clientId,
      deviceCode: deviceCodeData.device_code,
      scopes,
    });

    if (tokenData) {
      dispatch(
        setTwitchAuth({
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
        }),
      );
      dispatch(twitchApiUtil.invalidateTags(['UNAUTHORIZED']));
    }
  }, [deviceCodeData, createTokenMutation]);
  const handleCopyClick = useCallback(() => {
    const inputElement = document.getElementById('verification-url-input');

    if (inputElement) {
      const range = document.createRange();
      range.selectNode(inputElement);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
    }
  }, []);
  const isRenderable = !isDeviceCodeLoading && !deviceCodeError && deviceCodeData;
  const cssBar = css`
    gap: 1rem;
    align-items: center;
    justify-content: center;
    ${cssBarProvided?.styles}
  `;

  // Render nothing if data is loading or errors unexpectedly
  if (!isRenderable) return null;

  // Prep render of grant button
  let verifyActions = (
    <TwitchButton as="a" href={deviceCodeData.verification_uri} target="_blank" variant="secondary">
      Grant&nbsp;
      <MdOpenInNew />
    </TwitchButton>
  );

  // Prep render of input and copy button if we're in obs
  if (window.obsstudio) {
    verifyActions = (
      <FlexContainer>
        <TwitchInput id="verification-url-input" attach="right" readOnly value={deviceCodeData.verification_uri} />
        <TwitchButton onClick={handleCopyClick} attach="left" variant="secondary">
          <MdContentCopy />
        </TwitchButton>
      </FlexContainer>
    );
  }

  // Render component
  return (
    <FlexContainer cssContainer={cssBar}>
      {verifyActions}
      <TwitchButton onClick={handleAuthenticateClick}>Authenticate</TwitchButton>
    </FlexContainer>
  );
};
