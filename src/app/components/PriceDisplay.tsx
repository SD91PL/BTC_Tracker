import { colors, monoFont } from '../../theme'

interface PriceDisplayProps {
	displayPrice: string
	canShowPrice: boolean
	secondaryLine: string
	animating: boolean
	isError: boolean
	onRetry: () => void
}

export function PriceDisplay({
	displayPrice,
	canShowPrice,
	secondaryLine,
	animating,
	isError,
	onRetry,
}: PriceDisplayProps) {
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
						'linear-gradient(135deg, rgba(79,255,176,0.4), rgba(99,102,241,0.15), rgba(79,255,176,0.1))',
				}}>
				<div
					className='px-6 py-3'
					style={{ borderRadius: '11px', background: 'rgba(79,255,176,0.06)' }}>
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
