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

// Two-step toggle: fade starts immediately, currency flips after delay
// (CURRENCY_TOGGLE_DELAY_MS). toggleCommitted reads current store value
// to avoid stale-closure races on rapid clicks.
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
