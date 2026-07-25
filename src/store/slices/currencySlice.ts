import { createSlice } from '@reduxjs/toolkit'
import type { Currency } from '../../types'

export interface CurrencyState {
	currency: Currency
	animating: boolean
}

const initialState: CurrencyState = {
	currency: 'USD',
	animating: false,
}

// Currency toggle is a two-step affair: the fade-out animation starts
// immediately, and the actual currency switch is committed a bit later
// (see CURRENCY_TOGGLE_DELAY_MS) so the toggle has some visual weight
// instead of an instant jump. That's why this is two actions rather than one.
//
// toggleCommitted flips the currency based on whatever it currently is in
// the store (rather than a value passed in from the component) so rapid
// toggles can't race against a stale closure value.
const currencySlice = createSlice({
	name: 'currency',
	initialState,
	reducers: {
		toggleStarted(state) {
			state.animating = true
		},
		toggleCommitted(state) {
			state.currency = state.currency === 'USD' ? 'PLN' : 'USD'
			state.animating = false
		},
	},
})

export const { toggleStarted, toggleCommitted } = currencySlice.actions
export default currencySlice.reducer
