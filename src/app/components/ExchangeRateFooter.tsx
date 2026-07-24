import { colors, monoFont } from '../../theme'
import { NA } from '../../constants'

// Decimal places shown in the header rate vs. the precise tooltip on hover.
// The header is rounded for readability; the tooltip exists precisely so
// that rounding error doesn't look like a bug when someone checks the math.
const DISPLAY_DECIMALS = 2
const PRECISE_DECIMALS = 6

interface ExchangeRateFooterProps {
	hasRate: boolean
	usdPlnRate: number | null
}

export function ExchangeRateFooter({
	hasRate,
	usdPlnRate,
}: ExchangeRateFooterProps) {
	return (
		<div className='px-6 pb-5 text-center'>
			<div className='relative inline-block group'>
				<p
					className='text-xs cursor-help'
					style={{ color: colors.textFaint, fontFamily: monoFont }}>
					1 USD = {hasRate ? usdPlnRate!.toFixed(DISPLAY_DECIMALS) : NA} PLN
				</p>

				{hasRate && (
					<div
						className='pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2
							opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-10'>
						<div
							style={{
								background: 'rgba(8, 11, 20, 0.9)',
								border: '1px solid rgba(247, 147, 26, 0.3)',
								backdropFilter: 'blur(12px)',
							}}
							className='px-3 py-1.5 rounded-lg'>
							<p
								style={{ color: colors.mint, fontFamily: monoFont }}
								className='text-[11px]'>
								1 USD = {usdPlnRate!.toFixed(PRECISE_DECIMALS)} PLN
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
