import type { TimeRange } from '../types'

// Short label for chart X-axis ticks — granularity matches the selected range
// so labels stay meaningful without crowding the axis (e.g. hours for 1D,
// weekday for 1W, month for 1Y+).
export function formatAxisLabel(timestamp: number, range: TimeRange): string {
	const date = new Date(timestamp)

	switch (range) {
		case '1D':
			return date.toLocaleString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
			})
		case '1W':
			return date.toLocaleString('en-US', { weekday: 'short' })
		case '1M':
			return date.toLocaleString('en-US', {
				day: '2-digit',
				month: '2-digit',
			})
		case '1Y':
			return date.toLocaleString('en-US', { month: 'short' })
		case '5Y':
		case 'MAX':
			return date.toLocaleString('en-US', {
				month: 'short',
				year: '2-digit',
			})
	}
}

// Fuller label for the tooltip — always includes enough context to be
// unambiguous on its own (unlike the terser axis label).
export function formatTooltipLabel(timestamp: number, range: TimeRange): string {
	const date = new Date(timestamp)

	switch (range) {
		case '1D':
			return date.toLocaleString('en-US', {
				day: '2-digit',
				month: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
			})
		case '1W':
		case '1M':
			return date.toLocaleString('en-US', {
				weekday: 'short',
				day: '2-digit',
				month: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
			})
		case '1Y':
			return date.toLocaleString('en-US', {
				day: '2-digit',
				month: 'long',
				year: 'numeric',
			})
		case '5Y':
		case 'MAX':
			return date.toLocaleString('en-US', {
				month: 'long',
				year: 'numeric',
			})
	}
}
