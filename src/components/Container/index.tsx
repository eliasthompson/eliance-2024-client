import { Fragment, useEffect } from 'react';
import { css } from '@emotion/react';

import { AuthenticationBar } from '@components/AuthenticationBar';
import { ErrorMessage } from '@components/shared/ErrorMessage';
import { InfoBar } from '@components/InfoBar';
import { addError, setInfo } from '@store/slices/info';
import { useDispatch, useSelector } from '@store';
import { useValidateTokenQuery } from '@src/store/apis/twitch/validateToken';

export const Container = () => {
  const dispatch = useDispatch();
  const { broadcasterId, broadcasterLogin, errors } = useSelector(({ info }) => info);
  const { data: tokenData, error: tokenError, isLoading: isTokenLoading } = useValidateTokenQuery();
  const isAuthorized = !(tokenError && 'status' in tokenError && tokenError.status === 401);
  const isRenderable = !!(broadcasterId && broadcasterLogin);

  const backgroundColorBar = window.obsstudio ? 'transparent' : 'rgba(0, 0, 0, 33%)';
  const borderStyleBar = window.obsstudio ? 'none' : 'solid';
  const bottomBar = window.obsstudio ? '0' : '-6px';
  const filterBar = window.obsstudio ? 'none' : 'drop-shadow(#000000 0 0 calc(var(--padding) * 0.75))';

  const cssBar = css`
    position: absolute;
    bottom: ${bottomBar};
    width: var(--bar-width);
    height: var(--bar-height);
    border-color: #9147ff;
    border-style: ${borderStyleBar};
    border-width: calc(var(--padding) / 2);
    background-color: ${backgroundColorBar};
    filter: ${filterBar};
  `;

  // Set broadcaster id if token data exists
  useEffect(() => {
    if (tokenData) dispatch(setInfo({ broadcasterId: tokenData.user_id, broadcasterLogin: tokenData.login }));
  }, [dispatch, tokenData]);

  // Set errors
  useEffect(() => {
    if (tokenError && 'status' in tokenError) dispatch(addError(tokenError));
  }, [dispatch, tokenError]);

  // Render nothing if data is loading or required data is incomplete
  if (isTokenLoading || !isRenderable) return false;

  // Render component
  return (
    <Fragment>
      {isAuthorized ? <InfoBar cssBar={cssBar} /> : <AuthenticationBar cssBar={cssBar} />}

      {errors.length ? errors.map((error, i) => <ErrorMessage key={i} error={error} />) : null}
    </Fragment>
  );
};
