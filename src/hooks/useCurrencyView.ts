import type { Currency, TimeRange } from '../types'
import type { BtcTicker } from './useBtcTicker'
import { formatCurrency, formatUSD, formatPLN } from '../utils/currency'
import { formatAxisLabel } from '../utils/datetime'
import { NA } from '../constants'

export interface ChartPoint {
	time: string
	price: number
	// Raw timestamp, kept alongside the formatted axis label so the
	// tooltip can render its own (fuller) date format.
	timestamp: number
}

export interface CurrencyView {
	pricePLN: number | null
	canShowPrice: boolean
	displayPrice: string
	secondaryLine: string
	canShowChart: boolean
	chartData: ChartPoint[]
}

// Derives currency-dependent UI values from raw ticker data.
export function useCurrencyView(
	ticker: BtcTicker,
	currency: Currency,
	range: TimeRange,
): CurrencyView {
	const { priceUSD, hasBtc, usdPlnRate, hasRate, chartSeries, hasHistory } =
		ticker

	const pricePLN =
		hasBtc && hasRate ? Math.round(priceUSD! * usdPlnRate!) : null

	// PLN needs the exchange rate; USD only needs the price.
	const canShowPrice = currency === 'USD' ? hasBtc : hasBtc && hasRate
	const displayPrice = canShowPrice
		? formatCurrency(currency === 'USD' ? priceUSD! : pricePLN!, currency)
		: NA

	const secondaryLine =
		currency === 'USD'
			? `≈ ${pricePLN != null ? formatPLN(pricePLN) : NA}`
			: `≈ ${hasBtc ? formatUSD(priceUSD!) : NA}`

	// PLN chart also needs the exchange rate.
	const canShowChart = hasHistory && (currency === 'USD' || hasRate)

	const chartData: ChartPoint[] = canShowChart
		? chartSeries!.map(d => ({
				time: formatAxisLabel(d.timestamp, range),
				price: currency === 'PLN' ? Math.round(d.price * usdPlnRate!) : d.price,
				timestamp: d.timestamp,
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
