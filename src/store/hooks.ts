import type { RootState, AppDispatch } from '@store/index'

import { useDispatch as useDispatchUntyped, useSelector as useSelectorUntyped } from 'react-redux';

export const useDispatch = useDispatchUntyped.withTypes<AppDispatch>()
export const useSelector = useSelectorUntyped.withTypes<RootState>()