export interface BtcPriceData {
	price: number
	change24h: number
}

export interface BtcPricePoint {
	timestamp: number
	price: number
}

// Fetches the current BTC price
// Real 24h % change comes from CoinGecko directly, not calculated by us
export async function fetchBtcPrice(): Promise<BtcPriceData> {
	const res = await fetch(
		'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true',
	)
	if (!res.ok) throw new Error('Failed to fetch BTC price')
	const data = await res.json()
	return {
		price: data.bitcoin.usd as number,
		change24h: data.bitcoin.usd_24h_change as number,
	}
}

// Fetches the BTC price history for the last 24 hours
// Returns the full, raw series — downsampling/formatting is the caller's job
export async function fetchBtcPriceHistory(): Promise<BtcPricePoint[]> {
	const res = await fetch(
		'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1',
	)
	if (!res.ok) throw new Error('Failed to fetch BTC price history')
	const data = await res.json()
	const rawPoints: [number, number][] = data.prices

	return rawPoints.map(([timestamp, price]) => ({
		timestamp,
		price: Math.round(price),
	}))
}

// Fetches the current USD/PLN rate
export async function fetchUsdPlnRate(): Promise<number> {
	const res = await fetch('https://open.er-api.com/v6/latest/USD')
	if (!res.ok) throw new Error('Failed to fetch USD/PLN rate')
	const data = await res.json()
	return data.rates.PLN as number
}
