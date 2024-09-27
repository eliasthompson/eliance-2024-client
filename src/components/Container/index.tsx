import { Fragment, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthenticationBar } from '@components/AuthenticationBar';
// import { ErrorMessage } from '@components/shared/ErrorMessage';
import { addError, setInfo } from '@store/slices/info';
import { useDispatch, useSelector } from '@store';
import { useValidateTokenQuery } from '@src/store/apis/twitch/validateToken';

export const Container = () => {
  const dispatch = useDispatch();
  const { broadcasterId, broadcasterLogin /* , errors */ } = useSelector(({ info }) => info);
  const { data: tokenData, error: tokenError, isLoading: isTokenLoading } = useValidateTokenQuery();
  const isAuthorized = !(tokenError && 'status' in tokenError && tokenError.status === 401);
  const isRenderable = !!(broadcasterId && broadcasterLogin);

  // Set broadcaster id if token data exists
  useEffect(() => {
    if (tokenData) dispatch(setInfo({ broadcasterId: tokenData.user_id, broadcasterLogin: tokenData.login }));
  }, [dispatch, tokenData]);

  // Set errors
  useEffect(() => {
    if (tokenError && 'status' in tokenError) dispatch(addError(tokenError));
  }, [dispatch, tokenError]);

  // Render nothing if data is loading or required data is incomplete
  if (!isTokenLoading && !isAuthorized) return <AuthenticationBar />;

  // Render nothing if data is loading or required data is incomplete
  if (isTokenLoading || !isRenderable) return false;

  // Render component
  return (
    <Fragment>
      <Outlet />
      {/* {errors.length ? errors.map((error, i) => <ErrorMessage key={i} error={error} />) : null} */}
    </Fragment>
  );
};
