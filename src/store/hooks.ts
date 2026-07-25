import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './index'

// Typed versions of the plain `useDispatch` / `useSelector` hooks —
// use these throughout the app instead of the raw react-redux ones.
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
