import { useEffect } from 'react'
import { useBtcTicker } from '../hooks/useBtcTicker'
import { useCurrencyView } from '../hooks/useCurrencyView'
import { CardHeader } from './components/CardHeader'
import { PriceChart } from './components/PriceChart'
import { PriceDisplay } from './components/PriceDisplay'
import { CurrencyToggle } from './components/CurrencyToggle'
import { ExchangeRateFooter } from './components/ExchangeRateFooter'
import { ThemeToggle } from './components/ThemeToggle'
import { useAppSelector } from '../store/hooks'

export default function App() {
	const currency = useAppSelector(state => state.currency.currency)
	const themeMode = useAppSelector(state => state.theme.mode)

	const ticker = useBtcTicker()
	const view = useCurrencyView(ticker, currency)

	// Sync theme to data-theme attribute (colors live in theme.css).
	useEffect(() => {
		document.documentElement.setAttribute('data-theme', themeMode)
	}, [themeMode])

	return (
		<div
			className='min-h-screen w-full flex flex-col items-center justify-center gap-6 p-4'
			style={{
				background:
					'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(var(--color-mint-rgb), 0.1) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(var(--color-indigo-rgb), 0.08) 0%, transparent 55%), rgb(var(--color-bg-rgb))',
				fontFamily: "'Outfit', sans-serif",
				transition: 'background 0.4s ease',
			}}>
			{/* Gradient border */}
			<div
				className='relative w-full max-w-sm'
				style={{
					borderRadius: '20px',
					padding: '1px',
					background:
						'linear-gradient(135deg, rgba(var(--color-mint-rgb), 0.5) 0%, rgba(var(--color-indigo-rgb), 0.2) 40%, rgba(var(--color-mint-rgb), 0.1) 100%)',
				}}>
				{/* Glass card */}
				<div
					className='relative w-full flex flex-col overflow-hidden'
					style={{
						borderRadius: '19px',
						background: 'rgba(var(--color-bg-elevated-rgb), 0.75)',
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
					/>

					<PriceDisplay
						displayPrice={view.displayPrice}
						canShowPrice={view.canShowPrice}
						secondaryLine={view.secondaryLine}
						isError={ticker.isError}
						onRetry={ticker.refetchAll}
					/>

					{/* Divider */}
					<div
						className='mx-6 h-px'
						style={{
							background:
								'linear-gradient(90deg, transparent, rgba(var(--color-mint-rgb), 0.2), transparent)',
						}}
					/>

					<CurrencyToggle />

					<ExchangeRateFooter
						hasRate={ticker.hasRate}
						usdPlnRate={ticker.usdPlnRate}
					/>
				</div>
			</div>

			<ThemeToggle />
		</div>
	)
}
