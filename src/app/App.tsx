import { useState } from 'react'
import type { Currency } from '../types'
import { useBtcTicker } from '../hooks/useBtcTicker'
import { useCurrencyView } from '../hooks/useCurrencyView'
import { CardHeader } from './components/CardHeader'
import { PriceChart } from './components/PriceChart'
import { PriceDisplay } from './components/PriceDisplay'
import { CurrencyToggle } from './components/CurrencyToggle'
import { ExchangeRateFooter } from './components/ExchangeRateFooter'

// How long the price fades out before the currency actually switches —
// gives the toggle a bit of visual weight instead of an instant jump.
const CURRENCY_TOGGLE_DELAY_MS = 150

export default function App() {
	const [currency, setCurrency] = useState<Currency>('USD')
	const [animating, setAnimating] = useState(false)

	const ticker = useBtcTicker()
	const view = useCurrencyView(ticker, currency)

	function handleToggle() {
		setAnimating(true)
		setTimeout(() => {
			setCurrency(c => (c === 'USD' ? 'PLN' : 'USD'))
			setAnimating(false)
		}, CURRENCY_TOGGLE_DELAY_MS)
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
					<CardHeader
						hasChange={ticker.hasChange}
						isPositive={ticker.isPositive}
						change24h={ticker.change24h}
					/>

					<PriceChart
						chartData={view.chartData}
						canShowChart={view.canShowChart}
						currency={currency}
					/>

					<PriceDisplay
						displayPrice={view.displayPrice}
						canShowPrice={view.canShowPrice}
						secondaryLine={view.secondaryLine}
						animating={animating}
						isError={ticker.isError}
						onRetry={ticker.refetchAll}
					/>

					{/* Divider */}
					<div
						className='mx-6 h-px'
						style={{
							background:
								'linear-gradient(90deg, transparent, rgba(79,255,176,0.2), transparent)',
						}}
					/>

					<CurrencyToggle
						currency={currency}
						onToggle={handleToggle}
					/>

					<ExchangeRateFooter
						hasRate={ticker.hasRate}
						usdPlnRate={ticker.usdPlnRate}
					/>
				</div>
			</div>
		</div>
	)
}
