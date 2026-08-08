import type { TimeRange } from '../types'

// X-axis tick label; granularity matches the selected range.
export function formatAxisLabel(timestamp: number, range: TimeRange): string {
	const date = new Date(timestamp)

	switch (range) {
		case '1D':
			return date.toLocaleString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hourCycle: 'h23',
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
			// Years only — dense ranges where month-level ticks would be too crowded.
			return date.toLocaleString('en-US', { year: 'numeric' })
	}
}

// Fuller tooltip label with enough context to stand alone.
export function formatTooltipLabel(timestamp: number, range: TimeRange): string {
	const date = new Date(timestamp)

	switch (range) {
		case '1D':
			return date.toLocaleString('en-US', {
				day: '2-digit',
				month: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hourCycle: 'h23',
			})
		case '1W':
		case '1M':
			return date.toLocaleString('en-US', {
				weekday: 'short',
				day: '2-digit',
				month: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hourCycle: 'h23',
			})
		case '1Y':
			return date.toLocaleString('en-US', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
			})
		case '5Y':
		case 'MAX':
			return date.toLocaleString('en-US', {
				month: 'short',
				year: 'numeric',
			})
	}
}
