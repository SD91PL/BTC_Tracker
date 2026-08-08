import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { appReset } from '../actions'

export interface ResizeState {
	locked: boolean
	// User-set width in px, or null for the default footprint. Lives in
	// Redux so reset can restore it along with everything else.
	width: number | null
}

// Locked by default so the layout stays put until the user opts in.
const initialState: ResizeState = {
	locked: true,
	width: null,
}

const resizeSlice = createSlice({
	name: 'resize',
	initialState,
	reducers: {
		resizeLockToggled(state) {
			state.locked = !state.locked
		},
		widthChanged(state, action: PayloadAction<number | null>) {
			state.width = action.payload
		},
	},
	extraReducers: builder => {
		builder.addCase(appReset, () => initialState)
	},
})

export const { resizeLockToggled, widthChanged } = resizeSlice.actions
export default resizeSlice.reducer
