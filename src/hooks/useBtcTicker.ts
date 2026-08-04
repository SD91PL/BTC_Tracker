import { useMemo } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
	fetchBtcPrice,
	fetchRangeHistory,
	fetchUsdPlnRate,
	type BtcPricePoint,
	type HistorySource,
} from '../api/prices'
import { sampleEvenly } from '../utils/array'
import {
	RANGE_CONFIG,
	BTC_PRICE_REFETCH_INTERVAL_MS,
	BTC_PRICE_STALE_TIME_MS,
	USD_PLN_REFETCH_INTERVAL_MS,
	USD_PLN_STALE_TIME_MS,
} from '../constants'
import type { TimeRange } from '../types'

export interface BtcTicker {
	priceUSD: number | null
	hasBtc: boolean
	// % change over the selected range (e.g. 24h, 1w, ... max), not always 24h.
	changePercent: string | null
	isPositive: boolean
	hasChange: boolean
	usdPlnRate: number | null
	hasRate: boolean
	chartSeries: BtcPricePoint[] | null
	hasHistory: boolean
	isHistoryFetching: boolean
	// Which API actually served the current history — CoinGecko normally,
	// blockchain.info for 5Y/MAX (or as a backup if CoinGecko fails).
	historySource: HistorySource | null
	isError: boolean
	refetchAll: () => void
}

// Fetches current price, range-scoped history, and USD/PLN rate (all in raw USD).
// Currency formatting is handled by useCurrencyView.
export function useBtcTicker(range: TimeRange): BtcTicker {
	const rangeConfig = RANGE_CONFIG[range]

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
		data: historyResult,
		isError: historyIsError,
		isFetching: isHistoryFetching,
		refetch: refetchHistory,
	} = useQuery({
		// Each range is cached independently, so switching back to a
		// previously-viewed range is instant.
		queryKey: ['btc-price-history', range],
		queryFn: () =>
			fetchRangeHistory(
				rangeConfig.coinGeckoDays,
				rangeConfig.blockchainInfoTimespan,
			),
		refetchInterval: rangeConfig.refetchIntervalMs,
		staleTime: rangeConfig.staleTimeMs,
		// Keep showing the previous range's chart (instead of a blank/NA state)
		// while the new range loads in the background.
		placeholderData: keepPreviousData,
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
	const usdPlnRate = usdPlnRateData ?? null
	const rawHistory = historyResult?.points ?? null
	const historySource = historyResult?.source ?? null

	const hasBtc = priceUSD != null
	const hasRate = usdPlnRate != null

	// Downsample for the chart, then align the last point with the live
	// price (the history query can be a little stale by comparison).
	const chartSeries = useMemo<BtcPricePoint[] | null>(() => {
		if (!rawHistory || rawHistory.length === 0) return null
		const sampled = sampleEvenly(rawHistory, rangeConfig.chartPoints)
		if (!hasBtc) return sampled
		return [...sampled.slice(0, -1), { timestamp: Date.now(), price: priceUSD! }]
	}, [rawHistory, rangeConfig.chartPoints, hasBtc, priceUSD])

	const hasHistory = chartSeries != null && chartSeries.length > 0

	// % change across the whole selected range: first raw history point vs.
	// the live price. Computed the same way for every range (24h through
	// max), so the header number always matches what the chart is showing.
	const changePercentRaw = useMemo(() => {
		if (!rawHistory || rawHistory.length === 0 || !hasBtc) return null
		const startPrice = rawHistory[0].price
		if (!startPrice) return null
		return ((priceUSD! - startPrice) / startPrice) * 100
	}, [rawHistory, hasBtc, priceUSD])

	const hasChange = changePercentRaw != null
	const changePercent = hasChange ? changePercentRaw!.toFixed(2) : null
	const isPositive = hasChange && changePercentRaw! >= 0

	function refetchAll() {
		refetchBtc()
		refetchHistory()
		refetchRate()
	}

	return {
		priceUSD,
		hasBtc,
		changePercent,
		isPositive,
		hasChange,
		usdPlnRate,
		hasRate,
		chartSeries,
		hasHistory,
		isHistoryFetching,
		historySource,
		isError: btcIsError || historyIsError || rateIsError,
		refetchAll,
	}
}
