import { useRef, useState } from 'react'
import { colors, monoFont } from '../../theme'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { currencyToggled } from '../../store/slices/currencySlice'

export function CurrencyToggle() {
	const dispatch = useAppDispatch()
	const currency = useAppSelector(state => state.currency.currency)

	const [iconRotation, setIconRotation] = useState(0)
	const [isAnimating, setIsAnimating] = useState(false)

	const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

	function handleToggle() {
		dispatch(currencyToggled())

		if (resetTimer.current) {
			clearTimeout(resetTimer.current)
		}

		setIsAnimating(true)
		setIconRotation(180)

		resetTimer.current = setTimeout(() => {
			setIsAnimating(false)
			setIconRotation(0)
		}, 350)
	}

	return (
		<div className='px-6 py-5'>
			<button
				onClick={handleToggle}
				className='relative w-full overflow-hidden cursor-pointer'
				style={{ borderRadius: 12 }}>
				{/* USD gradient */}
				<div
					className='absolute inset-0'
					style={{
						borderRadius: 12,
						background:
							'linear-gradient(135deg, rgba(var(--color-mint-rgb), 0.6), rgba(var(--color-amber-rgb), 0.2))',
						opacity: currency === 'USD' ? 1 : 0,
						transition: 'opacity .4s ease',
					}}
				/>

				{/* PLN gradient */}
				<div
					className='absolute inset-0'
					style={{
						borderRadius: 12,
						background:
							'linear-gradient(135deg, rgba(var(--color-indigo-rgb), 0.6), rgba(var(--color-violet-rgb), 0.2))',
						opacity: currency === 'PLN' ? 1 : 0,
						transition: 'opacity .4s ease',
					}}
				/>

				{/* Inner panel */}
				<div
					className='absolute inset-px'
					style={{
						borderRadius: 11,
						background: 'rgba(var(--color-bg-rgb), 0.6)',
						backdropFilter: 'blur(8px)',
						WebkitBackdropFilter: 'blur(8px)',
					}}
				/>

				{/* Content */}
				<div className='relative flex items-center justify-between px-5 py-3.5'>
					{/* USD */}
					<div className='flex items-center gap-2'>
						<div className='relative w-6 h-6 rounded-full overflow-hidden'>
							<div
								className='absolute inset-0'
								style={{
									background: 'rgba(var(--color-surface-rgb), 0.08)',
									opacity: currency === 'USD' ? 0 : 1,
									transition: 'opacity .3s ease',
								}}
							/>

							<div
								className='absolute inset-0'
								style={{
									background: `linear-gradient(135deg, ${colors.mint}, ${colors.mintDark})`,
									opacity: currency === 'USD' ? 1 : 0,
									transition: 'opacity .3s ease',
								}}
							/>

							<span
								className='relative flex items-center justify-center w-full h-full text-xs font-bold'
								style={{
									color:
										currency === 'USD'
											? 'rgb(var(--color-on-mint-rgb))'
											: colors.textMuted,
									fontFamily: monoFont,
								}}>
								$
							</span>
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

					{/* Icon */}
					<svg
						width='16'
						height='16'
						viewBox='0 0 16 16'
						fill='none'
						style={{
							color: colors.textMuted,
							transform: `rotate(${iconRotation}deg)`,
							transformOrigin: 'center',
							transition: isAnimating ? 'transform 350ms ease' : 'none',
						}}>
						<path
							d='M3 5l3-3 3 3M6 2v8M13 11l-3 3-3-3M10 14V6'
							stroke='currentColor'
							strokeWidth='1.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>

					{/* PLN */}
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

						<div className='relative w-6 h-6 rounded-full overflow-hidden'>
							<div
								className='absolute inset-0'
								style={{
									background: 'rgba(var(--color-surface-rgb), 0.08)',
									opacity: currency === 'PLN' ? 0 : 1,
									transition: 'opacity .3s ease',
								}}
							/>

							<div
								className='absolute inset-0'
								style={{
									background: `linear-gradient(135deg, ${colors.indigo}, ${colors.indigoLight})`,
									opacity: currency === 'PLN' ? 1 : 0,
									transition: 'opacity .3s ease',
								}}
							/>

							<span
								className='relative flex items-center justify-center w-full h-full text-xs font-bold'
								style={{
									color:
										currency === 'PLN'
											? 'rgb(var(--color-on-accent-rgb))'
											: colors.textMuted,
									fontFamily: monoFont,
								}}>
								zł
							</span>
						</div>
					</div>
				</div>
			</button>
		</div>
	)
}
