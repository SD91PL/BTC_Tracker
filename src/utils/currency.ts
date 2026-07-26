import type { Currency } from '../types'

export function formatUSD(n: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(n)
}

export function formatPLN(n: number): string {
	return new Intl.NumberFormat('pl-PL', {
		style: 'currency',
		currency: 'PLN',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(n)
}

// Format a number in the currently selected currency.
export function formatCurrency(n: number, currency: Currency): string {
	return currency === 'PLN' ? formatPLN(n) : formatUSD(n)
}
