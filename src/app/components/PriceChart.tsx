import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'
import type { ChartPoint } from '../../hooks/useCurrencyView'
import type { HistorySource } from '../../api/prices'
import { CustomTooltip } from './CustomTooltip'
import { colors, monoFont } from '../../theme'
import { NA } from '../../constants'

interface PriceChartProps {
	chartData: ChartPoint[]
	canShowChart: boolean
	isHistoryFetching: boolean
	historySource: HistorySource | null
	/** Current card width in px — more room means more X-axis labels. */
	width: number
	/** True while the card is being dragged/pinched — suppresses recharts'
	 * draw-in animation so the line tracks the live width. */
	isResizing: boolean
}

// ~1 tick per this many px keeps labels readable at any card width.
const PX_PER_TICK = 58
const MIN_TICKS = 3
const MAX_TICKS = 16

export function PriceChart({
	chartData,
	canShowChart,
	isHistoryFetching,
	historySource,
	width,
	isResizing,
}: PriceChartProps) {
	// Target tick count scales with the card's current width.
	const targetTicks = Math.min(
		MAX_TICKS,
		Math.max(MIN_TICKS, Math.round(width / PX_PER_TICK)),
	)
	// Skip every Nth tick so ~targetTicks labels show regardless of range.
	const tickInterval = Math.max(
		0,
		Math.ceil(chartData.length / targetTicks) - 1,
	)

	return (
		<div className='w-full px-0'>
			<div className='w-full h-40 relative'>
				{!canShowChart && (
					<div className='absolute inset-0 flex items-center justify-center'>
						<p
							className='text-xs'
							style={{ color: colors.textMuted, fontFamily: monoFont }}>
							{NA}
						</p>
					</div>
				)}
				<div
					className='w-full h-full transition-opacity duration-200'
					style={{ opacity: canShowChart && isHistoryFetching ? 0.45 : 1 }}>
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
										stopColor={colors.mint}
										stopOpacity={0.35}
									/>
									<stop
										offset='100%'
										stopColor={colors.mint}
										stopOpacity={0.0}
									/>
								</linearGradient>
							</defs>
							<XAxis
								dataKey='time'
								interval={tickInterval}
								axisLine={false}
								tickLine={false}
								dy={8}
								tick={{
									fontSize: '0.5625rem',
									fill: 'var(--color-text-faint)',
									fontFamily: monoFont,
								}}
							/>
							<YAxis
								domain={['auto', 'auto']}
								hide
							/>
							<Tooltip
								content={<CustomTooltip />}
								cursor={{
									stroke: 'rgba(var(--color-mint-rgb), 0.3)',
									strokeWidth: 1,
									strokeDasharray: '4 4',
								}}
							/>
							<Area
								type='monotone'
								dataKey='price'
								stroke={colors.mint}
								strokeWidth={1.5}
								fill='url(#btcGrad)'
								dot={false}
								activeDot={{ r: 4, fill: colors.mint, strokeWidth: 0 }}
								isAnimationActive={!isHistoryFetching && !isResizing}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Which API served this range's history. */}
			<p
				className='text-right text-[0.5625rem] pt-0.5 pr-3 h-4'
				style={{ color: 'var(--color-text-faint)', fontFamily: monoFont }}>
				{canShowChart && historySource
					? `${historySource === 'coingecko' ? 'coingecko.com' : 'blockchain.info'}`
					: '\u00A0'}
			</p>
		</div>
	)
}
