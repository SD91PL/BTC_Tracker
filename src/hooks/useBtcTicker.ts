import { useQuery } from '@tanstack/react-query'
import {
	fetchBtcPrice,
	fetchBtcPriceHistory,
	fetchUsdPlnRate,
	type BtcPricePoint,
} from '../api/prices'
import { sampleEvenly } from '../utils/array'
import {
	CHART_POINTS,
	BTC_PRICE_REFETCH_INTERVAL_MS,
	BTC_PRICE_STALE_TIME_MS,
	BTC_HISTORY_REFETCH_INTERVAL_MS,
	BTC_HISTORY_STALE_TIME_MS,
	USD_PLN_REFETCH_INTERVAL_MS,
	USD_PLN_STALE_TIME_MS,
} from '../constants'

export interface BtcTicker {
	priceUSD: number | null
	hasBtc: boolean
	change24h: string | null
	isPositive: boolean
	hasChange: boolean
	usdPlnRate: number | null
	hasRate: boolean
	chartSeries: BtcPricePoint[] | null
	hasHistory: boolean
	isError: boolean
	refetchAll: () => void
}

// Fetches and combines the three data sources the ticker needs: current
// price, 24h history (for the chart), and the USD/PLN exchange rate.
// Currency-specific formatting/derivation happens in useCurrencyView, not here —
// this hook only ever deals in raw USD values.
export function useBtcTicker(): BtcTicker {
	const {
		data: btcPriceData,
		isError: btcIsError,
		refetch: refetchBtc,
	} = useQuery({
		queryKey: ['btc-price'],
		queryFn: fetchBtcPrice,
		refetchInterval: BTC_PRICE_REFETCH_INTERVAL_MS,
		staleTime: BTC_PRICE_STALE_TIME_MS,
	})

	const {
		data: historyData,
		isError: historyIsError,
		refetch: refetchHistory,
	} = useQuery({
		queryKey: ['btc-price-history'],
		queryFn: fetchBtcPriceHistory,
		select: data => sampleEvenly(data, CHART_POINTS),
		refetchInterval: BTC_HISTORY_REFETCH_INTERVAL_MS,
		staleTime: BTC_HISTORY_STALE_TIME_MS,
	})

	const {
		data: usdPlnRateData,
		isError: rateIsError,
		refetch: refetchRate,
	} = useQuery({
		queryKey: ['usd-pln-rate'],
		queryFn: fetchUsdPlnRate,
		refetchInterval: USD_PLN_REFETCH_INTERVAL_MS,
		staleTime: USD_PLN_STALE_TIME_MS,
	})

	// No fallback numbers — each value is either the real fetched data, or null.
	// Anywhere null shows up in the UI it's rendered as "N/A", never a guessed number.
	const priceUSD = btcPriceData?.price ?? null
	const change24hRaw = btcPriceData?.change24h ?? null
	const usdPlnRate = usdPlnRateData ?? null
	const priceHistory = historyData ?? null

	const hasBtc = priceUSD != null
	const hasChange = change24hRaw != null
	const hasRate = usdPlnRate != null
	const hasHistory = priceHistory != null && priceHistory.length > 0

	const change24h = hasChange ? change24hRaw.toFixed(2) : null
	const isPositive = hasChange && change24hRaw >= 0

	// The history and the current-price queries are fetched separately, so
	// they can be a few seconds apart. Force the chart's last point to match
	// the actual current price so the two never visibly disagree.
	const chartSeries = hasHistory
		? hasBtc
			? [
					...priceHistory!.slice(0, -1),
					{ timestamp: Date.now(), price: priceUSD! },
				]
			: priceHistory!
		: null

	function refetchAll() {
		refetchBtc()
		refetchHistory()
		refetchRate()
	}

	return {
		priceUSD,
		hasBtc,
		change24h,
		isPositive,
		hasChange,
		usdPlnRate,
		hasRate,
		chartSeries,
		hasHistory,
		isError: btcIsError || historyIsError || rateIsError,
		refetchAll,
	}
}
