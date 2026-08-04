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
}

// Target tick count on the X-axis — dense enough to convey the range's
// shape, sparse enough not to crowd a ~350px-wide card.
const TARGET_TICKS = 5

export function PriceChart({
	chartData,
	canShowChart,
	isHistoryFetching,
	historySource,
}: PriceChartProps) {
	// Skip every Nth tick so ~TARGET_TICKS labels show regardless of range.
	const tickInterval = Math.max(
		0,
		Math.ceil(chartData.length / TARGET_TICKS) - 1,
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
									fontSize: 9,
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
								isAnimationActive={!isHistoryFetching}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Which API served this range's history (CoinGecko normally, blockchain.info for 5Y/MAX or on failure). */}
			<p
				className='text-right text-[9px] pr-1 h-4'
				style={{ color: 'var(--color-text-faint)', fontFamily: monoFont }}>
				{canShowChart && historySource
					? `via ${historySource === 'coingecko' ? 'coingecko.com' : 'blockchain.info'}`
					: '\u00A0'}
			</p>
		</div>
	)
}
