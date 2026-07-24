import type { Currency } from '../../types'
import { formatCurrency } from '../../utils/currency'
import { colors, monoFont } from '../../theme'

interface CustomTooltipProps {
	active?: boolean
	payload?: { value: number }[]
	label?: string
	currency: Currency
}

export function CustomTooltip({
	active,
	payload,
	label,
	currency,
}: CustomTooltipProps) {
	if (!active || !payload || !payload.length) return null

	// payload values are already converted to the selected currency
	// by useCurrencyView — no conversion needed here
	const value = formatCurrency(payload[0].value, currency)

	return (
		<div
			style={{
				background: 'rgba(8, 11, 20, 0.85)',
				border: '1px solid rgba(247, 147, 26, 0.3)',
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
