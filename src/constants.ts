export const NA = 'N/A'

// Chart points for the 24h history.
export const CHART_POINTS = 48

// Current price: frequent refetch (headline number).
export const BTC_PRICE_REFETCH_INTERVAL_MS = 30_000
export const BTC_PRICE_STALE_TIME_MS = 15_000

// 24h history: slower-moving, less frequent refetch.
export const BTC_HISTORY_REFETCH_INTERVAL_MS = 5 * 60_000
export const BTC_HISTORY_STALE_TIME_MS = 2 * 60_000

// USD/PLN rate: nearly static, hourly refetch is enough.
export const USD_PLN_REFETCH_INTERVAL_MS = 60 * 60_000
export const USD_PLN_STALE_TIME_MS = 30 * 60_000

// Price fade duration on currency toggle.
export const CURRENCY_TOGGLE_DELAY_MS = 150
