export interface BtcPriceData {
	price: number
	source: HistorySource
}

export interface BtcPricePoint {
	timestamp: number
	price: number
}

export type HistorySource = 'coingecko' | 'blockchain.info'

export interface BtcHistoryResult {
	points: BtcPricePoint[]
	source: HistorySource
}

async function fetchBtcPriceFromCoinGecko(): Promise<number> {
	const res = await fetch(
		'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
	)
	if (!res.ok) throw new Error('Failed to fetch BTC price')
	const data = await res.json()
	return data.bitcoin.usd as number
}

// Also serves as a backup source for the current price.
async function fetchBtcPriceFromBlockchainInfo(): Promise<number> {
	const res = await fetch('https://api.blockchain.info/stats?format=json&cors=true')
	if (!res.ok) throw new Error('Failed to fetch BTC price (fallback)')
	const data = await res.json()
	return data.market_price_usd as number
}

// Current BTC price; % change is derived elsewhere from history.
export async function fetchBtcPrice(): Promise<BtcPriceData> {
	try {
		const price = await fetchBtcPriceFromCoinGecko()
		return { price, source: 'coingecko' }
	} catch {
		const price = await fetchBtcPriceFromBlockchainInfo()
		return { price, source: 'blockchain.info' }
	}
}

// Raw history for a range; downsampling is the caller's job.
async function fetchBtcPriceHistoryFromCoinGecko(
	days: string,
): Promise<BtcPricePoint[]> {
	const res = await fetch(
		`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`,
	)
	if (!res.ok) throw new Error('Failed to fetch BTC price history')
	const data = await res.json()
	const rawPoints: [number, number][] = data.prices

	return rawPoints.map(([timestamp, price]) => ({
		timestamp,
		price: Math.round(price),
	}))
}

// Free keyless API; covers 5Y/MAX and backs up CoinGecko.
// Docs: https://www.blockchain.com/api/charts_api
async function fetchBtcPriceHistoryFromBlockchainInfo(
	timespan: string,
): Promise<BtcPricePoint[]> {
	const res = await fetch(
		`https://api.blockchain.info/charts/market-price?timespan=${timespan}&format=json&cors=true`,
	)
	if (!res.ok) throw new Error('Failed to fetch BTC price history (fallback)')
	const data = await res.json()
	const rawPoints: { x: number; y: number }[] = data.values

	return rawPoints.map(({ x, y }) => ({
		// blockchain.info uses unix seconds; the rest of the app uses ms.
		timestamp: x * 1000,
		price: Math.round(y),
	}))
}

// CoinGecko first, falls back to blockchain.info if needed.
// Ranges without a fallback (1D/1W) rethrow the CoinGecko error.
export async function fetchRangeHistory(
	coinGeckoDays: string | null,
	blockchainInfoTimespan: string | null,
): Promise<BtcHistoryResult> {
	if (coinGeckoDays) {
		try {
			const points = await fetchBtcPriceHistoryFromCoinGecko(coinGeckoDays)
			return { points, source: 'coingecko' }
		} catch (err) {
			if (!blockchainInfoTimespan) throw err
			// Otherwise fall through to the backup source below.
		}
	}

	if (!blockchainInfoTimespan) {
		throw new Error('No history source available for this range')
	}

	const points = await fetchBtcPriceHistoryFromBlockchainInfo(
		blockchainInfoTimespan,
	)
	return { points, source: 'blockchain.info' }
}

// Current USD/PLN rate.
export async function fetchUsdPlnRate(): Promise<number> {
	const res = await fetch('https://open.er-api.com/v6/latest/USD')
	if (!res.ok) throw new Error('Failed to fetch USD/PLN rate')
	const data = await res.json()
	return data.rates.PLN as number
}
