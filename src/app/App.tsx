import { useState } from 'react'
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'
import { useQuery } from '@tanstack/react-query'
import {
	fetchBtcPrice,
	fetchBtcPriceHistory,
	fetchUsdPlnRate,
} from './api/prices'

const NA = 'N/A'

// Number of chart points shown for the 24h history — a display decision,
// so it's defined here in the component, not inside the fetch layer
const CHART_POINTS = 48

function formatUSD(n: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(n)
}

function formatPLN(n: number) {
	return new Intl.NumberFormat('pl-PL', {
		style: 'currency',
		currency: 'PLN',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(n)
}

// Formats a raw timestamp into an "HH:mm" label for the chart's X axis —
// display-level formatting stays here, not in the data-fetching layer
function formatTime(timestamp: number) {
	return new Date(timestamp).toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	})
}

// Reduces an array to ~targetPoints evenly spaced items. Pure and synchronous —
// no fetching involved, so it's easy to test on its own and reusable for any
// series, not just BTC price history.
function sampleEvenly<T>(items: T[], targetPoints: number): T[] {
	const step = Math.max(1, Math.floor(items.length / targetPoints))
	return items.filter((_, i) => i % step === 0)
}

const CustomTooltip = ({
	active,
	payload,
	currency,
}: {
	active?: boolean
	payload?: { value: number }[]
	currency: 'USD' | 'PLN'
}) => {
	if (active && payload && payload.length) {
		// payload values are already converted to the selected currency
		// by chartData below — no conversion needed here
		const val =
			currency === 'PLN'
				? formatPLN(payload[0].value)
				: formatUSD(payload[0].value)
		return (
			<div
				style={{
					background: 'rgba(8, 11, 20, 0.85)',
					border: '1px solid rgba(247, 147, 26, 0.3)',
					backdropFilter: 'blur(12px)',
				}}
				className='px-3 py-2 rounded-lg'>
				<p
					style={{ fontFamily: "'DM Mono', monospace" }}
					className='text-xs text-[#4fffb0]'>
					{val}
				</p>
			</div>
		)
	}
	return null
}

export default function App() {
	const [currency, setCurrency] = useState<'USD' | 'PLN'>('USD')
	const [animating, setAnimating] = useState(false)

	// Current price + real 24h % change (as computed by CoinGecko) — refetched every 30s
	const {
		data: btcPriceData,
		isError: btcIsError,
		refetch: refetchBtc,
	} = useQuery({
		queryKey: ['btc-price'],
		queryFn: fetchBtcPrice,
		refetchInterval: 30_000,
		staleTime: 15_000,
	})

	// Real last-24h price history for the chart — refetched every 5 minutes
	const {
		data: historyData,
		isError: historyIsError,
		refetch: refetchHistory,
	} = useQuery({
		queryKey: ['btc-price-history'],
		queryFn: fetchBtcPriceHistory,
		select: data => sampleEvenly(data, CHART_POINTS),
		refetchInterval: 5 * 60_000,
		staleTime: 2 * 60_000,
	})

	// USD/PLN rate — exchange rates move less often, so refetch hourly
	const {
		data: usdPlnRateData,
		isError: rateIsError,
		refetch: refetchRate,
	} = useQuery({
		queryKey: ['usd-pln-rate'],
		queryFn: fetchUsdPlnRate,
		refetchInterval: 60 * 60_000,
		staleTime: 30 * 60_000,
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
	const isError = btcIsError || rateIsError || historyIsError

	const change24h = hasChange ? change24hRaw.toFixed(2) : null
	const isPositive = hasChange && change24hRaw >= 0

	const pricePLN = hasBtc && hasRate ? Math.round(priceUSD * usdPlnRate) : null

	// PLN view additionally needs the exchange rate, USD view only needs the price itself
	const canShowPrice = currency === 'USD' ? hasBtc : hasBtc && hasRate
	const displayPrice = canShowPrice
		? currency === 'USD'
			? formatUSD(priceUSD!)
			: formatPLN(pricePLN!)
		: NA

	// PLN view of the chart additionally needs the exchange rate
	const canShowChart = hasHistory && (currency === 'USD' || hasRate)

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

	const chartData = canShowChart
		? chartSeries!.map(d => ({
				time: formatTime(d.timestamp),
				price: currency === 'PLN' ? Math.round(d.price * usdPlnRate!) : d.price,
			}))
		: []

	function handleToggle() {
		setAnimating(true)
		setTimeout(() => {
			setCurrency(c => (c === 'USD' ? 'PLN' : 'USD'))
			setAnimating(false)
		}, 150)
	}

	function handleRetry() {
		refetchBtc()
		refetchHistory()
		refetchRate()
	}

	return (
		<div
			className='min-h-screen w-full flex items-center justify-center p-4'
			style={{
				background:
					'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(79,255,176,0.1) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(99,102,241,0.08) 0%, transparent 55%), #080b14',
				fontFamily: "'Outfit', sans-serif",
			}}>
			{/* Outer gradient border wrapper */}
			<div
				className='relative w-full max-w-sm'
				style={{
					borderRadius: '20px',
					padding: '1px',
					background:
						'linear-gradient(135deg, rgba(79,255,176,0.5) 0%, rgba(99,102,241,0.2) 40%, rgba(79,255,176,0.1) 100%)',
				}}>
				{/* Glass card */}
				<div
					className='relative w-full flex flex-col overflow-hidden'
					style={{
						borderRadius: '19px',
						background: 'rgba(10, 13, 24, 0.75)',
						backdropFilter: 'blur(24px)',
						WebkitBackdropFilter: 'blur(24px)',
					}}>
					{/* Header */}
					<div className='flex items-center justify-between px-6 pt-6 pb-4'>
						<div className='flex items-center gap-2.5'>
							<div
								className='w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold'
								style={{
									background: 'linear-gradient(135deg, #4fffb0, #00e896)',
									color: '#080b14',
									fontFamily: "'DM Mono', monospace",
								}}>
								₿
							</div>
							<div>
								<p
									className='text-sm font-semibold tracking-wide'
									style={{ color: '#e8eaf2' }}>
									Bitcoin
								</p>
								<p
									className='text-xs'
									style={{
										color: '#6b7280',
										fontFamily: "'DM Mono', monospace",
									}}>
									BTC
								</p>
							</div>
						</div>
						<div className='text-right'>
							<p
								className='text-xs mb-0.5'
								style={{
									color: '#6b7280',
									fontFamily: "'DM Mono', monospace",
								}}>
								24h
							</p>
							<p
								className='text-sm font-medium'
								style={{
									color: !hasChange
										? '#6b7280'
										: isPositive
											? '#22c55e'
											: '#ef4444',
									fontFamily: "'DM Mono', monospace",
								}}>
								{hasChange ? `${isPositive ? '+' : ''}${change24h}%` : NA}
							</p>
						</div>
					</div>

					{/* Chart */}
					<div className='w-full h-40 px-0 relative'>
						{!canShowChart && (
							<div className='absolute inset-0 flex items-center justify-center'>
								<p
									className='text-xs'
									style={{
										color: '#6b7280',
										fontFamily: "'DM Mono', monospace",
									}}>
									{NA}
								</p>
							</div>
						)}
						<ResponsiveContainer
							width='100%'
							height='100%'>
							<AreaChart
								data={chartData}
								margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
								<defs>
									<linearGradient
										id='btcGrad'
										x1='0'
										y1='0'
										x2='0'
										y2='1'>
										<stop
											offset='0%'
											stopColor='#4fffb0'
											stopOpacity={0.35}
										/>
										<stop
											offset='100%'
											stopColor='#4fffb0'
											stopOpacity={0.0}
										/>
									</linearGradient>
								</defs>
								<XAxis
									dataKey='time'
									hide
								/>
								<YAxis
									domain={['auto', 'auto']}
									hide
								/>
								<Tooltip
									content={<CustomTooltip currency={currency} />}
									cursor={{
										stroke: 'rgba(79,255,176,0.3)',
										strokeWidth: 1,
										strokeDasharray: '4 4',
									}}
								/>
								<Area
									type='monotone'
									dataKey='price'
									stroke='#4fffb0'
									strokeWidth={1.5}
									fill='url(#btcGrad)'
									dot={false}
									activeDot={{ r: 4, fill: '#4fffb0', strokeWidth: 0 }}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>

					{/* Price display */}
					<div className='px-6 py-5 text-center'>
						<p
							className='text-xs uppercase tracking-widest mb-2'
							style={{ color: '#6b7280', fontFamily: "'DM Mono', monospace" }}>
							Current price
						</p>

						{/* Gradient border on price block */}
						<div
							className='relative inline-block'
							style={{
								borderRadius: '12px',
								padding: '1px',
								background:
									'linear-gradient(135deg, rgba(79,255,176,0.4), rgba(99,102,241,0.15), rgba(79,255,176,0.1))',
							}}>
							<div
								className='px-6 py-3'
								style={{
									borderRadius: '11px',
									background: 'rgba(79,255,176,0.06)',
								}}>
								<p
									className='text-3xl font-semibold tracking-tight transition-opacity duration-150'
									style={{
										fontFamily: "'DM Mono', monospace",
										color: canShowPrice ? '#4fffb0' : '#6b7280',
										opacity: animating ? 0.4 : 1,
										letterSpacing: '-0.02em',
									}}>
									{displayPrice}
								</p>
							</div>
						</div>

						<p
							className='text-xs mt-2'
							style={{ color: '#6b7280', fontFamily: "'DM Mono', monospace" }}>
							{currency === 'USD'
								? `≈ ${pricePLN != null ? formatPLN(pricePLN) : NA}`
								: `≈ ${hasBtc ? formatUSD(priceUSD) : NA}`}
						</p>

						{isError && (
							<button
								onClick={handleRetry}
								className='mt-3 text-xs underline cursor-pointer'
								style={{
									color: '#ef4444',
									fontFamily: "'DM Mono', monospace",
								}}>
								Couldn't load data · Retry
							</button>
						)}
					</div>

					{/* Divider */}
					<div
						className='mx-6 h-px'
						style={{
							background:
								'linear-gradient(90deg, transparent, rgba(79,255,176,0.2), transparent)',
						}}
					/>

					{/* Toggle button */}
					<div className='px-6 py-5'>
						<button
							onClick={handleToggle}
							className='w-full relative group cursor-pointer'
							style={{
								borderRadius: '12px',
								padding: '1px',
								background:
									currency === 'USD'
										? 'linear-gradient(135deg, rgba(79,255,176,0.6), rgba(251,191,36,0.2))'
										: 'linear-gradient(135deg, rgba(99,102,241,0.6), rgba(139,92,246,0.2))',
								transition: 'background 0.4s ease',
							}}>
							<div
								className='w-full flex items-center justify-between px-5 py-3.5 transition-colors duration-300'
								style={{
									borderRadius: '11px',
									background: 'rgba(8, 11, 20, 0.6)',
									backdropFilter: 'blur(8px)',
								}}>
								{/* USD pill */}
								<div className='flex items-center gap-2'>
									<div
										className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300'
										style={{
											background:
												currency === 'USD'
													? 'linear-gradient(135deg, #4fffb0, #00e896)'
													: 'rgba(255,255,255,0.08)',
											color: currency === 'USD' ? '#080b14' : '#6b7280',
											fontFamily: "'DM Mono', monospace",
										}}>
										$
									</div>
									<span
										className='text-sm font-medium transition-colors duration-300'
										style={{
											color: currency === 'USD' ? '#4fffb0' : '#6b7280',
											fontFamily: "'DM Mono', monospace",
										}}>
										USD
									</span>
								</div>

								{/* Swap icon */}
								<svg
									width='16'
									height='16'
									viewBox='0 0 16 16'
									fill='none'
									style={{ color: '#6b7280' }}>
									<path
										d='M3 5l3-3 3 3M6 2v8M13 11l-3 3-3-3M10 14V6'
										stroke='currentColor'
										strokeWidth='1.5'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>

								{/* PLN pill */}
								<div className='flex items-center gap-2'>
									<span
										className='text-sm font-medium transition-colors duration-300'
										style={{
											color: currency === 'PLN' ? '#818cf8' : '#6b7280',
											fontFamily: "'DM Mono', monospace",
										}}>
										PLN
									</span>
									<div
										className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300'
										style={{
											background:
												currency === 'PLN'
													? 'linear-gradient(135deg, #6366f1, #818cf8)'
													: 'rgba(255,255,255,0.08)',
											color: currency === 'PLN' ? '#ffffff' : '#6b7280',
											fontFamily: "'DM Mono', monospace",
										}}>
										zł
									</div>
								</div>
							</div>
						</button>
					</div>

					{/* Footer */}
					<div className='px-6 pb-5 text-center'>
						<p
							className='text-xs'
							style={{ color: '#374151', fontFamily: "'DM Mono', monospace" }}>
							1 USD = {hasRate ? usdPlnRate.toFixed(2) : NA} PLN
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
