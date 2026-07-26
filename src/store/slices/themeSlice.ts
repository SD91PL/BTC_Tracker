import { createSlice } from '@reduxjs/toolkit'

export type ThemeMode = 'light' | 'dark'

export interface ThemeState {
	mode: ThemeMode
}

// Dark is the default; matches CSS fallback in theme.css to avoid FOUC.
const initialState: ThemeState = {
	mode: 'dark',
}

const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		themeToggled(state) {
			state.mode = state.mode === 'dark' ? 'light' : 'dark'
		},
	},
})

export const { themeToggled } = themeSlice.actions
export default themeSlice.reducer
