import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'
import type { Currency } from '../../types'
import type { ChartPoint } from '../../hooks/useCurrencyView'
import { CustomTooltip } from './CustomTooltip'
import { colors, monoFont } from '../../theme'
import { NA } from '../../constants'

interface PriceChartProps {
	chartData: ChartPoint[]
	canShowChart: boolean
	currency: Currency
}

export function PriceChart({
	chartData,
	canShowChart,
	currency,
}: PriceChartProps) {
	return (
		<div className='w-full h-40 px-0 relative'>
			{!canShowChart && (
				<div className='absolute inset-0 flex items-center justify-center'>
					<p
						className='text-xs'
						style={{ color: colors.textMuted, fontFamily: monoFont }}>
						{NA}
					</p>
				</div>
			)}
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
						hide
					/>
					<YAxis
						domain={['auto', 'auto']}
						hide
					/>
					<Tooltip
						content={<CustomTooltip currency={currency} />}
						cursor={{
							stroke: 'rgba(79,255,176,0.3)',
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
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	)
}
