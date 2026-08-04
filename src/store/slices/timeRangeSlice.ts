import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { TimeRange } from '../../types'

export interface TimeRangeState {
	range: TimeRange
}

const initialState: TimeRangeState = {
	range: '1D',
}

const timeRangeSlice = createSlice({
	name: 'timeRange',
	initialState,
	reducers: {
		rangeChanged(state, action: PayloadAction<TimeRange>) {
			state.range = action.payload
		},
	},
})

export const { rangeChanged } = timeRangeSlice.actions
export default timeRangeSlice.reducer
