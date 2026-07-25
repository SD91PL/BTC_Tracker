export const NA = 'N/A'

// Chart points shown for the 24h history.
export const CHART_POINTS = 48

// Current price: refetched often, it's the headline number.
export const BTC_PRICE_REFETCH_INTERVAL_MS = 30_000
export const BTC_PRICE_STALE_TIME_MS = 15_000

// 24h history: changes slowly, refetched less often.
export const BTC_HISTORY_REFETCH_INTERVAL_MS = 5 * 60_000
export const BTC_HISTORY_STALE_TIME_MS = 2 * 60_000

// USD/PLN rate: barely moves, hourly refetch is enough.
export const USD_PLN_REFETCH_INTERVAL_MS = 60 * 60_000
export const USD_PLN_STALE_TIME_MS = 30 * 60_000

// Price dim duration on currency toggle (also used as the fade transition time).
export const CURRENCY_TOGGLE_DELAY_MS = 150
