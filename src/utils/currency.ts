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

// Single entry point for "format this number as whichever currency is
// currently selected" — avoids currency === 'PLN' ? formatPLN : formatUSD
// being repeated at every call site.
export function formatCurrency(n: number, currency: Currency): string {
	return currency === 'PLN' ? formatPLN(n) : formatUSD(n)
}
