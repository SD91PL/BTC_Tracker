import { colors, monoFont } from '../../theme'
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
	const animating = useAppSelector(state => state.currency.animating)

	return (
		<div className='px-6 py-5 text-center'>
			<p
				className='text-xs uppercase tracking-widest mb-2'
				style={{ color: colors.textMuted, fontFamily: monoFont }}>
				Current price
			</p>

			{/* Price panel border */}
			<div
				className='relative inline-block'
				style={{
					borderRadius: '0.75rem',
					padding: '0.0625rem',
					background:
						'linear-gradient(135deg, rgba(var(--color-mint-rgb), var(--price-panel-border-alpha-1)), rgba(var(--color-indigo-rgb), var(--price-panel-border-alpha-2)), rgba(var(--color-mint-rgb), var(--price-panel-border-alpha-3)))',
				}}>
				<div
					className='px-6 py-3'
					style={{ borderRadius: '0.6875rem', background: 'rgba(var(--color-mint-rgb), var(--price-panel-fill-alpha))' }}>
					<p
						className='text-3xl font-semibold tracking-tight transition-opacity duration-150'
						style={{
							fontFamily: monoFont,
							color: canShowPrice ? colors.mint : colors.textMuted,
							opacity: animating ? 0.4 : 1,
							letterSpacing: '-0.02em',
						}}>
						{displayPrice}
					</p>
				</div>
			</div>

			<p
				className='text-xs mt-2'
				style={{ color: colors.textMuted, fontFamily: monoFont }}>
				{secondaryLine}
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
