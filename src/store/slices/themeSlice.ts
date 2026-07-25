import { createSlice } from '@reduxjs/toolkit'

export type ThemeMode = 'light' | 'dark'

export interface ThemeState {
	mode: ThemeMode
}

// Dark is the app's original/default look, so it stays the initial state —
// this also has to match the CSS fallback in theme.css (:root, with no
// data-theme attribute set yet) so there's no flash of the wrong theme
// before the sync effect in App.tsx runs on first paint.
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
