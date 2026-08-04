import { colors, monoFont } from '../../theme'
import { NA, TIME_RANGES, RANGE_CONFIG } from '../../constants'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { rangeChanged } from '../../store/slices/timeRangeSlice'

interface CardHeaderProps {
	hasChange: boolean
	isPositive: boolean
	changePercent: string | null
}

export function CardHeader({
	hasChange,
	isPositive,
	changePercent,
}: CardHeaderProps) {
	const dispatch = useAppDispatch()
	const range = useAppSelector(state => state.timeRange.range)

	return (
		<div className='flex items-center justify-between px-6 pt-6 pb-4'>
			<div className='flex items-center gap-2.5'>
				<div
					className='w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold'
					style={{
						background: `linear-gradient(135deg, ${colors.mint}, ${colors.mintDark})`,
						color: 'rgb(var(--color-on-mint-rgb))',
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
				{/* Range picker; also labels what period the % change below covers. */}
				<p
					id='change-time-label'
					role='tablist'
					aria-label='Chart time range'
					className='text-xs mb-0.5 flex items-center justify-end gap-1.5'
					style={{ fontFamily: monoFont }}>
					{TIME_RANGES.map(r => {
						const isActive = r === range
						return (
							<button
								key={r}
								role='tab'
								aria-selected={isActive}
								onClick={() => dispatch(rangeChanged(r))}
								className='cursor-pointer transition-colors duration-200 hover:opacity-80'
								style={{
									color: isActive ? colors.mint : colors.textMuted,
									fontWeight: isActive ? 700 : 400,
								}}>
								{RANGE_CONFIG[r].headerLabel}
							</button>
						)
					})}
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
					{hasChange ? `${isPositive ? '+' : ''}${changePercent}%` : NA}
				</p>
			</div>
		</div>
	)
}
