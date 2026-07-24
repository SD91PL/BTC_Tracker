import type { Currency } from '../../types'
import { colors, monoFont } from '../../theme'

interface CurrencyToggleProps {
	currency: Currency
	onToggle: () => void
}

export function CurrencyToggle({ currency, onToggle }: CurrencyToggleProps) {
	return (
		<div className='px-6 py-5'>
			<button
				onClick={onToggle}
				className='w-full relative group cursor-pointer'
				style={{
					borderRadius: '12px',
					padding: '1px',
					background:
						currency === 'USD'
							? 'linear-gradient(135deg, rgba(79,255,176,0.6), rgba(251,191,36,0.2))'
							: 'linear-gradient(135deg, rgba(99,102,241,0.6), rgba(139,92,246,0.2))',
					transition: 'background 0.4s ease',
				}}>
				<div
					className='w-full flex items-center justify-between px-5 py-3.5 transition-colors duration-300'
					style={{
						borderRadius: '11px',
						background: 'rgba(8, 11, 20, 0.6)',
						backdropFilter: 'blur(8px)',
					}}>
					{/* USD pill */}
					<div className='flex items-center gap-2'>
						<div
							className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300'
							style={{
								background:
									currency === 'USD'
										? `linear-gradient(135deg, ${colors.mint}, ${colors.mintDark})`
										: 'rgba(255,255,255,0.08)',
								color: currency === 'USD' ? colors.bg : colors.textMuted,
								fontFamily: monoFont,
							}}>
							$
						</div>
						<span
							className='text-sm font-medium transition-colors duration-300'
							style={{
								color: currency === 'USD' ? colors.mint : colors.textMuted,
								fontFamily: monoFont,
							}}>
							USD
						</span>
					</div>

					{/* Swap icon */}
					<svg
						width='16'
						height='16'
						viewBox='0 0 16 16'
						fill='none'
						style={{ color: colors.textMuted }}>
						<path
							d='M3 5l3-3 3 3M6 2v8M13 11l-3 3-3-3M10 14V6'
							stroke='currentColor'
							strokeWidth='1.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>

					{/* PLN pill */}
					<div className='flex items-center gap-2'>
						<span
							className='text-sm font-medium transition-colors duration-300'
							style={{
								color:
									currency === 'PLN' ? colors.indigoLight : colors.textMuted,
								fontFamily: monoFont,
							}}>
							PLN
						</span>
						<div
							className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300'
							style={{
								background:
									currency === 'PLN'
										? `linear-gradient(135deg, ${colors.indigo}, ${colors.indigoLight})`
										: 'rgba(255,255,255,0.08)',
								color: currency === 'PLN' ? '#ffffff' : colors.textMuted,
								fontFamily: monoFont,
							}}>
							zł
						</div>
					</div>
				</div>
			</button>
		</div>
	)
}
