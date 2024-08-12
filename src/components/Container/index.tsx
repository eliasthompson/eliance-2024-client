import { MouseEvent, useCallback, useEffect } from 'react';
import { styled } from 'styled-components';

import { useDispatch, useSelector } from '@store/hooks';
import { setTwitchAuth } from '@store/slices/twitchAuth';
import { useGetChannelQuery, useGetTokensMutation, useLazyGetDeviceCodeQuery } from '@store/apis/twitch';

export const TwitchButton = styled.a<{ type?: string }>`
  cursor: pointer;
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  overflow: hidden;
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  font-weight: 600;
  font-size: 1.3rem;
  height: 3rem;
  border-radius: 0.4rem;
  color: #ffffff;
  background-color: ${({ type = 'primary' }) => (type === 'primary') ? '#9147ff' : 'transparent'};
  
  &:active {
    background-color: ${({ type = 'primary' }) => (type === 'primary') ? '##5c16c5' : 'rgb(83 83 95 / 55%)'};
  }
  
  &:hover {
    background-color: ${({ type = 'primary' }) => (type === 'primary') ? '#772ce8' : 'rgb(83 83 95 / 48%)'};
  }

  div {
    display: flex;
    align-items: center;
    flex-grow: 0;
    padding: 0px 1rem;

    div {
      flex-grow: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: flex-start !important;
    }
  }
`;

const Loading = () => (
  <h1>
    Loading...
  </h1>
);

export const Container = () => {
  const dispatch = useDispatch();
  const { accessToken, authorized, broadcasterId, clientId, deviceCode, scopes, verificationUri } = useSelector(({ twitchAuth }) => twitchAuth);
  const { data: channelData, error: channelError, isLoading: isChannelLoading } = useGetChannelQuery({ accessToken, broadcasterId, clientId });
  const [getTokensMutation] = useGetTokensMutation();
  const [getDeviceCodeQuery] = useLazyGetDeviceCodeQuery();
  const handleAuthenticateClick = useCallback(async (event: MouseEvent) => {
    event.preventDefault();

    const { data: tokensData = {} } = await getTokensMutation({ clientId, deviceCode, scopes });

    if ('access_token' in tokensData && 'refresh_token' in tokensData) {
      const { access_token: accessToken, refresh_token: refreshToken } = tokensData;

      dispatch(setTwitchAuth({ accessToken, authorized: true, refreshToken }));
    }

  }, [clientId, deviceCode, getTokensMutation, scopes]);

  useEffect(() => {
    (async () => {
      const { data: { device_code: deviceCode, verification_uri: verificationUri } } = await getDeviceCodeQuery({ clientId, scopes });

      dispatch(setTwitchAuth({ deviceCode, verificationUri }));
    })();
  }, [clientId, getDeviceCodeQuery, scopes]);

  if (!authorized) {
    return (
      <div>
        <TwitchButton href={ verificationUri } target="_blank" type="secondary">
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
  }

  return <Loading />;
};
