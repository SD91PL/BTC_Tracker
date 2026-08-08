import { configureStore } from '@reduxjs/toolkit'
import currencyReducer from './slices/currencySlice'
import themeReducer from './slices/themeSlice'
import timeRangeReducer from './slices/timeRangeSlice'
import resizeReducer from './slices/resizeSlice'

export const store = configureStore({
	reducer: {
		currency: currencyReducer,
		theme: themeReducer,
		timeRange: timeRangeReducer,
		resize: resizeReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
