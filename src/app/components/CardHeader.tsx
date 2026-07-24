import { colors, monoFont } from '../../theme'
import { NA } from '../../constants'

interface CardHeaderProps {
	hasChange: boolean
	isPositive: boolean
	change24h: string | null
}

export function CardHeader({
	hasChange,
	isPositive,
	change24h,
}: CardHeaderProps) {
	return (
		<div className='flex items-center justify-between px-6 pt-6 pb-4'>
			<div className='flex items-center gap-2.5'>
				<div
					className='w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold'
					style={{
						background: `linear-gradient(135deg, ${colors.mint}, ${colors.mintDark})`,
						color: colors.bg,
						fontFamily: monoFont,
					}}>
					₿
				</div>
				<div>
					<p
						className='text-sm font-semibold tracking-wide'
						style={{ color: colors.textPrimary }}>
						Bitcoin
					</p>
					<p
						className='text-xs'
						style={{ color: colors.textMuted, fontFamily: monoFont }}>
						BTC
					</p>
				</div>
			</div>
			<div className='text-right'>
				<p
					className='text-xs mb-0.5'
					style={{ color: colors.textMuted, fontFamily: monoFont }}>
					24h
				</p>
				<p
					className='text-sm font-medium'
					style={{
						color: !hasChange
							? colors.textMuted
							: isPositive
								? colors.positive
								: colors.negative,
						fontFamily: monoFont,
					}}>
					{hasChange ? `${isPositive ? '+' : ''}${change24h}%` : NA}
				</p>
			</div>
		</div>
	)
}
