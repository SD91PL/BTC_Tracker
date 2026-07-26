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

// Fetches current price, 24h history, and USD/PLN rate (all in raw USD).
// Currency formatting is handled by useCurrencyView.
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

	// Null means unavailable — UI shows "N/A", never a guessed value.
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

	// Align chart's last point with current price (queries can be slightly out of sync).
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
