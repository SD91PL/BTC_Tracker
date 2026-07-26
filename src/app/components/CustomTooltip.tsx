import { formatCurrency } from '../../utils/currency'
import { colors, monoFont } from '../../theme'
import { useAppSelector } from '../../store/hooks'

interface CustomTooltipProps {
	active?: boolean
	payload?: { value: number }[]
	label?: string
}

export function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
	const currency = useAppSelector(state => state.currency.currency)

	if (!active || !payload || !payload.length) return null

	// Values already converted by useCurrencyView.
	const value = formatCurrency(payload[0].value, currency)

	return (
		<div
			style={{
				background: 'rgba(var(--color-bg-rgb), 0.85)',
				border: '1px solid rgba(var(--color-bitcoin-rgb), 0.3)',
				backdropFilter: 'blur(12px)',
			}}
			className='px-3 py-2 rounded-lg'>
			<p
				style={{ color: colors.textMuted, fontFamily: monoFont }}
				className='text-[10px] mb-0.5'>
				{label}
			</p>
			<p
				style={{ color: colors.mint, fontFamily: monoFont }}
				className='text-xs'>
				{value}
			</p>
		</div>
	)
}
