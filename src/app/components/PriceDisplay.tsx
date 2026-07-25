import { useEffect, useRef, useState } from 'react'
import { colors, monoFont } from '../../theme'
import { CURRENCY_TOGGLE_DELAY_MS } from '../../constants'
import { useAppSelector } from '../../store/hooks'

interface PriceDisplayProps {
	displayPrice: string
	canShowPrice: boolean
	secondaryLine: string
	isError: boolean
	onRetry: () => void
}

export function PriceDisplay({
	displayPrice,
	canShowPrice,
	secondaryLine,
	isError,
	onRetry,
}: PriceDisplayProps) {
	const currency = useAppSelector(state => state.currency.currency)
	const [fading, setFading] = useState(false)

	// Snapshot of what's rendered, decoupled from live props, so the old
	// price stays visible while dimming instead of swapping instantly.
	const [rendered, setRendered] = useState({
		displayPrice,
		canShowPrice,
		secondaryLine,
	})

	const prevCurrency = useRef(currency)
	const isSwapping = useRef(false)

	// Currency changed: dim, swap to the new value, fade back in.
	useEffect(() => {
		if (currency === prevCurrency.current) return
		prevCurrency.current = currency
		isSwapping.current = true

		setFading(true)
		const timer = setTimeout(() => {
			setRendered({ displayPrice, canShowPrice, secondaryLine })
			setFading(false)
			isSwapping.current = false
		}, CURRENCY_TOGGLE_DELAY_MS)

		return () => clearTimeout(timer)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currency])

	// Regular price refetches (not a currency swap) update immediately.
	useEffect(() => {
		if (isSwapping.current) return
		setRendered({ displayPrice, canShowPrice, secondaryLine })
	}, [displayPrice, canShowPrice, secondaryLine])

	return (
		<div className='px-6 py-5 text-center'>
			<p
				className='text-xs uppercase tracking-widest mb-2'
				style={{ color: colors.textMuted, fontFamily: monoFont }}>
				Current price
			</p>

			{/* Gradient border on price block */}
			<div
				className='relative inline-block'
				style={{
					borderRadius: '12px',
					padding: '1px',
					background:
						'linear-gradient(135deg, rgba(var(--color-mint-rgb), var(--price-panel-border-alpha-1)), rgba(var(--color-indigo-rgb), var(--price-panel-border-alpha-2)), rgba(var(--color-mint-rgb), var(--price-panel-border-alpha-3)))',
				}}>
				<div
					className='px-6 py-3'
					style={{
						borderRadius: '11px',
						background:
							'rgba(var(--color-mint-rgb), var(--price-panel-fill-alpha))',
					}}>
					<p
						className='text-3xl font-semibold tracking-tight'
						style={{
							fontFamily: monoFont,
							color: rendered.canShowPrice ? colors.mint : colors.textMuted,
							opacity: fading ? 0.4 : 1,
							transition: `opacity ${CURRENCY_TOGGLE_DELAY_MS}ms ease`,
							letterSpacing: '-0.02em',
						}}>
						{rendered.displayPrice}
					</p>
				</div>
			</div>

			<p
				className='text-xs mt-2'
				style={{ color: colors.textMuted, fontFamily: monoFont }}>
				{rendered.secondaryLine}
			</p>

			{isError && (
				<button
					onClick={onRetry}
					className='mt-3 text-xs underline cursor-pointer'
					style={{ color: colors.negative, fontFamily: monoFont }}>
					Couldn't load data · Retry
				</button>
			)}
		</div>
	)
}
