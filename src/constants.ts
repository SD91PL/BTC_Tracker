import type { TimeRange } from './types'

// UI

// Resizable card bounds — shared by useResizableBox and ResizableWrapper
// so both use the same source instead of duplicated literals.
export const CARD_MIN_WIDTH_PX = 326
export const CARD_MAX_WIDTH_RATIO = 0.99

// DATA MANAGEMENT

export const NA = 'N/A'

// Current price: frequent refetch (headline number).
export const BTC_PRICE_REFETCH_INTERVAL_MS = 30_000
export const BTC_PRICE_STALE_TIME_MS = 15_000

// Ordered chart time ranges (toggler order, shortest to longest).
export const TIME_RANGES: TimeRange[] = ['1D', '1W', '1M', '1Y', '5Y', 'MAX']

export interface RangeConfig {
	// Compact label shown in the range picker (e.g. '24h', '1w').
	headerLabel: string
	// CoinGecko `days` param. Null for 5Y/MAX (free plan caps at 365 days).
	coinGeckoDays: string | null
	// blockchain.info `timespan` param: primary when coinGeckoDays is null,
	// fallback otherwise. Null for 1D/1W (resolution too coarse there).
	blockchainInfoTimespan: string | null
	// Target point count after downsampling (chart stays readable at any range).
	chartPoints: number
	refetchIntervalMs: number
	staleTimeMs: number
}

// Per-range history fetch + downsampling config.
// CoinGecko auto-granularity: 1 day -> 5-min, 2-90 days -> hourly, above -> daily.
export const RANGE_CONFIG: Record<TimeRange, RangeConfig> = {
	'1D': {
		headerLabel: '24h',
		coinGeckoDays: '1',
		blockchainInfoTimespan: null,
		chartPoints: 96,
		refetchIntervalMs: 60_000,
		staleTimeMs: 30_000,
	},
	'1W': {
		headerLabel: '1w',
		coinGeckoDays: '7',
		blockchainInfoTimespan: null,
		chartPoints: 84,
		refetchIntervalMs: 5 * 60_000,
		staleTimeMs: 2 * 60_000,
	},
	'1M': {
		headerLabel: '1m',
		coinGeckoDays: '30',
		blockchainInfoTimespan: '60days',
		chartPoints: 90,
		refetchIntervalMs: 15 * 60_000,
		staleTimeMs: 5 * 60_000,
	},
	'1Y': {
		headerLabel: '1y',
		coinGeckoDays: '365',
		blockchainInfoTimespan: '2years',
		chartPoints: 90,
		refetchIntervalMs: 60 * 60_000,
		staleTimeMs: 30 * 60_000,
	},
	'5Y': {
		headerLabel: '5y',
		coinGeckoDays: null,
		blockchainInfoTimespan: '5years',
		chartPoints: 120,
		refetchIntervalMs: 60 * 60_000,
		staleTimeMs: 30 * 60_000,
	},
	MAX: {
		headerLabel: 'Max',
		coinGeckoDays: null,
		blockchainInfoTimespan: 'all',
		chartPoints: 150,
		refetchIntervalMs: 60 * 60_000,
		staleTimeMs: 30 * 60_000,
	},
}

// USD/PLN rate: nearly static, hourly refetch is enough.
export const USD_PLN_REFETCH_INTERVAL_MS = 60 * 60_000
export const USD_PLN_STALE_TIME_MS = 30 * 60_000

// Price fade duration on currency toggle.
export const CURRENCY_TOGGLE_DELAY_MS = 150
