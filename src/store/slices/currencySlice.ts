import { createSlice } from '@reduxjs/toolkit'
import type { Currency } from '../../types'

export interface CurrencyState {
	currency: Currency
}

const initialState: CurrencyState = {
	currency: 'USD',
}

const currencySlice = createSlice({
	name: 'currency',
	initialState,
	reducers: {
		// Flips based on whatever the currency currently is in the store
		// (rather than a value passed in from the component) so rapid
		// toggles can't race against a stale closure value.
		currencyToggled(state) {
			state.currency = state.currency === 'USD' ? 'PLN' : 'USD'
		},
	},
})

export const { currencyToggled } = currencySlice.actions
export default currencySlice.reducer
