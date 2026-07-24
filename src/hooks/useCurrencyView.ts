import type { Currency } from '../types'
import type { BtcTicker } from './useBtcTicker'
import { formatCurrency, formatUSD, formatPLN } from '../utils/currency'
import { formatDateTime } from '../utils/datetime'
import { NA } from '../constants'

export interface ChartPoint {
	time: string
	price: number
}

export interface CurrencyView {
	pricePLN: number | null
	canShowPrice: boolean
	displayPrice: string
	secondaryLine: string
	canShowChart: boolean
	chartData: ChartPoint[]
}

// Derives everything the UI needs that depends on which currency (USD/PLN)
// is currently selected. Kept separate from useBtcTicker so the raw data
// fetching stays currency-agnostic and easy to reason about on its own.
export function useCurrencyView(
	ticker: BtcTicker,
	currency: Currency,
): CurrencyView {
	const { priceUSD, hasBtc, usdPlnRate, hasRate, chartSeries, hasHistory } =
		ticker

	const pricePLN =
		hasBtc && hasRate ? Math.round(priceUSD! * usdPlnRate!) : null

	// PLN view additionally needs the exchange rate, USD view only needs the price itself
	const canShowPrice = currency === 'USD' ? hasBtc : hasBtc && hasRate
	const displayPrice = canShowPrice
		? formatCurrency(currency === 'USD' ? priceUSD! : pricePLN!, currency)
		: NA

	const secondaryLine =
		currency === 'USD'
			? `≈ ${pricePLN != null ? formatPLN(pricePLN) : NA}`
			: `≈ ${hasBtc ? formatUSD(priceUSD!) : NA}`

	// PLN view of the chart additionally needs the exchange rate
	const canShowChart = hasHistory && (currency === 'USD' || hasRate)

	const chartData: ChartPoint[] = canShowChart
		? chartSeries!.map(d => ({
				time: formatDateTime(d.timestamp),
				price: currency === 'PLN' ? Math.round(d.price * usdPlnRate!) : d.price,
			}))
		: []

	return {
		pricePLN,
		canShowPrice,
		displayPrice,
		secondaryLine,
		canShowChart,
		chartData,
	}
}
