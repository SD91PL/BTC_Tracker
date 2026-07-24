export const NA = 'N/A'

// Number of chart points shown for the 24h history — a display decision,
// so it lives with the other UI constants, not inside the fetch layer.
export const CHART_POINTS = 48

// Current price: refetched often since it's the headline number.
export const BTC_PRICE_REFETCH_INTERVAL_MS = 30_000
export const BTC_PRICE_STALE_TIME_MS = 15_000

// 24h history for the chart: changes little minute-to-minute, so it's
// refetched much less often than the current price.
export const BTC_HISTORY_REFETCH_INTERVAL_MS = 5 * 60_000
export const BTC_HISTORY_STALE_TIME_MS = 2 * 60_000

// USD/PLN exchange rate: moves the least of all three, so an hourly
// refetch is more than enough.
export const USD_PLN_REFETCH_INTERVAL_MS = 60 * 60_000
export const USD_PLN_STALE_TIME_MS = 30 * 60_000
