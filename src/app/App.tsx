import { useCallback, useEffect, useState } from 'react'
import { useBtcTicker } from '../hooks/useBtcTicker'
import { useCurrencyView } from '../hooks/useCurrencyView'
import { CardHeader } from './components/CardHeader'
import { PriceChart } from './components/PriceChart'
import { PriceDisplay } from './components/PriceDisplay'
import { CurrencyToggle } from './components/CurrencyToggle'
import { ExchangeRateFooter } from './components/ExchangeRateFooter'
import { ThemeToggle } from './components/ThemeToggle'
import { ResizeToggle } from './components/ResizeToggle'
import { ResetButton } from './components/ResetButton'
import { ResizableWrapper } from './components/ResizableWrapper'
import { IntroSplash } from './components/IntroSplash'
import { useAppSelector } from '../store/hooks'
import MobileFooter from './components/MobileFooter'

export default function App() {
	// Reduced motion: skip intro entirely.
	const [showIntro, setShowIntro] = useState(
		() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
	)

	const currency = useAppSelector(state => state.currency.currency)
	const themeMode = useAppSelector(state => state.theme.mode)
	const timeRange = useAppSelector(state => state.timeRange.range)

	// Rendered card width in px, kept in sync by ResizableWrapper.
	const [cardWidth, setCardWidth] = useState(384)
	const handleCardWidthChange = useCallback((width: number) => setCardWidth(width), [])

	// True during an active drag/pinch resize; suppresses chart animation.
	const [isCardResizing, setIsCardResizing] = useState(false)
	const handleCardResizingChange = useCallback((resizing: boolean) => setIsCardResizing(resizing), [])

	const ticker = useBtcTicker(timeRange, cardWidth)
	const view = useCurrencyView(ticker, currency, timeRange)

	// Sync theme to data-theme attribute (colors live in theme.css).
	useEffect(() => {
		document.documentElement.setAttribute('data-theme', themeMode)
	}, [themeMode])

	return (
		<>
			{showIntro && <IntroSplash onFinish={() => setShowIntro(false)} />}
			<div
				className='min-h-screen w-full flex flex-col items-center justify-center gap-6 p-4'
				style={{
					background:
						'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(var(--color-mint-rgb), 0.1) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(var(--color-indigo-rgb), 0.08) 0%, transparent 55%), rgb(var(--color-bg-rgb))',
					fontFamily: "'Outfit', sans-serif",
					transition: 'background 0.4s ease',
				}}>
				<ResizableWrapper
					onWidthChange={handleCardWidthChange}
					onResizingChange={handleCardResizingChange}>
					{/* Gradient border */}
					<div
						className='relative w-full h-full puff-in-bottom'
						style={{
							borderRadius: '1.25rem',
							padding: '0.0625rem',
							background:
								'linear-gradient(135deg, rgba(var(--color-mint-rgb), 0.5) 0%, rgba(var(--color-indigo-rgb), 0.2) 40%, rgba(var(--color-mint-rgb), 0.1) 100%)',
						}}>
						{/* Glass card */}
						<div
							className='relative w-full h-full flex flex-col overflow-hidden'
							style={{
								borderRadius: '1.1875rem',
								background: 'rgba(var(--color-bg-elevated-rgb), 0.75)',
								backdropFilter: 'blur(1.5rem)',
								WebkitBackdropFilter: 'blur(1.5rem)',
							}}>
							<CardHeader
								hasChange={ticker.hasChange}
								isPositive={ticker.isPositive}
								changePercent={ticker.changePercent}
							/>

							<PriceChart
								chartData={view.chartData}
								canShowChart={view.canShowChart}
								isHistoryFetching={ticker.isHistoryFetching}
								historySource={ticker.historySource}
								width={cardWidth}
								isResizing={isCardResizing}
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
								className='mx-6 h-[0.0625rem]'
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
				</ResizableWrapper>

				<div className='flex items-center gap-3 puff-in-center'>
					<ResizeToggle />
					<ResetButton />
					<ThemeToggle />
				</div>
				<MobileFooter />
			</div>
		</>
	)
}
